import './App.css';
import React from 'react';
import Navigation from './components/common/Navigation';
import { Routes, Route } from 'react-router-dom';
import AvailableFlights from './components/AvailableFlights/AvailableFlights';
import MyBookings from './components/MyBookings/MyBookings';
import Home from './components/Home/Home';
import AddFlight from './components/AddFlight/AddFlight';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="flights" element={<AvailableFlights />} />
        <Route exact path="bookings" element={<MyBookings />} />
        <Route exact path="flights/add" element={<AddFlight />} />
      </Routes>
    </>
  );
}
export default App;
