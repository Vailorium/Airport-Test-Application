const axios = require('axios').default;

/**
 * @typedef Airport
 * @type {object}
 * @property {string} code 4 character code representing the airport
 * @property {string} name Name of airport
 */
class FlightStore {
  constructor() {
    this.state = {
      airportsLoading: false,
      airports: [],
      availableFlightsLoading: false,
      availableFlights: [],
    }
  }

  /**
   * Loads airports
   */
  async loadAirports() {
    this.state.airportsLoading = true;
    await axios.get(`${process.env.REACT_APP_API_URL}/airports`, { withCredentials: true })
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
   * 
   * @param {string} from 
   * @param {string} to 
   * @param {Date} start 
   * @param {Date} end 
   */
  async loadAvailableFlights(from, to, start, end) {
    this.state.availableFlightsLoading = true;
    await axios.get(`${process.env.REACT_APP_API_URL}/flights?from=${from}&to=${to}&start=${start.toJSON()}&end=${end.toJSON()}`, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          this.setAvailableFlights(res.data);
        } else {
          console.error(res);
        }
        this.state.availableFlightsLoading = false;
      });
  }

  getAvailableFlights() {
    return this.state.availableFlights;
  }

  async setAvailableFlights(flights) {
    this.state.availableFlights = flights;
  }
}
export default new FlightStore();