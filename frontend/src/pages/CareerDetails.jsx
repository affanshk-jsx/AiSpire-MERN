// frontend/src/pages/CareerDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import careerService from '../services/careerService';
import './CareerDetails.css';

const CareerDetails = () => {
  const [career, setCareer] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCareer = async () => {
      const data = await careerService.getCareerById(id);
      setCareer(data);
    };
    fetchCareer();
  }, [id]);

  if (!career) return <div>Loading...</div>;

  return (
    <div className="career-details-page container">
      <h1 className="career-title">{career.title}</h1><p className="career-description">{career.description}</p>
      <div className="details-grid">
        <div className="detail-card"><h3>Average Salary</h3><p className="salary">₹{career.averageSalary.toLocaleString('en-IN')}/yr</p></div>
        <div className="detail-card"><h3>Required Education</h3><p>{career.requiredEducation}</p></div>
      </div>
      <div className="skills-section"><h3>Required Skills</h3><div className="skills-list">{career.skills.map((skill, index) => (<span key={index} className="skill-tag">{skill}</span>))}</div></div>
    </div>
  );
};

export default CareerDetails;