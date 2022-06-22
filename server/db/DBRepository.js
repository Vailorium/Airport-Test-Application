const { Pool } = require('pg');

/**
 * @typedef DBUser
 * @type {object}
 * @property {int} id
 * @property {string} display_name
 * @property {string} username
 * @property {string} password
 * @property {string} salt
 */

/**
 * @typedef DBPlane
 * @type {object}
 * @property {int} id
 * @property {string} name
 * @property {int} seats
 */

/**
 * @typedef DBAvailableFlight
 * @type {object}
 * @property {int} flight_id
 * @property {string} plane_name
 * @property {int} plane_capacity
 * @property {int} route_id
 * @property {string} departure_location
 * @property {Date} departure_time
 * @property {string} arrival_location
 * @property {Date} arrival_time
 * @property {int} price
 * @property {string} departure_location_full
 * @property {string} arrival_location_full
 * @property {int} seats
 */

/**
 * @typedef DBMyBooking
 * @type {object}
 * @property {int} flight_id
 * @property {string} name
 * @property {int} seats
 * @property {int} route_id
 * @property {string} departure_location
 * @property {Date} departure_time
 * @property {string} arrival_location
 * @property {Date} arrival_time
 * @property {int} price
 * @property {string} departure_location_full
 * @property {string} arrival_location_full
 * @property {int} booking_id
 */

/**
 * @typedef UserRoute
 * @type {object}
 * @property {string} departureLocation
 * @property {string} arrivalLocation
 * @property {string} departureTime
 * @property {string} arrivalTime
 * @property {number} price
 */

/**
 * @typedef DBAirport
 * @type {object}
 * @property {string} code
 * @property {string} name
 */
class DBRepository {
  constructor() {
    this.pool = new Pool();
  }

  /**
   * 
   * @param {string} username 
   * @returns {DBUser} user
   */
  async getUserByUsername(username) {
    var result;
    try{
      result = await this.pool.query('SELECT * FROM USERS WHERE username = $1', [username]);
    } catch(e) {
      throw e;
    }
    return result.rows[0];
  }
  
  /**
   * 
   * @param {int} id User ID
   * @returns {DBUser} user
   */
  async getUserById(id) {
    var result;
    try {
      result = await this.pool.query('SELECT * FROM USERS WHERE id = $1', [id]);
    } catch(e) {
      throw e;
    }
    return result.rows[0];
  }

  /**
   * Registers user in database
   * @param {string} displayName User's (visible) display name
   * @param {string} username User's unique username
   * @param {string} password User's hashed password
   * @param {string} salt User's salt
   * @returns User id and display name
   */
  async register(displayName, username, password, salt) {
    var result;
    try{
      result = await this.pool.query('INSERT INTO users (display_name, username, is_admin, password, salt) VALUES ($1, $2, FALSE, $3, $4) RETURNING id, display_name', [
        displayName,
        username,
        password,
        salt,
      ]);
    } catch(e) {
      throw e;
    }
    return result.rows[0];
  }

  /**
   * Gets all (full, including connecting) routes in order of flight id, then route id, that go from departureLocation to arrivalLocation
   * that arrive between dateFrom and dateTo
   * @param {string} departureLocation 
   * @param {string} arrivalLocation 
   * @param {Date} dateFrom 
   * @param {Date} dateTo 
   * @returns {DBAvailableFlight[]}
   */
  async getFlights(departureLocation, arrivalLocation, dateFrom, dateTo) {
    var result;
    try {
      const query = `
      WITH x AS (
      SELECT * FROM available_flights_table WHERE departure_location = $1 AND departure_time > now()
      ), y AS (
        SELECT * FROM available_flights_table WHERE arrival_location = $2 AND arrival_time >= $3 AND arrival_time <= $4
      ), z AS (
        SELECT x.flight_id, x.route_id as dep_id, y.route_id AS arr_id FROM x
        JOIN Y ON x.flight_id = y.flight_id
      )
      SELECT
        available_flights_table.flight_id, plane_name, plane_capacity, route_id, departure_location, departure_time,
        arrival_location, arrival_time, price, departure_location_full, arrival_location_full,
        seats
      FROM available_flights_table
      INNER JOIN z ON available_flights_table.flight_id = z.flight_id
      WHERE available_flights_table.route_id >= z.dep_id AND available_flights_table.route_id <= z.arr_id
      ORDER BY departure_time, flight_id, route_id;
      `
      result = await this.pool.query(query, [departureLocation, arrivalLocation, dateFrom, dateTo]);
    } catch(e) {
      throw e;
    }
    return result.rows;
  }

  /**
   * Gets all airports
   * @returns {DBAirport[]}
   */
  async getAirports() {
    var result;
    try {
      result = await this.pool.query('SELECT code, name FROM airports');
    } catch(e) {
      throw e;
    }
    return result.rows;
  }

  /**
   * Gets the total capacity of the plane minus the number of taken seats for a given route
   * @param {number} routeId 
   * @returns {number}
   */
  async getRouteSeats(routeId) {
    var result;
    try {
      const query = `
      SELECT planes.seats as plane_capacity, COUNT(bookings.id) as taken_seats
      FROM routes
      INNER JOIN flights ON flights.id = routes.flight_id
      INNER JOIN planes ON planes.id = flights.plane_id
      LEFT JOIN bookings ON bookings.route_id = routes.id
      WHERE routes.id=$1
      GROUP BY planes.seats
      `;
      result = await this.pool.query(query, [routeId])
    } catch(e) {
      throw e;
    }
    console.log(result);
    if(result.rows.length == 0) {
      throw new Error('Invalid route ID');
    }
    return result.rows[0].plane_capacity - result.rows[0].taken_seats;
  }

  /**
   * Books route for a user seatCount times
   * @param {number} userId 
   * @param {number} routeId 
   * @param {number} seatCount Seats to book
   */
  async bookRouteSeats(userId, routeId, seatCount) {
    for(let i = 0; i < seatCount; i++) {
      var result;
      try {
        result = await this.pool.query('INSERT INTO bookings (user_id, route_id) VALUES($1, $2)', [userId, routeId])
      } catch(e) {
        throw e;
      }
    }
  }

  /**
   * Gets all routes user has booked
   * @param {number} userId 
   * @returns {DBMyBooking[]}
   */
  async getUserBookings(userId) {
    const query = `
    SELECT
      flights.id as flight_id, bookings.route_id, bookings.id as booking_id, planes.name, planes.seats, routes.departure_location, routes.departure_time,
      routes.arrival_location, routes.arrival_time, routes.price,
      departure_airport.name as departure_location_full, arrival_airport.name as arrival_location_full
    FROM bookings
    INNER JOIN
      routes ON routes.id = bookings.route_id
    INNER JOIN
      flights ON flights.id = routes.flight_id
    INNER JOIN
      planes ON planes.id = flights.plane_id
    INNER JOIN 
      airports departure_airport ON departure_airport.code = routes.departure_location
    INNER JOIN
      airports arrival_airport ON arrival_airport.code = routes.arrival_location
    WHERE user_id = $1
    ORDER BY bookings.id
    `;
    let result;
    try {
      result = await this.pool.query(query, [userId]);
    } catch(e) {
      throw e;
    }
    return result.rows;
  }

  /**
   * Deletes user booking
   * @param {number} userId 
   * @param {number} bookingId 
   * @returns {boolean} true if successfully deleted, false otherwise
   */
  async deleteUserBooking(userId, bookingId) {
    let result;
    try {
      result = await this.pool.query('DELETE FROM bookings WHERE user_id=$1 AND id=$2 RETURNING id', [userId, bookingId]);
    } catch(e) {
      throw e;
    }
    return result.rows.length > 0;
  }

  /**
   * Gets all planes
   * @returns {DBPlane[]}
   */
  async getPlanes() {
    let result;
    try {
      result = await this.pool.query('SELECT * FROM planes');
    } catch(e) {
      throw e;
    }
    return result.rows;
  }

  /**
   * Add flight to database
   * @param {number} planeId 
   * @returns {number} Generated flightId
   */
  async addFlight(planeId) {
    let result;
    try {
      result = await this.pool.query('INSERT INTO flights (plane_id) VALUES ($1) RETURNING id', [planeId]);
    } catch (e) {
      throw e;
    }
    return result.rows[0].id;
  }

  /**
   * 
   * @param {number} flightId Generated flightId from addFlight
   * @param {UserRoute} route Submitted route data
   */
  async addRoute(flightId, route) {
    let result;
    const query = `
    INSERT INTO routes(flight_id, departure_location, arrival_location, departure_time, arrival_time, price)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    try {
      result = await this.pool.query(query, [flightId, route.departureLocation, route.arrivalLocation, route.departureTime, route.arrivalTime, route.price]);
    } catch(e) {
      throw e;
    }
    return;
  }
}
module.exports = new DBRepository();