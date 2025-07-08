import { useEffect, useState } from 'react';

const baseUrl = import.meta.env.VITE_API_URL;

export default function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/verify/check-verification`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        console.log(data.email)
        setAuthEmail(data.email);
        setIsAuthenticated(true);
      } catch (err) {
        console.log( err)
        setIsAuthenticated(false);
        setAuthEmail(null);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, authEmail };
}