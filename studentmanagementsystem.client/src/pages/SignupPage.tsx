import React, { useState } from 'react';
import api from '../pages/api';

function SignupPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<any>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.ChangeEvent<any>) => {
      e.preventDefault();
      try {
        await api.post('/Authenticate/register', formData);
        alert('Registration successful. You can now log in.');
      } catch (error) {
        alert('Registration failed. Please try again.');
      }
    };
    return (
        <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: '363px' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '363px' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '363px' }}
          />
          <button type="submit"style={{ width: '363px' }}>Register</button>
        </form>
      </div>
    )
}

export default SignupPage;