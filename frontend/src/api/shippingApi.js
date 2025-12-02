import API_BASE_URL from '../config/api';

export const getShippingRules = async () => {
  const response = await fetch(`${API_BASE_URL}/shipping`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch shipping rules');
  return response.json();
};
