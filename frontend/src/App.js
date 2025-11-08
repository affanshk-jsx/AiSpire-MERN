// frontend/src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Careers from './pages/Careers';
import CareerDetails from './pages/CareerDetails';
import Assessments from './pages/Assessments';
import Appointment from './pages/Appointment';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <div className="container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected user routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/:id" element={<CareerDetails />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin-only routes (OUTLET based) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
