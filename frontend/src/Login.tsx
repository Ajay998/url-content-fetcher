import React, { useState } from 'react';
import type { FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ access_token: string }>('http://127.0.0.1:8000/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.access_token);
      alert('Login successful!');
      navigate('/url-content-fetcher'); 
    } catch (err) {
      const error = err as AxiosError<{ detail: string }>;
      const errorMsg = error.response?.data?.detail || 'Login failed.';
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
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;