const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const db = require('../db/DBRepository');

router.get('/airports', async (req, res, next) => {
  const result = await db.getAirports();
  res.status(200).send(result);
});

const flightsQuerySchema = Joi.object({
  from: Joi.string().required('From is required').length(4, 'utf-8', 'From must be a 4 character airport code'),
  to: Joi.string().required('To is required').length(4, 'utf-8', 'To must be a 4 character airport code'),
  start: Joi.date().required('Start is required'),
  end: Joi.date().required('End is required'),
});
router.get('/flights', validator.query(flightsQuerySchema), async (req, res, next) => {
  const { from, to, start, end } = req.query;

  const result = await db.getFlights(from, to, start, end);

  // create parsed array to send back to user, each object in the array is a flight, and contains the routes needed to get from a to b
  const flightsData = [];
  let currentFlightId = -1;
  for(let i = 0; i < result.length; i++) {
    const currentRoute = result[i];
    // if new flight needs to be added, add new object into array
    if(currentRoute.flight_id !== currentFlightId) {
      currentFlightId = currentRoute.flight_id;
      flightsData.push({
        flightId: currentRoute.flight_id,
        planeName: currentRoute.plane_name,
        planeCapacity: currentRoute.plane_capacity,
        routes: [],
      });
    }
    // add route to flight
    flightsData[flightsData.length - 1].routes.push({
      routeId: currentRoute.route_id,
      departureLocation: currentRoute.departure_location,
      departureTime: currentRoute.departure_time,
      departureLocationFull: currentRoute.departure_location_full,
      arrivalLocation: currentRoute.arrival_location,
      arrivalTime: currentRoute.arrival_time,
      arrivalLocationFull: currentRoute.arrival_location_full,
      price: currentRoute.price,
      seats: currentRoute.seats,
    });
  }

  res.status(200).send(flightsData);
});
const bookBodySchema = Joi.object({
  routes: Joi.array().items(Joi.number()).required(),
  count: Joi.number().required(),
});
router.post('/book', passport.authenticate('jwt', { session: false }), validator.body(bookBodySchema), async (req, res, next) => {
  const { routes, count } = req.body;
  const user = await req.user;
  for(let route of routes) {
    const availableSeats = await db.getRouteSeats(route);
    if(availableSeats < count) {
      res.status(400).send({message: 'Seats already booked'});
      return;
    }
  }
  for(let route of routes) {
    console.log('booking');
    db.bookRouteSeats(user.id, route, count);
  }
  res.status(200).send({message: 'Success'});
});
module.exports = router;