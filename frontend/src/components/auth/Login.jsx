import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Expecting { token, user } from the API/service
      const userData = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Persist to context (which writes to localStorage inside)
      contextLogin(userData);

      // Go back to the page the user originally wanted, else default
      const from = location.state?.from?.pathname || '/careers';
      navigate(from, { replace: true });
    } catch (err) {
      // Try to pull a meaningful message
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to login. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Access your AiSpire account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit} autoComplete="off" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              minLength={6}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
