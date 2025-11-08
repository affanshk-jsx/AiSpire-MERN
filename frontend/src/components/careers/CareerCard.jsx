import React from 'react';
import { Link } from 'react-router-dom';
import './CareerCard.css';

const CareerCard = ({ career }) => {
  return (
    <div className="career-card">
      <h3 className="card-title">{career.title}</h3>
      <p className="card-description">{career.description}</p>
      <div className="card-footer">
        <span className="card-salary">
          ~₹{career.averageSalary.toLocaleString('en-IN')}/yr
        </span>
        <Link to={`/careers/${career._id}`} className="card-link">
          Learn More &rarr;
        </Link>
      </div>
    </div>
  );
};

export default CareerCard;