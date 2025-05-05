import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminForm.css';

function EditDoctor() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    specialty: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/doctors/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки');
        
        const data = await response.json();
        setFormData({
          name: data.name,
          specialty: data.specialty
        });
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchDoctor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:8080/api/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Ошибка обновления врача');
      
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Редактировать врача</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя врача:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Специальность:</label>
          <input
            type="text"
            value={formData.specialty}
            onChange={(e) => setFormData({...formData, specialty: e.target.value})}
            required
          />
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

export default EditDoctor;