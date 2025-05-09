/**
 * API service for making requests to the backend
 */

const API_URL = 'http://localhost:5000/api';

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
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to process server response');
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
  // Handle the new response format which has events inside an object
  return data.events || (data.data && data.data.events) || data.data || [];
};

export const getEventById = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`);
  const data = await handleResponse(response);
  // Handle the new response format
  return data.data || data;
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
    // Handle the new response format
    return { success: true, data: data.data || data };
  } catch (error) {
    throw error;
  }
};

// Check if a user is already registered for an event
export const checkEventRegistration = async (eventId, email) => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/check-registration?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await handleResponse(response);
    return data.isRegistered || false;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
};

export const registerForEvent = async (eventId, registrationData) => {
  try {
    // Extract just the ID part before any dash
    const cleanEventId = eventId.split('-')[0];
    console.log('Registering for event with ID:', cleanEventId);

    const response = await fetch(`${API_URL}/events/${cleanEventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });

    const data = await handleResponse(response);
    // Handle the new response format
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error('Error in registerForEvent:', error);
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

export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(profileData)
    });

    const data = await handleResponse(response);
    return { success: true, data: data.data || data };
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(passwordData)
    });

    const data = await handleResponse(response);
    return { success: true, data: data.data || data };
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

// User events
export const getUserEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/events/user`, {
      headers: authHeader()
    });

    const data = await handleResponse(response);
    console.log('Raw API response from getUserEvents:', data);

    // Handle the new response format
    if (data && data.data && data.data.events && Array.isArray(data.data.events)) {
      // This is the structure we're seeing in the console logs
      return data.data.events;
    } else if (data && data.events && Array.isArray(data.events)) {
      return data.events;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && !data.data && !data.events) {
      // If it's a single event object
      return [data];
    }

    // If we can't determine the structure, return the raw data for the component to handle
    return data;
  } catch (error) {
    console.error('Error in getUserEvents:', error);
    return [];
  }
};

// Admin functions
export const getUsers = async () => {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: authHeader()
  });

  const data = await handleResponse(response);
  // Handle the new response format
  return data.users || data.data || [];
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
  // Handle the new response format
  return data.data || data;
};

// Update registration status
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
  // Handle the new response format
  return data.data || data;
};

export const deleteEvent = async (eventId) => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: authHeader()
  });

  const data = await handleResponse(response);
  // Handle the new response format
  return data.success || (data && true);
};

// File upload functions
export const uploadImage = async (file, type = 'event') => {
  try {
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
    // Handle the new response format
    return data.data || data;
  } catch (error) {
    throw error;
  }
};


