import API_BASE_URL from '../config/api';

export const addToWishlist = async (productId, token) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to add to wishlist');
  return response.json();
};

export const removeFromWishlist = async (productId, token) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to remove from wishlist');
  return response.json();
};

export const getWishlist = async (token) => {
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch wishlist');
  return response.json();
};
