import { useCallback, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../services/api';
import { AuthContext } from './authContextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      queueMicrotask(() => {
        void restoreSession();
      });
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const phone = firebaseUser.phoneNumber;
        if (!phone) {
          setLoading(false);
          return;
        }
        try {
          const idToken = await firebaseUser.getIdToken();
          const res = await api.post('/auth/login', { phone, idToken });
          localStorage.setItem('token', res.data.token);
          setUser(res.data.user);
        } catch {
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
          } catch {
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [restoreSession]);

  const logout = async () => {
    if (auth) {
      await auth.signOut();
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
