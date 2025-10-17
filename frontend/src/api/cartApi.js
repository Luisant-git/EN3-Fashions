import API_BASE_URL from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const addToCart = async (item) => {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item)
  });
  
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  
  return response.json();
};

export const getCart = async () => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  
  return response.json();
};

export const removeFromCart = async (itemId) => {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }
  
  return response.json();
};

export const updateCartQuantity = async (itemId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}/quantity`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity })
  });
  
  if (!response.ok) {
    throw new Error('Failed to update quantity');
  }
  
  return response.json();
};