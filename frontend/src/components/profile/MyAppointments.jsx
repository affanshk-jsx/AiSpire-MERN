import React from 'react';
import './ProfileComponents.css';

const MyAppointments = ({ appointments }) => {
  return (
    <div className="profile-section">
      <h2>My Appointments</h2>
      {appointments && appointments.length > 0 ? (
        <div className="item-list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="list-item">
              <span className="item-title">Appointment with {appointment.counselor}</span>
              <span className="item-date">{new Date(appointment.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no upcoming appointments.</p>
      )}
    </div>
  );
};

export default MyAppointments;