import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TitleScreen from '../components/title-screen'
import GameBoard from '../components/gameboard'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TitleScreen/>} />
        <Route path="/gameboard" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;