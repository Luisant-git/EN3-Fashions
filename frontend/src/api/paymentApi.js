import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4062';

export const createPaymentOrder = async (amount, token) => {
  const response = await axios.post(`${API_URL}/orders/payment/create`, { amount }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const verifyPayment = async (paymentData, token) => {
  const response = await axios.post(`${API_URL}/orders/payment/verify`, paymentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
