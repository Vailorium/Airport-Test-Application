import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyBookingsTable from './MyBookingsTable';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FlightStore from '../../stores/FlightStore';
const axios = require('axios').default;

class MyBookings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBookings: [],
    };

    this.toggleAllBookings = this.toggleAllBookings.bind(this);
    this.toggleBooking = this.toggleBooking.bind(this);
    this.addBooking = this.addBooking.bind(this);
    this.removeBooking = this.removeBooking.bind(this);

    this.handleDeleteBookings = this.handleDeleteBookings.bind(this);
  }
  
  toggleAllBookings(bookings, checked) {
    // toggle all bookings provided given the checked provided (turns all selected bookings on or off)
    if(checked) {
      for(let booking of bookings) {
        this.addBooking(booking.bookingId);
      }
    } else {
      for(let booking of bookings) {
        const index = this.state.selectedBookings.indexOf(booking.bookingId);
        if(index > -1) {
          this.removeBooking(index);
        }
      }
    }
  }

  toggleBooking(bookingId) {
    // turn booking on/of
    const index = this.state.selectedBookings.indexOf(bookingId);
    if(index > -1) {
      this.removeBooking(index);
    } else {
      this.addBooking(bookingId);
    }
  }

  addBooking(bookingId) {
    // since state is immuntable, assign new array to push then set state
    const newArray = this.state.selectedBookings;
    newArray.push(bookingId);
    this.setState({selectedBookings: newArray});
  }

  removeBooking(index) {
    // since state is immutable, assign new array to splice then set state
    const newArray = this.state.selectedBookings;
    newArray.splice(index, 1);
    this.setState({selectedBookings: newArray});
  }

  async handleDeleteBookings() {
    for(let i = 0; i < this.state.selectedBookings.length; i++) {
      const bookingId = this.state.selectedBookings[i];
      await axios.delete(`/booking/bookings/${bookingId}`, { withCredentials: true })
        .then((res) => {
          if(res.status !== 200) {
            console.error(res);
          }
        });
    }

    // after deleting bookings from server, remove bookings from state
    while(this.state.selectedBookings.length > 0) {
      const bookingId = this.state.selectedBookings[0];
      const index = this.state.selectedBookings.indexOf(bookingId);
      if(index > -1) {
        this.removeBooking(index);
      }
    }

    // reload bookings table
    await FlightStore.loadMyBookings();
    this.forceUpdate();
  }

  render() {
    return (
      <Container>
        <Row>
          <h4>My Bookings</h4>
          <hr />
        </Row>
        <Row className="justify-content-end mb-2">
          <Col sm="6" className="d-flex justify-content-end">
            <Button
              variant="danger"
              disabled={this.state.selectedBookings.length === 0}
              onClick={this.handleDeleteBookings}
            >
              <FontAwesomeIcon icon="trash" />&nbsp;&nbsp;Delete Booking(s)
            </Button>
          </Col>
        </Row>
        <Row>
          <MyBookingsTable
            toggleAllBookings={this.toggleAllBookings}
            toggleBooking={this.toggleBooking}
            selectedBookings={this.state.selectedBookings}
          />
        </Row>
      </Container>
    );
  }
}
export default MyBookings;