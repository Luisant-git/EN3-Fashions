import API_BASE_URL from '../config/api';

export const getActiveSizeCharts = async () => {
    const response = await fetch(`${API_BASE_URL}/size-chart/active`);
    if (!response.ok) throw new Error('Failed to fetch size charts');
    return response.json();
};
