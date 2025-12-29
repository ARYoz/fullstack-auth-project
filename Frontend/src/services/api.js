import axios from 'axios';
import { saveToken, removeToken, getToken } from '../utils/jwt';





const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);


export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      saveToken(response.data.token);
    }
 
    return {
      ...response.data,
      email: response.data.email || email
    };
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};


export const signup = async (email, password) => {
  try {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};


export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    if (response.data.token) {
      saveToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
};



export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user info' };
  }
};


export const checkBackendConnection = async () => {
  try {
    const res = await api.get('/health');
    return { connected: res?.data?.status === 'OK', data: res.data };
  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      'Backend connection failed';
    return { connected: false, error: msg };
  }
};



export const logout = () => {
  removeToken();
};

