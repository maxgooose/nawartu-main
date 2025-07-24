import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { Input } from './ui/input';
import { Button } from './ui/Button';
import { AuthContext } from '../context/AuthContext';
import apiRequest from '../services/api';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiRequest('/api/auth/login', 'POST', { email, password });
      login(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log In">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Log In</Button>
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister} className="text-blue-600 hover:underline">
            Sign up
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default LoginModal; 