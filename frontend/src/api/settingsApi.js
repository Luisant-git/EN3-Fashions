import API_BASE_URL from '../config/api';

export const getAppSettings = async () => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
};
