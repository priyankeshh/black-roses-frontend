/**
 * API service for making requests to the backend
 */

const API_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
};

// Get auth token from local storage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set auth headers
const authHeader = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Event functions
export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  const data = await handleResponse(response);
  return data.data;
};

export const getEventById = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`);
  const data = await handleResponse(response);
  return data.data;
};

export const createEvent = async (eventData) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(eventData)
  });
  
  const data = await handleResponse(response);
  return { success: true, data: data.data };
};

export const registerForEvent = async (eventId, registrationData) => {
  const response = await fetch(`${API_URL}/events/${eventId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registrationData)
  });
  
  const data = await handleResponse(response);
  return { success: true, data: data.data };
};

// Product functions
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  const data = await handleResponse(response);
  return data.data;
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  const data = await handleResponse(response);
  return data.data;
};

// Contact functions
export const submitContactForm = async (contactData) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactData)
  });
  
  const data = await handleResponse(response);
  return { success: true, data: data.data };
};

// Auth functions
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  const data = await handleResponse(response);
  
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return { success: true, token: data.token };
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  
  const data = await handleResponse(response);
  
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return { success: true, token: data.token };
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: authHeader()
  });
  
  const data = await handleResponse(response);
  return data.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
