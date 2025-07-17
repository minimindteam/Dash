import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../utils/api';
import { supabase } from '../utils/supabase';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        localStorage.setItem('access_token', data.access_token); // Save token
        // Set Supabase session
        await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setMessage(data.detail || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Network error or server is down.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans">
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
            <div className="bg-primary p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M12 8v4"/><path d="M12 12h.01"/></svg>
            </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center text-text-primary">Welcome Back</h2>
        <p className="text-text-secondary text-center mb-8">Login to access your dashboard</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-text-secondary text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-text-secondary text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
            whileTap={{ scale: 0.98 }}
          >
            Login Securely
          </motion.button>
          {message && <p className="text-center mt-4 text-red-500 text-sm">{message}</p>}
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;