import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Carousel from 'react-bootstrap/Carousel';
import carousel1 from '../../assets/carousel-1.jpg'
import carousel2 from '../../assets/carousel-2.jpg'
import carousel3 from '../../assets/carousel-3.jpg'

function Home() {
  return (
    <Container>
      <Row className="mb-4">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={carousel1}
              alt="plane"
            />
            <Carousel.Caption>
              <h3>Fly Anywhere!</h3>
              <p>To select locations</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={carousel2}
              alt="plane"
            />
            <Carousel.Caption>
              <h3>Locally owned and operated</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={carousel3}
              alt="plane"
            />
            <Carousel.Caption>
              <h3>Cheap and Quiet Flights</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Row>
      <Row>
        <h1 className="text-center">Welcome to Dairy Flat Flights</h1>
        <hr />
      </Row>
      <Row>
        <p>We serve flights out of Dairy Flat (NZNE) to other locations as needed. To start, register an account or log in using a pre-existing one.</p>
        <p>We handle booking, and returns, for flights anywhere from select locations. Cancellable at anytime for a 100% refund! So why not book a flight and take your whole family on a vacation!</p>
      </Row>
      <Row>
        <p>For demonstration purposes, a couple of test accounts have been made. The register function still works, but these users already exist if you want to use them:</p>
        <table>
          <tr>
            <th>User Type</th>
            <th>Username</th>
            <th>Password</th>
          </tr>
          <tr>
            <td>Regular User</td>
            <td>test</td>
            <td>asdfasdf</td>
          </tr>
          <tr>
            <td>Admin User</td>
            <td>admin</td>
            <td>asdfasdf</td>
          </tr>
        </table>
      </Row>
    </Container>
  )
}
export default Home;