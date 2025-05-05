import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Ошибка входа');
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        roles: data.roles
      }));
  
      // Редирект в зависимости от роли
      if (data.roles.includes('ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Вход в Lifeline Hospital</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email*
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Пароль*
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            required 
            minLength="6"
          />
        </label>

        <button type="submit" className="submit-button">
          Войти
        </button>
      </form>

      <div className="register-link">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}

export default Login;