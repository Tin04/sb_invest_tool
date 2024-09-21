import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  useEffect(() => {

  }, []);

  return (
    <div id="header">
      <div id="header-content">
        <Link to="/">Skyblock Invest Tool</Link>
        <nav id="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/history">Price History</Link></li>
            <li><Link to="/links">Links</Link></li>
            <li><Link to="#about">About</Link></li>
            <li><button id="theme-toggle">Light Mode</button></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;