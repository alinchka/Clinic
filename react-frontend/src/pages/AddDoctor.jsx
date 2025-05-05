import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddDoctor() {
  const [formData, setFormData] = useState({
    name: '',
    specialty: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Ошибка добавления врача');
      
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Добавить врача</h2>
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
        
        <button type="submit" className="submit-button">Добавить</button>
      </form>
    </div>
  );
}

export default AddDoctor;