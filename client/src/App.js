import './App.css';
import React from 'react';
import Navigation from './components/common/Navigation';

const axios = require('axios').default;

/**
 * @typedef User
 * @type {object}
 * @property {string} displayName User's public display name
 */
class App extends React.Component {
  constructor() {
    super();

    // user state management, passed to children as needed
    this.state = {
      user: {
        displayName: "",
      },
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    // grab user profile after component load
    this.getUser();
  }

  /**
   * Gets user, if user isn't loaded then attempts to load user profile
   * @returns {User}
   */
  async getUser() {
    // if user data hasn't been grabbed from server
    if(!this.state.user.displayName) {
      await axios.get(`${process.env.REACT_APP_API_URL}/profile`, { withCredentials: true })
        .then((res) => {
          if(res.status === 200) {
            this.setUser(res.data.user);
          } else {
            // redirect to login
            console.error(res.data);
          }
        })
    }
    return this.state.user;
  }

  /**
   * Sets user state
   * @param {User} user 
   */
  setUser(user) {
    this.setState({ user });
  }

  /**
   * 
   * @param {object} values Login form data
   * @returns {Promise<boolean>} True if login successful, false if login failed (for any reason)
   */
  async handleLogin(values) {
    return new Promise((resolve) => axios.post(`${process.env.REACT_APP_API_URL}/login`, values, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          this.setUser(res.data.user);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        resolve(false);
      }),
    );
  }

  /**
   * 
   * @param {object} values Register form data
   * @returns {Promise<boolean>} True if registration successful, false if registration failed (for any reason)
   */
  async handleRegister(values) {
    return new Promise((resolve) => axios.post(`${process.env.REACT_APP_API_URL}/register`, values, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          this.setUser(res.data.user);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        resolve(false);
      }),
    );
  }

  render() {
    return (
      <>
        <Navigation handleLogin={this.handleLogin} handleRegister={this.handleRegister} userProfile={this.state.user} />
      </>
    );
  }
}
export default App;
