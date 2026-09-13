import axios from "axios";
import { getToken } from "./AuthService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getDashboardAnalytics = () =>
    axios.get(`${BASE_URL}/api/analytics/dashboard`, { headers: authHeader() });
