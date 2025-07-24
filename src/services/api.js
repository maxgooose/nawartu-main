const BASE_URL = process.env.REACT_APP_API_URL || '';

const getAuthToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const headers = {};
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = (body instanceof FormData) ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error);
    throw error;
  }
};

export default apiRequest; 