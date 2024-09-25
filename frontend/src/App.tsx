import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import History from './pages/History';
import Links from './pages/Links';
import Mayors from './pages/Mayors';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <div id="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/links" element={<Links />} />
          <Route path="/mayors" element={<Mayors />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;