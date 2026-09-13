import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute  from "./components/ProtectedRoute";

import Sidebar       from "./components/Sidebar";
import Navbar        from "./components/Navbar";

import Login         from "./pages/Login";
import Dashboard     from "./pages/Dashboard";
import Employees     from "./pages/Employees";
import AddEmployee   from "./pages/AddEmployee";
import EditEmployee  from "./pages/EditEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import Departments   from "./pages/Departments";
import SkillAnalysis from "./pages/SkillAnalysis";
import AuditLogs     from "./pages/AuditLogs";
import Profile       from "./pages/Profile";

import "./styles/App.css";


/** Inner layout shown after login */
function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app">
            <Sidebar
                mobileOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="main">
                <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
                <div className="page-content">
                    <Routes>
                        <Route path="/"                       element={<Dashboard />} />
                        <Route path="/employees"              element={<Employees />} />
                        <Route path="/employees/:id"          element={<EmployeeDetails />} />
                        <Route path="/add-employee"           element={<AddEmployee />} />
                        <Route path="/edit-employee/:id"      element={<EditEmployee />} />
                        <Route path="/departments"            element={<Departments />} />
                        <Route path="/skill-analysis"         element={<SkillAnalysis />} />
                        <Route path="/audit-logs"             element={<AuditLogs />} />
                        <Route path="/profile"                element={<Profile />} />
                        <Route path="*"                       element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected – any authenticated user */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}


export default App;