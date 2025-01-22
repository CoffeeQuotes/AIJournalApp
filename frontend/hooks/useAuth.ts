import { useState, useEffect} from "react";

interface AuthState {
    user: {token: string } | null;
    login: (token: string) => void;
    logout: () => void;
}

export function useAuth(): AuthState {
    const [user, setUser] = useState<{ token: string } | null>(null);

    
    useEffect(()=> {
        const token = localStorage.getItem('authToken');
        if(token) {
            setUser({token});
        }

    }, []);

    const login = (token: string) => {
        localStorage.setItem('authToken', token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return {user, login, logout};
}