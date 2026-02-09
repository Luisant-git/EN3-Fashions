import API_BASE_URL from '../config/api';

export const getSubCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subcategories');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getSubCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subcategory');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
