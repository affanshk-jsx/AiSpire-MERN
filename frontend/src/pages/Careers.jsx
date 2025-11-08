import React, { useState, useEffect } from 'react';
import careerService from '../services/careerService';
import CareerCard from '../components/careers/CareerCard';
import './Careers.css';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await careerService.getCareers();
        setCareers(data);
      } catch (error) {
        console.error("Failed to fetch careers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  return (
    <div className="careers-page container">
      <div className="page-header">
        <h1>Explore Career Paths</h1>
        <p>
          Find detailed information about roles, responsibilities, and salary
          expectations to make an informed decision.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="careers-grid">
          {careers.length > 0 ? (
            careers.map((career) => (
              <CareerCard key={career._id} career={career} />
            ))
          ) : (
            <p>No careers found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Careers;