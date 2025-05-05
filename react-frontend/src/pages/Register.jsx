import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Регистрация успешна!');
      } else {
        const errText = await response.text();
        setMessage(`Ошибка: ${errText}`);
      }
    } catch (err) {
      setMessage('Ошибка сети');
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Имя:
          <input type="text" name="firstName" required onChange={handleChange} />
        </label>
        <label>
          Фамилия:
          <input type="text" name="lastName" required onChange={handleChange} />
        </label>
        <label>
          Имя пользователя:
          <input type="text" name="username" required onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" required onChange={handleChange} />
        </label>
        <label>
          Телефон:
          <input type="tel" name="phone" required onChange={handleChange} />
        </label>
        <label>
          Пароль:
          <input type="password" name="password" required onChange={handleChange} />
        </label>
        <button type="submit">Зарегистрироваться</button>
      </form>

      {message && <p className="register-message">{message}</p>}
      <Link to="/" className="back-button">← Вернуться на главную</Link>
    </div>
  );
}

export default Register;
