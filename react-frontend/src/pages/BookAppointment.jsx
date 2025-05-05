import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookAppointment.css';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Загружаем список врачей
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/doctors', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки врачей');
        
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchDoctors();
  }, []);

  // Загружаем доступные слоты при выборе врача и даты
  useEffect(() => {
    if (selectedDoctor && date) {
      const fetchSlots = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `http://localhost:8080/api/appointments/available?doctorId=${selectedDoctor}&date=${date}T00:00:00`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          if (!response.ok) throw new Error('Ошибка загрузки слотов');
          
          const data = await response.json();
          setAvailableSlots(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSlots();
    }
  }, [selectedDoctor, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          appointmentTime: selectedSlot
        })
      });
      
      if (!response.ok) throw new Error('Ошибка записи');
      
      alert('Запись успешно создана!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    
    <div className="appointment-container">
        <Header />
        <Navigation />
      <h2>Запись на прием</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Выберите врача:</label>
          <select 
            value={selectedDoctor} 
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">-- Выберите врача --</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} ({doctor.specialty})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Выберите дату:</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        {isLoading && <p>Загрузка доступных слотов...</p>}
        
        {availableSlots.length > 0 && (
          <div className="form-group">
            <label>Выберите время:</label>
            <div className="time-slots">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {new Date(slot).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {selectedSlot && (
          <button type="submit" className="submit-button">
            Записаться на {new Date(selectedSlot).toLocaleString()}
          </button>
        )}
      </form>
    </div>
  );
}

export default BookAppointment;