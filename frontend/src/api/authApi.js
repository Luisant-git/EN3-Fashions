import API_BASE_URL from '../config/api';

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return response.json();
};

export const getUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/user/profile/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};

export const updateShippingAddress = async (token, address) => {
  const response = await fetch(`${API_BASE_URL}/user/profile/address`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(address)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update address');
  }
  
  return response.json();
};

export const updateProfile = async (token, profile) => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(profile)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  
  return response.json();
};