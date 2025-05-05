import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminForm.css';

function EditUser() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    isAdmin: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки');
        
        const data = await response.json();
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          username: data.username,
          isAdmin: data.roles?.includes("ROLE_ADMIN")
        });
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          isAdmin: formData.isAdmin
        })
      });

      if (!response.ok) throw new Error('Ошибка обновления пользователя');
      
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Редактировать пользователя</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Имя:</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Фамилия:</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Логин:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.isAdmin}
              onChange={(e) => setFormData({...formData, isAdmin: e.target.checked})}
            />
            Администратор
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">Сохранить</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/admin')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;