const API_URL = import.meta.env.VITE_API_URL || ''; // Configurable via environment variable, fallback to relative path

export async function apiRequest(method: string, path: string, body?: any) {
  const token = localStorage.getItem('admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, options);
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Return custom status for auth redirection
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.error || `Access Denied (${response.status})`);
      (err as any).status = response.status;
      throw err;
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: (path: string) => apiRequest('GET', path),
  post: (path: string, data: any) => apiRequest('POST', path, data),
  put: (path: string, data: any) => apiRequest('PUT', path, data),
  delete: (path: string) => apiRequest('DELETE', path),
};
