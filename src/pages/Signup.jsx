import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", system-ui, sans-serif' }}>
      <style>{`
        .pro-auth-card { background: white; width: 100%; max-width: 420px; padding: 3rem 2.5rem; border-radius: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; }
        .pro-auth-title { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; text-align: center; letter-spacing: -0.025em; }
        .pro-auth-subtitle { color: #64748b; text-align: center; margin-bottom: 2.5rem; font-size: 0.95rem; }
        .pro-input-group { margin-bottom: 1.5rem; }
        .pro-label { display: block; font-size: 0.875rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
        .pro-input { width: 100%; padding: 0.875rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; font-size: 1rem; transition: all 0.2s ease; outline: none; box-sizing: border-box; background: #f8fafc; color: #0f172a; }
        .pro-input:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .pro-submit-btn { width: 100%; background: #0f172a; color: white; border: none; padding: 1rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; margin-top: 0.5rem; }
        .pro-submit-btn:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2); }
        .pro-auth-footer { text-align: center; margin-top: 2rem; font-size: 0.95rem; color: #64748b; }
        .pro-auth-link { color: #2563eb; font-weight: 600; text-decoration: none; transition: color 0.2s ease; }
        .pro-auth-link:hover { color: #1d4ed8; text-decoration: underline; }
        .pro-error { background: #fef2f2; color: #ef4444; padding: 0.875rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 500; margin-bottom: 1.5rem; border: 1px solid #fecaca; text-align: center; }
      `}</style>
      <div className="pro-auth-card">
        <h2 className="pro-auth-title">Create Account</h2>
        <p className="pro-auth-subtitle">Join us for a premium shopping experience</p>
        {error && <div className="pro-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="pro-input-group">
            <label className="pro-label">Full Name</label>
            <input 
              type="text" 
              className="pro-input"
              placeholder="John Doe"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="pro-input-group">
            <label className="pro-label">Email Address</label>
            <input 
              type="email" 
              className="pro-input"
              placeholder="john@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="pro-input-group">
            <label className="pro-label">Password</label>
            <input 
              type="password" 
              className="pro-input"
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength="6"
            />
          </div>
          <button type="submit" className="pro-submit-btn">Sign Up</button>
        </form>
        <p className="pro-auth-footer">
          Already have an account? <Link to="/login" className="pro-auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
