import axiosInstance from './axiosInstance';

export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/dashboard/stats');
  return response.data;
};

export const getSalesAnalytics = async () => {
  const response = await axiosInstance.get('/dashboard/sales-analytics');
  return response.data;
};

export const getTopProducts = async () => {
  const response = await axiosInstance.get('/dashboard/top-products');
  return response.data;
};

export const getCurrentOffers = async () => {
  const response = await axiosInstance.get('/dashboard/offers');
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await axiosInstance.get('/dashboard/recent-orders');
  return response.data;
};
