const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const db = require('../db/DBRepository');

const bookBodySchema = Joi.object({
  routes: Joi.array().items(Joi.number()).required(),
  count: Joi.number().required(),
});
router.post('/book', passport.authenticate('jwt', { session: false }), validator.body(bookBodySchema), async (req, res, next) => {
  const { routes, count } = req.body;
  const user = await req.user;

  for(let route of routes) {
    // check that route has enough seats for booking
    const availableSeats = await db.getRouteSeats(route);
    if(availableSeats < count) {
      res.status(400).send({message: 'Seats already booked'});
      return;
    }
  }
  for(let route of routes) {
    // book seats for route
    db.bookRouteSeats(user.id, route, count);
  }
  res.status(200).send({message: 'Success'});
});

router.get('/bookings', passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  const user = await req.user;

  // get user raw bookings data
  const rawBookings = await db.getUserBookings(user.id);
  const flightsData = [];
  let currentFlightId = -1;
  for(let i = 0; i < rawBookings.length; i++) {
    const currentRoute = rawBookings[i];
    // if new flight needs to be added, add new object into array
    if(currentRoute.flight_id !== currentFlightId) {
      currentFlightId = currentRoute.flight_id;
      flightsData.push({
        flightId: currentRoute.flight_id,
        planeName: currentRoute.name,
        planeCapacity: currentRoute.seats,
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
      bookingId: currentRoute.booking_id,
    });
  }
  res.send(flightsData);
});

const deleteBookingParamSchema = Joi.object({
  id: Joi.number(),
});
router.delete('/bookings/:id', passport.authenticate('jwt', { session: false}), validator.params(deleteBookingParamSchema), async (req, res, next) => {
  const { id } = req.params;
  const user = await req.user;

  const result = await db.deleteUserBooking(user.id, id);

  if(result) {
    res.status(200).end();
  } else {
    // failed for some reason (booking didn't exist in the first place?)
    res.status(400).end();
  }
});
module.exports = router;