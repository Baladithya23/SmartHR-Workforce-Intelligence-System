import axios from "axios";
import { getToken } from "./AuthService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL  = `${BASE_URL}/api/departments`;

function authHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getDepartments    = ()         => axios.get(API_URL,         { headers: authHeader() });
export const getDepartmentById = (id)       => axios.get(`${API_URL}/${id}`, { headers: authHeader() });
export const getDepartmentCount = ()        => axios.get(`${API_URL}/count`, { headers: authHeader() });
export const addDepartment     = (dept)     => axios.post(API_URL, dept,  { headers: authHeader() });
export const updateDepartment  = (id, dept) => axios.put(`${API_URL}/${id}`, dept, { headers: authHeader() });
export const deleteDepartment  = (id)       => axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
