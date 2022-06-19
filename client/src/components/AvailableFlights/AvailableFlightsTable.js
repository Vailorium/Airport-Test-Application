import React from 'react';
import FlightStore from '../../stores/FlightStore';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function AvailableFlightsTable(props) {
  const { handleOpenBook } = props;
  return (
    <Table responsive bordered hover striped className="text-center">
      <thead>
        <tr>
          <th>Flight ID</th>
          <th>Plane</th>
          <th>Departure Location</th>
          <th>Departure Time</th>
          <th>Arrival Location</th>
          <th>Arrival Time</th>
          <th>Price</th>
          <th>Seats Available</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          FlightStore.state.availableFlights.length > 0 ? FlightStore.state.availableFlights.map((flight) => (
            <tr key={`flights-${flight.flightId}`}>
              <td>{flight.flightId}</td>
              <td>{flight.planeName}</td>
              <td>{flight.routes[0].departureLocationFull}</td>
              <td>{new Date(flight.routes[0].departureTime).toLocaleString(undefined, { timeZoneName: 'short' })}</td>
              <td>{flight.routes[flight.routes.length - 1].arrivalLocationFull}</td>
              <td>{new Date(flight.routes[flight.routes.length - 1].arrivalTime).toLocaleString(undefined, { timeZoneName: 'short' })}</td>
              <td>${(flight.routes.map((r) => r.price).reduce((prev, curr) => prev + curr) / 100).toFixed(2)} NZD</td>
              <td>{flight.planeCapacity - Math.max(...flight.routes.map((r) => r.seats))}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => handleOpenBook(flight)}
                >
                  Book
                </Button>
              </td>
            </tr>
          )) : (
            FlightStore.state.availableFlightsLoading ? (
              <tr>
                <td colSpan={9}>Loading</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={9}>No flights available</td>
              </tr>
            )
          )
        }
      </tbody>
    </Table>
  );
}
export default AvailableFlightsTable;