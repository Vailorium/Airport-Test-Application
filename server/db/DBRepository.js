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
      result = await this.pool.query('INSERT INTO users (display_name, username, password, salt) VALUES ($1, $2, $3, $4) RETURNING id, display_name', [
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
      SELECT * FROM available_flights_table WHERE departure_location = $1 AND departure_time < now()
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
      ORDER BY flight_id, route_id;
      `
      result = await this.pool.query(query, [departureLocation, arrivalLocation, dateFrom, dateTo]);
    } catch(e) {
      throw e;
    }
    return result.rows;
  }

  /**
   * 
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
}
module.exports = new DBRepository();