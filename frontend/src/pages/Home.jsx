import React, { useContext } from 'react'; // Import useContext
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext); // Get auth state

  return (
    <div className="home-page container">
      <section className="hero">
        <h1 className="hero-title">
          Clarity for your <br />
          <span className="hero-highlight">Next Chapter.</span>
        </h1>
        <p className="hero-subtitle">
          Don't navigate your career journey alone. We provide personalized,
          data-driven guidance to help you find a profession you'll love.
        </p>
        
        {/* Conditionally render the button */}
        {isAuthenticated ? (
          <Link to="/careers" className="hero-cta">
            Explore Careers &rarr;
          </Link>
        ) : (
          <Link to="/signup" className="hero-cta">
            Start Your Journey &rarr;
          </Link>
        )}
      </section>

      <section className="info-section">
        <div className="info-card">
          <h2>Explore Career Paths</h2>
          <p>
            Dive into our curated database of hundreds of careers. Understand
            the day-to-day, salary expectations, and required skills for each.
          </p>
          <Link to="/careers" className="info-link">
            Browse Careers
          </Link>
        </div>
        <div className="info-card">
          <h2>Discover Yourself</h2>
          <p>
            Our scientifically-backed assessments help you uncover your
            strengths, personality traits, and interests to find the perfect fit.
          </p>
          <Link to="/assessments" className="info-link">
            Take an Assessment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;