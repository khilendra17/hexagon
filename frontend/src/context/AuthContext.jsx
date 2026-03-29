import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './authContext.js';

const STORAGE_KEY = 'vitaflow_auth';

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const { token, user } = JSON.parse(raw);
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setState] = useState(loadStored);

  const login = useCallback((nextToken, nextUser) => {
    const payload = { token: nextToken, user: nextUser };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setState(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('smartiv_token');
    localStorage.removeItem('smartiv_user');
    setState({ token: null, user: null });
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
