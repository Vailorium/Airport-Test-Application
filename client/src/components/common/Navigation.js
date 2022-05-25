import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function Navigation(props) {

  const { handleLogin, handleRegister, userProfile } = props;
  
  const [ showLogin, setShowLogin ] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [ showRegister, setShowRegister ] = useState(false);

  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);

  return (
    <>
      <Navbar bg="light" expand="lg">
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
                    <Nav.Link href="#">My Bookings</Nav.Link>
                    <Nav.Link href="#">Available Flights</Nav.Link>
                  </>
                )
              }
            </Nav>
            {
              // Display user details if logged in, otherwise display login/register buttons
              userProfile.displayName ? (
                <div className="ms-auto align-middle">
                  Hello {userProfile.displayName}!
                </div>
              ) : (
                <div className="ms-auto">
                  <Button className="me-2" variant="outline-primary" onClick={handleShowLogin}>Login</Button>
                  <Button variant="outline-primary" onClick={handleShowRegister}>Register</Button>
                </div>
              )
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm handleLogin={handleLogin} modalHide={handleCloseLogin} />
        </Modal.Body>
      </Modal>

      <Modal show={showRegister} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterForm handleRegister={handleRegister} modalHide={handleCloseRegister} />
        </Modal.Body>
      </Modal>
    </>
  );
}
export default Navigation;