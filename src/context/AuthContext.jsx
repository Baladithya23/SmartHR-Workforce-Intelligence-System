import { createContext, useContext, useState, useCallback } from "react";
import { login as apiLogin, saveAuth, clearAuth, getToken, getStoredUser } from "../Services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(() => getToken());
    const [user,  setUser]  = useState(() => getStoredUser());

    const loginUser = useCallback(async (credentials) => {
        const res  = await apiLogin(credentials);
        const data = res.data;
        saveAuth(data.token, {
            username: data.username,
            email:    data.email,
            roles:    data.roles,
        });
        setToken(data.token);
        setUser({ username: data.username, email: data.email, roles: data.roles });
        return data;
    }, []);

    const logoutUser = useCallback(() => {
        clearAuth();
        setToken(null);
        setUser(null);
    }, []);

    const hasRole = useCallback((role) => {
        if (!user?.roles) return false;
        return user.roles.includes(`ROLE_${role}`) || user.roles.includes(role);
    }, [user]);

    const isAdmin = () => hasRole("ROLE_ADMIN") || hasRole("ADMIN");
    const isHR    = () => hasRole("ROLE_HR")    || hasRole("HR");

    return (
        <AuthContext.Provider value={{ token, user, loginUser, logoutUser, hasRole, isAdmin, isHR }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
