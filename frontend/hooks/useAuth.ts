import { useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

interface AuthState {
  user: { token: string; username: string } | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<{ token: string; username: string } | null>(
    null,
  );

  useEffect(() => {
    const token = getCookie("authToken");
    const username = getCookie("username");
    if (token && username) {
      setUser({ token: token as string, username: username as string });
    }
  }, []);

  const login = (token: string, username: string) => {
    setCookie("username", username, { path: "/" });
    setUser({ token, username });
  };

  const logout = () => {
    deleteCookie("authToken");
    deleteCookie("username");
    setUser(null);
  };

  return { user, login, logout };
}
