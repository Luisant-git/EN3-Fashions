import API_BASE_URL from '../config/api';

export const validateCoupon = async (code, orderAmount, token) => {
  const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ code, orderAmount }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to validate coupon');
  }
  return response.json();
};

export const getActiveCoupons = async () => {
  const response = await fetch(`${API_BASE_URL}/coupons/active`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch coupons');
  return response.json();
};
