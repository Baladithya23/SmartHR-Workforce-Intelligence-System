import axios from "axios";
import { getToken } from "./AuthService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL  = `${BASE_URL}/api/employees`;

function authHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET all employees (flat list)
export const getEmployees = () =>
    axios.get(API_URL, { headers: authHeader() });

// GET employees paged
export const getEmployeesPaged = (page = 0, size = 10, sort = "employeeName", dir = "asc") =>
    axios.get(`${API_URL}/paged`, {
        params: { page, size, sort, dir },
        headers: authHeader(),
    });

// GET employee by ID
export const getEmployeeById = (id) =>
    axios.get(`${API_URL}/${id}`, { headers: authHeader() });

// GET stats
export const getEmployeeStats = () =>
    axios.get(`${API_URL}/stats`, { headers: authHeader() });

// GET search
export const searchEmployees = (params) =>
    axios.get(`${API_URL}/search`, { params, headers: authHeader() });

// POST — add new employee
export const addEmployee = (employee) =>
    axios.post(API_URL, employee, { headers: authHeader() });

// PUT — update employee
export const updateEmployee = (id, employee) =>
    axios.put(`${API_URL}/${id}`, employee, { headers: authHeader() });

// DELETE — remove employee
export const deleteEmployee = (id) =>
    axios.delete(`${API_URL}/${id}`, { headers: authHeader() });