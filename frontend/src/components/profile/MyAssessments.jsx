import React from 'react';
import './ProfileComponents.css';

const MyAssessments = ({ assessments }) => {
  return (
    <div className="profile-section">
      <h2>My Assessments</h2>
      {assessments && assessments.length > 0 ? (
        <div className="item-list">
          {assessments.map((assessment) => (
            <div key={assessment._id} className="list-item">
              <span className="item-title">{assessment.title}</span>
              <span className="item-status">Completed</span>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not completed any assessments yet.</p>
      )}
    </div>
  );
};

export default MyAssessments;