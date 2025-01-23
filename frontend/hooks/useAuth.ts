import { useState, useEffect } from "react";

interface AuthState {
  user: { token: string } | null;
  loading: boolean; // Add a loading state
  login: (token: string) => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true); // Track initialization/loading state

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setUser({ token });
    }
    setLoading(false); // Mark initialization as complete
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return { user, loading, login, logout };
}
