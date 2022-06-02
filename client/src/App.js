import './App.css';
import React from 'react';
import Navigation from './components/common/Navigation';
import { Routes, Route } from 'react-router-dom';
import AvailableFlights from './components/AvailableFlights/AvailableFlights';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="flights" element={<AvailableFlights />} />
      </Routes>
    </>
  );
}
export default App;
