import './App.css';
import Button from 'react-bootstrap/Button';
import React from 'react';
import Navigation from './components/common/Navigation';

const axios = require('axios').default;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {
        displayName: "",
      },
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

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

  setUser(user) {
    this.setState({ user });
  }

  async handleLogin(values) {
    return new Promise((resolve) => axios.post(`${process.env.REACT_APP_API_URL}/login`, values, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          this.setUser(res.data.user);
          resolve(true);
        } else {
          console.error(res.data);
          resolve(false);
        }
      }),
    );
  }

  async handleRegister(values) {
    return new Promise((resolve) => axios.post(`${process.env.REACT_APP_API_URL}/register`, values, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          this.setUser(res.data.user);
          resolve(true);
        } else {
          console.error(res.data);
          resolve(false);
        }
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
