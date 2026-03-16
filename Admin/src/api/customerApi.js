import axiosInstance from './axiosInstance';

export const getAllCustomers = async (page = 1, limit = 10, search = '') => {
  const params = { page, limit, ...(search && { search }) };
  const response = await axiosInstance.get('/customer', { params });
  return response.data;
};

export const getAllCustomersForExport = async () => {
  const params = { 
    page: 1, 
    limit: 10000 // Large limit to get all customers
  };
  const response = await axiosInstance.get('/customer', { params });
  return response.data;
};
