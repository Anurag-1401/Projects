import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../Redux/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import '../Styles/login.css';

const LoginPage = () => {

  const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.password) {
      setError('Please enter both username and password');
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.post(`${baseURL}/api/login`, {
            ...form,
            latitude,
            longitude
          });

          if (response.status === 200) {
            const user = response.data.user;
            dispatch(loginSuccess(user)); 

            if (user.role === 'admin') {
              alert('Admin login successful');
              console.log(response.data);
              navigate(`/admin/${user.categories}`);
            } else {
              alert('User login successful');
              console.log(response.data);
              navigate('/');
            }
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
        }
      }, (error) => {
        setError("Location access denied. Please allow location access.");
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>User Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your username"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        
        <p style={{ color: 'red', fontWeight: '700', marginTop: '10px' }}>{error}</p>

        <button type="submit" className="login-btn">Login</button>
      </form>

      <a href="#forgot-password" className="forgot-password">Forgot Password?</a>
    </div>
  );
};

export default LoginPage;
