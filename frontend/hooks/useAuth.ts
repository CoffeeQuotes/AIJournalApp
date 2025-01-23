import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface AuthState {
    user: { token: string } | null;
    login: (token: string) => void;
    logout: () => void;
    refreshToken: (token: string) => void;
}

export function useAuth(): AuthState {
    const [user, setUser] = useState<{ token: string } | null>(null);

    useEffect(() => {
        const token = getCookie("authToken");
        if (token) {
            setUser({ token: token as string });
        }
    }, []);

    const login = (token: string) => {
        setUser({ token });
    };

    const logout = () => {
        deleteCookie("authToken");
        setUser(null);
    };

    const refreshToken = useCallback((token: string) => {
        setCookie('authToken', token, { maxAge: 60 * 60 });
        setUser({token});
    }, []);

    return { user, login, logout, refreshToken };
}