import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AvailableFlightsSearch from './AvailableFlightsSearch';
import Modal from 'react-bootstrap/Modal';
import BookFlight from './BookFlightModal/BookFlight';
import AvailableFlightsTable from './AvailableFlightsTable';

class AvailableFlights extends React.Component {
  constructor() {
    super();

    this.state = {
      showBook: false,
      selectedFlight: {},
    }

    this.handleOpenBook = this.handleOpenBook.bind(this);
    this.handleCloseBook = this.handleCloseBook.bind(this);
    this.updateTable = this.updateTable.bind(this);
  }

  handleOpenBook(flight) {
    this.setState({ showBook: true, selectedFlight: flight });
  }

  handleCloseBook() {
    this.setState({ showBook: false });
  }

  updateTable() {
    // pass to children to allow them to update parent
    this.forceUpdate();
  }

  render() {
    const { showBook, selectedFlight } = this.state;
    return (
      <Container>
        <Row>
          <h4>Find a Flight</h4>
          <hr />
        </Row>
        <Row className="mb-2">
          <AvailableFlightsSearch updateTable={this.updateTable} />
        </Row>
        <hr />
        <Row className="mb-2">
          <AvailableFlightsTable handleOpenBook={this.handleOpenBook} />
        </Row>
        <Modal show={showBook} onHide={this.handleCloseBook}>
          <Modal.Header closeButton>
            <Modal.Title>Book Flight</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BookFlight flight={selectedFlight} handleCloseBook={this.handleCloseBook} />
          </Modal.Body>
        </Modal>
      </Container>
    );
  }
}
export default AvailableFlights;