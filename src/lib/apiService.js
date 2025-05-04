/**
 * API service for making requests to the backend
 */

const API_URL = 'http://localhost:5000/api';

// Custom error class for API errors
class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    const data = await response.json();

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
      throw new APIError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to process server response', 500);
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
  } catch (error) {
    throw error instanceof APIError ? error : new APIError('Failed to create event', 500);
  }
};

export const registerForEvent = async (eventId, registrationData) => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });

    const data = await handleResponse(response);
    return { success: true, data: data.data };
  } catch (error) {
    throw error instanceof APIError ? error : new APIError('Failed to register for event', 500);
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
  return { success: true, data: data.data };
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
  return { success: true, data: data.data };
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: authHeader()
  });

  const data = await handleResponse(response);
  return { success: true, data: data.data };
};

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
  return { success: true, data: data.data };
};

export const updateRegistrationStatus = async (eventId, registrationId, status) => {
  const response = await fetch(`${API_URL}/events/${eventId}/registrations/${status}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({ registrationId })
  });

  const data = await handleResponse(response);
  return { success: true, data: data.data };
};

export const deleteEvent = async (eventId) => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: authHeader()
  });

  const data = await handleResponse(response);
  return { success: true, data: data.data };
};

export const uploadImage = async (file, type = 'event') => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...authHeader()
      },
      body: formData
    });

    const data = await handleResponse(response);
    return { success: true, data: data.data };
  } catch (error) {
    throw error instanceof APIError ? error : new APIError('Failed to upload image', 500);
  }
};


