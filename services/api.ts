const API_BASE = import.meta.env.VITE_API_BASE;
// Token management
let authToken: string | null = localStorage.getItem('token');

export const setToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getToken = () => authToken;

// Base fetch wrapper
const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data.data;
};

// ============ AUTH ============
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { email: string; password: string; fullName: string; studentId?: string }) =>
    apiFetch<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (email: string) =>
    apiFetch<null>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiFetch<null>(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
};

// ============ USERS ============
export const userApi = {
  getAll: () => apiFetch<any[]>('/users'),
  getMe: () => apiFetch<any>('/users/me'),
  getById: (id: string) => apiFetch<any>(`/users/${id}`),
  updateMe: (data: Partial<any>) =>
    apiFetch<any>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/users/me/photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  },
  approve: (userId: string) =>
    apiFetch<any>(`/users/${userId}/approve`, { method: 'PUT' }),
};

// ============ FRIENDSHIPS ============
export const friendApi = {
  getAll: () => apiFetch<string[]>('/friends'),
  getPending: () => apiFetch<any[]>('/friends/pending'),
  sendRequest: (userId: string) =>
    apiFetch<null>(`/friends/request/${userId}`, { method: 'POST' }),
  accept: (userId: string) =>
    apiFetch<null>(`/friends/accept/${userId}`, { method: 'POST' }),
  reject: (userId: string) =>
    apiFetch<null>(`/friends/reject/${userId}`, { method: 'POST' }),
  block: (userId: string) =>
    apiFetch<null>(`/friends/block/${userId}`, { method: 'POST' }),
};

// ============ CHAT ============
export const chatApi = {
  getConversation: (userId: string) => apiFetch<any[]>(`/chat/${userId}`),
  sendMessage: (userId: string, content: string) =>
    apiFetch<any>(`/chat/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  markRead: (messageId: string) =>
    apiFetch<any>(`/chat/${messageId}/read`, { method: 'PUT' }),
};

// ============ SIGNATURES ============
export const signatureApi = {
  getForUser: (userId: string) => apiFetch<any[]>(`/signatures/${userId}`),
  sign: (userId: string, message: string, style: string) =>
    apiFetch<any>(`/signatures/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ message, style }),
    }),
};

// ============ MEMORIES ============
export const memoryApi = {
  getAll: () => apiFetch<any[]>('/memories'),
  create: (content: string) =>
    apiFetch<any>('/memories', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  delete: (id: string) => apiFetch<null>(`/memories/${id}`, { method: 'DELETE' }),
  toggleLike: (id: string) =>
    apiFetch<any>(`/memories/${id}/like`, { method: 'POST' }),
};

// ============ HIGHLIGHTS ============
export const highlightApi = {
  getAll: () => apiFetch<any[]>('/highlights'),
  create: async (data: FormData) => {
    const res = await fetch(`${API_BASE}/highlights`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: data,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json.data;
  },
  delete: (id: string) => apiFetch<null>(`/highlights/${id}`, { method: 'DELETE' }),
};
