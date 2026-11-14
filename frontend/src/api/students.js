// Use the published backend port for local Vite development. In Docker, the
// production build points to /api and Nginx forwards that path to the backend.
const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_BASE_URL || '/api')
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
const API_URL = API_BASE_URL.endsWith('/api')
  ? `${API_BASE_URL}/students`
  : `${API_BASE_URL}/api/students`;

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Could not reach the server. Check that the backend is running.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Something went wrong. Please try again.');
  }
  return result;
}

export function getStudents() {
  return request(API_URL);
}

export function createStudent(student) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(student),
  });
}

export function deleteStudent(id) {
  return request(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
