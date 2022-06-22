import React from 'react';
import Table from 'react-bootstrap/Table';
import FlightStore from '../../stores/FlightStore';
import Form from 'react-bootstrap/Form';

class MyBookingsTable extends React.Component {
  async componentDidMount() {
    await FlightStore.loadMyBookings();
    this.forceUpdate();
  }

  render() {
    const { toggleAllBookings, toggleBooking, selectedBookings } = this.props;
    const flights = FlightStore.getMyBookings();
    return (
      <Table responsive bordered hover striped className="text-center">
        <thead>
          <tr>
            <th></th>
            <th>Flight ID</th>
            <th>Plane Name</th>
            <th></th>
            <th>Booking ID</th>
            <th>Route ID</th>
            <th>Departure Location</th>
            <th>Departure Time</th>
            <th>Arrival Location</th>
            <th>Arrival Time</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {
            flights.length > 0 ? flights.map((f) => f.routes.map((r, i) => (
              <tr key={`booking-row-${r.bookingId}`}>
                {i === 0 ? <td><Form.Check
                  id={`booking-row-${r.bookingId}-checkbox-all`}
                  type="checkbox"
                  onChange={(c) => toggleAllBookings(f.routes, c.target.checked)}/>
                </td> : <td></td>}
                {i === 0 ? <td>{f.flightId}</td> : <td></td>}
                {i === 0 ? <td>{f.planeName}</td> : <td></td>}
                <td>
                  <Form.Check 
                    id={`booking-row-${r.bookingId}-checkbox`}
                    type="checkbox"
                    checked={selectedBookings.indexOf(r.bookingId) > -1}
                    onChange={() => toggleBooking(r.bookingId)}
                  />
                </td>
                <td>{r.bookingId}</td>
                <td>{r.routeId}</td>
                <td>{r.departureLocationFull}</td>
                <td>{new Date(r.departureTime).toLocaleString(
                  undefined, { timeZoneName: 'short', timeZone: FlightStore.getTimezoneByAirportCode(r.departureLocation)})}</td>
                <td>{r.arrivalLocationFull}</td>
                <td>{new Date(r.arrivalTime).toLocaleString(
                  undefined, { timeZoneName: 'short', timeZone: FlightStore.getTimezoneByAirportCode(r.arrivalLocation)})}</td>
                <td>${(r.price / 100).toFixed(2)} NZD</td>
              </tr>
            ))) : (<tr><td colspan="11">No bookings</td></tr>)
          }
        </tbody>
      </Table>
    )
  }
}
export default MyBookingsTable;