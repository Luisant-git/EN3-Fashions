import API_BASE_URL from '../config/api';

export const getActiveBanners = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners/active`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active banners');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};