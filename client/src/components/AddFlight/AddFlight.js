import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AddFlightForm from './AddFlightForm';

function AddFlight() {
  return (
    <Container>
      <Row>
        <h4>Add Flight</h4>
        <hr />
      </Row>
      <Row>
        <p>Admin utilities to add a flight, fill in the form then submit to add the flight. Make sure that routes have the correct time/date!</p>
        <hr />
      </Row>
      <Row>
        <AddFlightForm />
      </Row>
    </Container>

  )
}
export default AddFlight;