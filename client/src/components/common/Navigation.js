import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Link } from 'react-router-dom';
import UserStore from '../../stores/UserStore';
import NavDropdown from 'react-bootstrap/NavDropdown';

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLogin: false,
      showRegister: false,
    }

    this.handleCloseLogin = this.handleCloseLogin.bind(this);
    this.handleShowLogin = this.handleShowLogin.bind(this);
    this.handleCloseRegister = this.handleCloseRegister.bind(this);
    this.handleShowRegister = this.handleShowRegister.bind(this);
  }

  async componentDidMount() {
    await UserStore.preloadUser();
    this.forceUpdate();
  }

  handleCloseLogin() {
    this.setState({showLogin: false});
  }

  handleShowLogin() {
    this.setState({showLogin: true});
  }

  handleCloseRegister() {
    this.setState({showRegister: false});
  }

  handleShowRegister() {
    this.setState({showRegister: true});
  }

  render() {
    const userProfile = UserStore.getUser();
  
    return (
      <>
        <Navbar bg="light" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand href="/">Dairy Flat Flights</Navbar.Brand>
            <Navbar.Toggle aria-controls="main-navbar-collapse" />
            <Navbar.Collapse id="main-navbar-collapse">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                {
                  // only display these options if the user is logged in
                  userProfile.displayName && (
                    <>
                      <Nav.Link href="bookings">My Bookings</Nav.Link>
                      <Link to="flights" className='nav-link'>Available Flights</Link>
                    </>
                  )
                }
              </Nav>
              {
                userProfile.isAdmin && <p>Hi Admin!</p>
              }
              {
                // Display user details if logged in, otherwise display login/register buttons
                userProfile.displayName ? (
                  <NavDropdown title={`Hello ${userProfile.displayName}`} id="user-dropdown" className="ms-auto align-middle">
                    <NavDropdown.Item onClick={() => UserStore.logoutUser()}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <div className="ms-auto">
                    <Button className="me-2" variant="outline-primary" onClick={this.handleShowLogin}>Login</Button>
                    <Button variant="outline-primary" onClick={this.handleShowRegister}>Register</Button>
                  </div>
                )
              }
            </Navbar.Collapse>
          </Container>
        </Navbar>
  
        <Modal show={this.state.showLogin} onHide={this.handleCloseLogin}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LoginForm modalHide={this.handleCloseLogin} />
          </Modal.Body>
        </Modal>
  
        <Modal show={this.state.showRegister} onHide={this.handleCloseRegister}>
          <Modal.Header closeButton>
            <Modal.Title>Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RegisterForm modalHide={this.handleCloseRegister} />
          </Modal.Body>
        </Modal>
      </>
    );
  } 
}
export default Navigation;