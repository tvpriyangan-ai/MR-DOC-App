// Small helper so every other JS file can just call api.get(), api.post(), etc.
// Automatically attaches the login token and points to the right base URL.

const API_BASE = '/api'; // same server serves frontend + backend, so relative path works

function getToken() {
  return localStorage.getItem('token');
}

async function apiRequest(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data.data;
}

const api = {
  get: (path) => apiRequest('GET', path),
  post: (path, body) => apiRequest('POST', path, body),
  put: (path, body) => apiRequest('PUT', path, body),
  delete: (path) => apiRequest('DELETE', path)
};
