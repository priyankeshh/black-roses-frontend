/**
 * API service for making requests to the backend
 */

const API_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    console.log(`API Response [${response.status}]:`, data);

    if (!response.ok) {
      // Check if token is expired
      if (response.status === 401 && data.isExpired) {
        // Try to refresh token
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the original request
          return await retryRequest(response.url, response.method, response.body);
        }
      }

      const errorMessage = data.error || 'Something went wrong';
      console.error(`API Error [${response.status}]:`, errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error parsing API response:', error);
    throw new Error('Failed to process server response');
  }
};

// Get auth token from local storage
const getToken = () => {
  return localStorage.getItem('token');
};

// Get refresh token from local storage
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Set auth headers
const authHeader = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Refresh token function
const refreshToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    logout();
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();

    if (!response.ok) {
      logout();
      return false;
    }

    localStorage.setItem('token', data.token);
    return true;
  } catch (error) {
    logout();
    return false;
  }
};

// Retry a request with fresh token
const retryRequest = async (url, method, body) => {
  const response = await fetch(url, {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: body
  });

  return handleResponse(response);
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
  try {
    console.log('API Service - Creating event with data:', eventData);

    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(eventData)
    });

    const data = await handleResponse(response);
    console.log('API Service - Event creation response:', data);
    return { success: true, data: data.data };
  } catch (error) {
    console.error('API Service - Error creating event:', error);
    throw error;
  }
};

export const registerForEvent = async (eventId, registrationData) => {
  try {
    console.log('Registering for event:', eventId, 'with data:', registrationData);

    const response = await fetch(`${API_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });

    const data = await handleResponse(response);
    console.log('Registration response:', data);
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
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

  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  return { success: true, token: data.token, refreshToken: data.refreshToken };
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

  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  return { success: true, token: data.token, refreshToken: data.refreshToken };
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
  localStorage.removeItem('refreshToken');
};

// User events
export const getUserEvents = async () => {
  const response = await fetch(`${API_URL}/events/my-events`, {
    headers: authHeader()
  });

  const data = await handleResponse(response);
  return data.data;
};

// Admin functions
export const getUsers = async () => {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: authHeader()
  });

  const data = await handleResponse(response);
  return data.data;
};

export const createAdminUser = async (userData) => {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(userData)
  });

  const data = await handleResponse(response);
  return data.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({ role })
  });

  const data = await handleResponse(response);
  return data.data;
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: authHeader()
  });

  const data = await handleResponse(response);
  return data;
};

// Update event functions
export const updateEvent = async (eventId, eventData) => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(eventData)
  });

  const data = await handleResponse(response);
  return data.data;
};

// Update registration status
export const updateRegistrationStatus = async (eventId, registrationId, status) => {
  const response = await fetch(`${API_URL}/events/${eventId}/registrations/${registrationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({ status })
  });

  const data = await handleResponse(response);
  return data.data;
};

export const deleteEvent = async (eventId) => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: authHeader()
  });

  const data = await handleResponse(response);
  return data;
};

// File upload functions
export const uploadImage = async (file, type = 'event') => {
  try {
    console.log(`Uploading ${type} image:`, file.name);

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/${type}`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData
    });

    const data = await handleResponse(response);
    console.log('Upload response:', data);
    return data.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};


