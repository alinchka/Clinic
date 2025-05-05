import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'users') {
          const response = await fetch('http://localhost:8080/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          setUsers(data);
        } else {
          const response = await fetch('http://localhost:8080/api/doctors', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          setDoctors(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const deleteUser = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Ошибка удаления пользователя');
      
      setUsers(users.filter(user => user.id !== id));
      alert('Пользователь успешно удален');
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить врача?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Ошибка удаления врача');
      
      setDoctors(doctors.filter(doctor => doctor.id !== id));
      alert('Врач успешно удален');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-container">
      <h2>Административная панель</h2>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
        <button 
          className={`tab-button ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          Врачи
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="users-section">
          <div className="admin-actions">
            <Link to="/admin/add-user" className="add-button">Добавить пользователя</Link>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.roles?.join(', ') || 'USER'}</td>
                  <td>
                    <Link to={`/admin/edit-user/${user.id}`} className="edit-button">Редактировать</Link>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="delete-button"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="doctors-section">
          <div className="admin-actions">
            <Link to="/admin/add-doctor" className="add-button">Добавить врача</Link>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Специальность</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialty}</td>
                  <td>
                    <Link to={`/admin/edit-doctor/${doctor.id}`} className="edit-button">Редактировать</Link>
                    <button 
                      onClick={() => deleteDoctor(doctor.id)}
                      className="delete-button"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;