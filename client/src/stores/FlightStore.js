const axios = require('axios').default;

/**
 * @typedef Airport
 * @type {object}
 * @property {string} code 4 character code representing the airport
 * @property {string} name Name of airport
 */

/**
 * @typedef FlightRoute
 * @type {object}
 * @property {number} routeId
 * @property {string} departureLocation
 * @property {string} departureTime Date string
 * @property {string} departureLocationFull
 * @property {string} arrivalLocation
 * @property {string} arrivalTime Date string
 * @property {string} arrivalLocationFull
 * @property {number} price
 * @property {string} seats
 */

/**
 * @typedef Flight
 * @type {object}
 * @property {number} flightId
 * @property {string} planeName
 * @property {number} planeCapacity
 * @property {FlightRoute[]} routes
 */

/**
 * @typedef BookingRoute
 * @type {object}
 * @property {number} routeId
 * @property {string} departureLocation
 * @property {string} departureTime Date string
 * @property {string} departureLocationFull
 * @property {string} arrivalLocation
 * @property {string} arrivalTime Date string
 * @property {string} arrivalLocationFull
 * @property {number} price
 * @property {number} bookingId
 */

/**
 * @typedef Booking
 * @type {object}
 * @property {number} flightId
 * @property {string} planeName
 * @property {number} planeCapacity
 * @property {BookingRoute[]} routes
 */

/**
 * @typedef Plane
 * @type {object}
 * @property {number} id
 * @property {string} name
 * @property {number} seats Plane capacity
 */

class FlightStore {
  constructor() {
    this.state = {
      airportsLoading: false,
      airports: [],
      planesLoading: false,
      planes: [],
      availableFlightsLoading: false,
      availableFlights: [],
      myBookings: [],
      myBookingsLoading: false,
    }

    this.timezones = {
      "NZNE": "Pacific/Auckland",
      "NZTL": "Pacific/Auckland",
      "NZGB": "Pacific/Auckland",
      "NZRO": "Pacific/Auckland",
      "YSSY": "Australia/Sydney",
      "NZCI": "Pacific/Chatham",
    };
  }

  /**
   * 
   * @param {string} airportCode 4 character airport code
   * @returns Timezone string (e.g. Pacific/Auckland) if found, null if not found (will default date to local timezone) 
   */
  getTimezoneByAirportCode(airportCode) {
    const timezone = this.timezones[airportCode];

    // if couldn't find airport, send null (will cause date to default to local timezone)
    return timezone ? timezone : null;
  }

  /**
   * Loads airports
   */
  async loadAirports() {
    this.state.airportsLoading = true;
    await axios.get(`/flight/airports`, { withCredentials: true })
        .then((res) => {
          if(res.status === 200) {
            this.setAirports(res.data);
          } else {
            console.error(res);
          }
        });
    this.state.airportsLoading = false;
  }

  /**
   * 
   * @returns {Airport[]}
   */
  getAirports() {
    if(this.state.airports.length === 0 && !this.state.airportsLoading) {
      this.loadAirports();
    }
    return this.state.airports;
  }

  /**
   * 
   * @param {Airport[]} airports 
   */
  async setAirports(airports) {
    this.state.airports = airports;
  }

  /**
   * Load available flights into state based on parameters
   * @param {string} from 
   * @param {string} to 
   * @param {Date} start 
   * @param {Date} end 
   */
  async loadAvailableFlights(from, to, start, end) {
    this.state.availableFlightsLoading = true;
    await axios.get(`/flight/flights?from=${from}&to=${to}&start=${start.toJSON()}&end=${end.toJSON()}`, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          this.setAvailableFlights(res.data);
        } else {
          console.error(res);
        }
        this.state.availableFlightsLoading = false;
      });
  }

  /**
   * 
   * @returns {Flight[]}
   */
  getAvailableFlights() {
    return this.state.availableFlights;
  }

  /**
   * 
   * @param {Flight[]} flights 
   */
  async setAvailableFlights(flights) {
    this.state.availableFlights = flights;
  }

  /**
   * Loads user bookings to state
   */
  async loadMyBookings() {
    this.state.myBookingsLoading = true;
    await axios.get(`/booking/bookings`, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          this.setMyBookings(res.data);
        } else {
          console.error(res);
        }
        this.state.myBookingsLoading = false;
      });
  }

  /**
   * 
   * @returns {Booking[]}
   */
  getMyBookings() {
    return this.state.myBookings;
  }

  /**
   * 
   * @param {Booking[]} bookings 
   */
  setMyBookings(bookings) {
    this.state.myBookings = bookings;
  }

  /**
   * Load plane data into state
   */
  async loadPlanes() {
    this.state.planesLoading = true;
    await axios.get('/flight/planes', { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          this.setPlanes(res.data);
        } else {
          console.error(res);
        }
        this.state.planesLoading = false;
      })
  }

  /**
   * 
   * @returns {Plane[]}
   */
  getPlanes() {
    return this.state.planes;
  }

  /**
   * 
   * @param {Plane[]} planes 
   */
  setPlanes(planes) {
    this.state.planes = planes;
  }
}
export default new FlightStore();