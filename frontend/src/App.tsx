import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import History from './pages/History';
import Links from './pages/Links';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/links" element={<Links />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
    </div>
  );
};

export default App;