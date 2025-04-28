
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to login page as we now only have one entry point for authentication
    navigate('/login');
  }, [navigate]);

  // This component will just redirect to login
  return null;
};

export default Register;
