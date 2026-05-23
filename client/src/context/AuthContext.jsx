import { useEffect, useState } from 'react';
import { getCurrentUser, setCurrentUser } from '../data/localStore';
import { AuthContext } from './authContextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      setUser(getCurrentUser());
      setLoading(false);
    });
  }, []);

  const updateUser = (nextUser) => {
    setCurrentUser(nextUser);
    setUser(nextUser);
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser: updateUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
