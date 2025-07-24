import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { Input } from './ui/input';
import { Button } from './ui/Button';
import { AuthContext } from '../context/AuthContext';
import apiRequest from '../services/api';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiRequest('/api/auth/register', 'POST', { name, email, password });
      login(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Up">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          minLength="6"
        />
        <Button type="submit" className="w-full">Sign Up</Button>
        <p className="text-sm text-center">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
            Log in
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default RegisterModal; 