// TODO(Supabase): Replace localStorage with Supabase Auth

// Initialize mock data
const initializeMockData = () => {
  const users = localStorage.getItem('users_db');
  if (!users) {
    localStorage.setItem('users_db', JSON.stringify([
      { email: 'phamanhkhoadeptrai@gmail.com', password: '123' }
    ]));
  }
};
initializeMockData();

export const setAuthSession = (email: string) => {
  localStorage.setItem('auth_session', email);
};

export const getAuthSession = (): string | null => {
  return localStorage.getItem('auth_session');
};

export const clearAuthSession = () => {
  localStorage.removeItem('auth_session');
};

export const registerUser = (email: string, password: string) => {
  // TODO(Supabase): Implement real registration
  const users = JSON.parse(localStorage.getItem('users_db') || '[]');
  const exists = users.find((u: any) => u.email === email);
  if (exists) throw new Error('Email đã được sử dụng');
  users.push({ email, password });
  localStorage.setItem('users_db', JSON.stringify(users));
};

export const loginUser = (email: string, password: string) => {
  // TODO(Supabase): Implement real login
  const users = JSON.parse(localStorage.getItem('users_db') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  if (!user) throw new Error('Email hoặc mật khẩu không đúng');
  setAuthSession(email);
};
