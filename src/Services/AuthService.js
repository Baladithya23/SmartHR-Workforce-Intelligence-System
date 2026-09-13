import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// ── Token helpers ──────────────────────────────────────────────────────
export const TOKEN_KEY = "smarthr_token";
export const USER_KEY  = "smarthr_user";

export function saveAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return !!getToken();
}

// ── API calls ──────────────────────────────────────────────────────────

export const login = (credentials) =>
    axios.post(`${BASE_URL}/api/auth/login`, credentials);

export const register = (data) =>
    axios.post(`${BASE_URL}/api/auth/register`, data);
