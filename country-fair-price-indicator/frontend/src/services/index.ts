import apiClient from '@services/api';

export const authService = {
  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: string;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

export const priceService = {
  reportPrice: async (data: any) => {
    const response = await apiClient.post('/prices/report', data);
    return response.data;
  },

  searchByLocation: async (latitude: number, longitude: number, radius: number = 5) => {
    const response = await apiClient.get(`/prices/location/${latitude}/${longitude}`, {
      params: { radius },
    });
    return response.data;
  },

  searchByProduct: async (product: string, location?: string) => {
    const response = await apiClient.get('/prices/search', {
      params: { product, location },
    });
    return response.data;
  },

  getAveragePrice: async (product: string, location: string) => {
    const response = await apiClient.get('/prices/average', {
      params: { product, location },
    });
    return response.data;
  },
};
