import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { Formik } from 'formik';
import BookFlightForm from './BookFlightForm';
import FlightStore from '../../../stores/FlightStore';

/**
 * @typedef Route
 * @type {Object}
 * @property {int} routeId
 * @property {string} departureLocation
 * @property {string} departureTime
 * @property {string} departureLocationFull
 * @property {string} arrivalLocation
 * @property {string} arrivalTime
 * @property {string} arrivalLocationFull
 * @property {int} price
 * @property {int} seats
 */
/**
 * @typedef Flight
 * @type {Object}
 * @property {int} flightId
 * @property {string} planeName
 * @property {int} planeCapacity
 * @property {Route[]} routes
 */

/**
 * 
 * @param {{flight: Flight}} props 
 * @returns 
 */
function BookFlight(props) {
  const { flight, handleCloseBook } = props;
  const routeString = flight.routes.length > 0 ? [flight.routes[0].departureLocation].concat(flight.routes.map((a) => a.arrivalLocation)).join('-') : '';
  return (
    <Container>
      <Row>
        <BookFlightForm flight={flight} handleCloseBook={handleCloseBook} />
      </Row>
      <Row>
        <h3>Flight Details</h3>
        <hr />
      </Row>
      <Row className='ratio-2x1'>
        <img alt={`Flight route ${routeString}`} src={`http://www.gcmap.com/map?P=${routeString}&MS=wls&MR=120&MX=720x360&PM=*`} />
      </Row>
      <Row>
        <Col sm="12">
          <Table striped bordered>
            <tbody>
              <tr>
                <th>Flight ID</th>
                <td>{flight.flightId}</td>
              </tr>
              <tr>
                <th>Plane</th>
                <td>{flight.planeName}</td>
              </tr>
              <tr>
                <th>Available Seats</th>
                <td>{flight.planeCapacity - Math.max(...flight.routes.map((r) => r.seats))}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <h4>Flight Instructions</h4>
        <hr />
      </Row>
      {
        flight.routes.map((route) => {
          return (
            <Row key={`route-${route.routeId}`}>
              <Col sm="12">
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <th>Departure</th>
                      <td>{route.departureLocationFull}, {
                          new Date(route.departureTime)
                            .toLocaleString(undefined, { timeZoneName: 'short', timeZone: FlightStore.getTimezoneByAirportCode(route.departureLocation) })
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Arrival</th>
                      <td>{route.arrivalLocationFull}, {
                          new Date(route.arrivalTime)
                            .toLocaleString(undefined, { timeZoneName: 'short', timeZone: FlightStore.getTimezoneByAirportCode(route.arrivalLocation) })
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Flight Duration</th>
                      <td>{((new Date(route.arrivalTime).getTime() - new Date(route.departureTime).getTime()) / 3600000).toFixed(1)} hrs</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          )
        }
      )
    }
    </Container>
  )
}
export default BookFlight;