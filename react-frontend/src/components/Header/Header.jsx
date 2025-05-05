import React from 'react';
import './Header.css';
import logo from '../../images/logo.svg';

function Header() {
  return (
    <header className='header'>
      <img src={logo} alt="Логотип больницы" style={{ height: '40px', marginRight: '15px' }} />
      <h1>Lifeline Community Hospital</h1>
    </header>
  );
}

export default Header;