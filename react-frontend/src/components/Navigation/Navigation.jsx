import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.roles?.some(role => role.includes('ADMIN')); // Более надежная проверка
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav>
      {isAdmin && (
  <>
    <Link to="/admin">Админка</Link>
  </>
)}
      <Link to="/">Главная</Link>
      
      {isLoggedIn && (
  <>
    <Link to="/book">Запись к врачу</Link>
    <Link to="/my-appointments">Мои записи</Link>
  </>
)}
      {isLoggedIn ? (
        <button onClick={handleLogout} className="logout-button">Выйти</button>
      ) : (
        <>
          <Link to="/login">Вход</Link> | <Link to="/register">Регистрация</Link>
        </>
      )}
      | <Link to="/contacts">Контакты</Link>
    </nav>
  );
}

export default Navigation;