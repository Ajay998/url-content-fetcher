import React, { useState } from 'react';
import type { FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ access_token: string }>('http://127.0.0.1:8000/register', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.access_token);
      alert('Registered Successfully!');
    } catch (err) {
      const error = err as AxiosError<{ detail: string }>;
      const errorMsg = error.response?.data?.detail || 'Registration failed.';
      alert(errorMsg);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100vh',
    }}>
      <div style={{
        border: '1px solid #ccc',
        padding: '50px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '300px',
      }}>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          /><br />
          <button type="submit" style={{ padding: '10px 20px' }}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
