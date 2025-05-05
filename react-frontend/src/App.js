import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AdminPanel from './pages/AdminPanel';
import AddDoctor from './pages/AddDoctor';
import EditDoctor from './pages/EditDoctor';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />


        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/add-doctor" element={<AddDoctor />} />
        <Route path="/admin/edit-doctor/:id" element={<EditDoctor />} />
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/admin/edit-user/:id" element={<EditUser />} />

      </Routes>
    </Router>
  );
}

export default App;