import axiosInstance from './axiosInstance';

export const getAllCustomers = async (page = 1, limit = 10, search = '') => {
  const params = { page, limit, ...(search && { search }) };
  const response = await axiosInstance.get('/customer', { params });
  return response.data;
};
