import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardAnalytics } from "../Services/AnalyticsService";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";


function Dashboard() {
    const { user } = useAuth();
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    async function loadDashboard() {
        try {
            const res = await getDashboardAnalytics();
            setData(res.data);
        } catch (err) {
            console.error("Dashboard load error:", err);
        } finally {
            setLoading(false);
        }
    }

    function formatCurrency(value) {
        if (value == null) return "—";
        return new Intl.NumberFormat("en-IN", {
            style: "currency", currency: "INR", maximumFractionDigits: 0,
        }).format(value);
    }

    function getInitials(name = "") {
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    }

    function formatDate(date) {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    }

    const statCards = [
        {
            key: "totalEmployees",
            label: "Total Employees",
            icon: "👥",
            color: "blue",
            value: loading ? null : data?.totalEmployees ?? 0,
            trend: "Active workforce",
        },
        {
            key: "totalDepartments",
            label: "Departments",
            icon: "🏢",
            color: "purple",
            value: loading ? null : data?.totalDepartments ?? 0,
            trend: "Organization units",
        },
        {
            key: "totalSalary",
            label: "Salary Budget",
            icon: "💰",
            color: "green",
            value: loading ? null : formatCurrency(data?.totalSalaryBudget),
            trend: "Monthly total",
        },
        {
            key: "avgSalary",
            label: "Average Salary",
            icon: "📈",
            color: "amber",
            value: loading ? null : formatCurrency(data?.averageSalary),
            trend: "Per employee",
        },
    ];

    const empPerDept = data?.employeesPerDepartment
        ? Object.entries(data.employeesPerDepartment)
        : [];

    return (
        <div className="dashboard">

            {/* ── Page Header ── */}
            <div className="dashboard-header">
                <h1 className="dashboard-greeting">
                    Welcome back, {user?.username || "Admin"} 👋
                </h1>
                <p className="dashboard-subtitle">
                    Here's what's happening with your workforce today.
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="stat-cards">
                {statCards.map((card) => (
                    <div key={card.key} className={`stat-card ${card.color}`}>
                        <div className="stat-card-icon">{card.icon}</div>
                        <div className="stat-card-body">
                            <div className="stat-card-label">{card.label}</div>
                            <div className={`stat-card-value${card.value == null ? " loading" : ""}`}>
                                {card.value != null ? card.value : ""}
                            </div>
                            <div className="stat-card-trend">↑ {card.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Two-column row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>

                {/* Employees per Department */}
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h2 className="dashboard-section-title">Employees by Department</h2>
                    </div>
                    {loading ? (
                        <div className="dashboard-empty"><p>Loading…</p></div>
                    ) : empPerDept.length === 0 ? (
                        <div className="dashboard-empty"><p>No data yet.</p></div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {empPerDept.map(([dept, count]) => {
                                const total = data.totalEmployees || 1;
                                const pct = Math.round((count / total) * 100);
                                return (
                                    <div key={dept}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                            <span style={{ fontSize: "14px", fontWeight: 500 }}>{dept}</span>
                                            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>{count} ({pct}%)</span>
                                        </div>
                                        <div style={{ height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
                                            <div style={{
                                                height: "100%",
                                                width: `${pct}%`,
                                                background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                                                borderRadius: "99px",
                                                transition: "width 0.6s ease",
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Highest Salary Employee */}
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h2 className="dashboard-section-title">🏆 Top Earner</h2>
                    </div>
                    {loading ? (
                        <div className="dashboard-empty"><p>Loading…</p></div>
                    ) : !data?.highestSalaryEmployee ? (
                        <div className="dashboard-empty"><p>No employee data yet.</p></div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{
                                    width: "56px", height: "56px", borderRadius: "50%",
                                    background: "linear-gradient(135deg, var(--warning), #f59e0b)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "20px", fontWeight: 700, color: "#fff", flexShrink: 0,
                                }}>
                                    {getInitials(data.highestSalaryEmployee.employeeName)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "16px" }}>{data.highestSalaryEmployee.employeeName}</div>
                                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{data.highestSalaryEmployee.designation}</div>
                                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{data.highestSalaryEmployee.departmentName}</div>
                                </div>
                            </div>
                            <div style={{
                                padding: "12px 16px",
                                background: "var(--warning-light)",
                                borderRadius: "var(--radius-md)",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                            }}>
                                <span style={{ fontSize: "13px", color: "var(--warning)" }}>Monthly Salary</span>
                                <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--warning)" }}>
                                    {formatCurrency(data.highestSalaryEmployee.salary)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Recent Employees ── */}
            <div className="dashboard-section" style={{ marginTop: "24px" }}>
                <div className="dashboard-section-header">
                    <h2 className="dashboard-section-title">Recently Joined Employees</h2>
                    <Link to="/employees" className="view-all-link">View all →</Link>
                </div>

                {loading ? (
                    <div className="dashboard-empty"><p>Loading employees…</p></div>
                ) : !data?.recentlyJoined?.length ? (
                    <div className="dashboard-empty">
                        <div className="dashboard-empty-icon">👥</div>
                        <p>No employees added yet.</p>
                    </div>
                ) : (
                    <table className="recent-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Designation</th>
                                <th>Department</th>
                                <th>Joined</th>
                                <th>Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentlyJoined.map((emp) => (
                                <tr key={emp.employeeId}>
                                    <td>
                                        <div className="employee-name-cell">
                                            <div className="employee-initials">{getInitials(emp.employeeName)}</div>
                                            <div>
                                                <div className="employee-name-text">{emp.employeeName}</div>
                                                <div className="employee-email-text">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="designation-badge">{emp.designation || "—"}</span></td>
                                    <td>{emp.departmentName || "—"}</td>
                                    <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                                        {formatDate(emp.joiningDate)}
                                    </td>
                                    <td><span className="salary-value">{formatCurrency(emp.salary)}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default Dashboard;