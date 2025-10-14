import API_BASE_URL from './config';

export const getBrands = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createBrand = async (brandData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brandData),
    });

    if (!response.ok) {
      throw new Error('Failed to create brand');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};