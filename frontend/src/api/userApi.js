import API_BASE_URL from '../config/api';

export const getUserProfile = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
};

export const updateShippingAddress = async (userId, address, token) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/address`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(address)
  });
  if (!response.ok) throw new Error('Failed to update address');
  return response.json();
};
