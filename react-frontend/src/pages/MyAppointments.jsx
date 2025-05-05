import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAppointments.css';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/appointments/my', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Ошибка загрузки записей');
        
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm('Вы уверены, что хотите отменить запись?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Ошибка отмены записи');
      
      setAppointments(appointments.filter(app => app.id !== id));
      alert('Запись успешно отменена');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return (
    <div className="page-container">
      <Header />
      <Navigation />
      <div className="loading">Загрузка ваших записей...</div>
    </div>
  );
  
  if (error) return (
    <div className="page-container">
      <Header />
      <Navigation />
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="page-container">
      <Header />
      <Navigation />
      
      <div className="appointments-container">
        <h2>Мои записи на прием</h2>
        
        {appointments.length === 0 ? (
          <p>У вас нет активных записей</p>
        ) : (
          <div className="appointments-list">
            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-info">
                  <h3>Доктор: {appointment.doctorName || 'Не указан'}</h3>
                  <p>Специальность: {appointment.doctorSpecialty || 'Не указана'}</p>
                  <p>Дата и время: {new Date(appointment.appointmentTime).toLocaleString()}</p>
                  <p>Статус: {new Date(appointment.appointmentTime) > new Date() ? 'Предстоящая' : 'Завершенная'}</p>
                </div>
                <div className="appointment-actions">
                  {new Date(appointment.appointmentTime) > new Date() && (
                    <button 
                      onClick={() => cancelAppointment(appointment.id)}
                      className="cancel-button"
                    >
                      Отменить запись
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;