import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../Services/EmployeeService";
import ConfirmDialog from "../components/ConfirmDialog";
import useToast from "../components/Toast";
import "../styles/employee.css";


function Employees() {

    const navigate = useNavigate();
    const { showToast, ToastContainer } = useToast();

    const [employees, setEmployees]         = useState([]);
    const [loading, setLoading]             = useState(true);
    const [searchQuery, setSearchQuery]     = useState("");
    const [deleteDialog, setDeleteDialog]   = useState({ open: false, employee: null });


    useEffect(() => {
        loadEmployees();
    }, []);


    function loadEmployees() {
        setLoading(true);
        getEmployees()
            .then((res) => setEmployees(res.data))
            .catch((err) => {
                console.error(err);
                showToast({ type: "error", title: "Load Failed", message: "Could not fetch employees." });
            })
            .finally(() => setLoading(false));
    }


    // ── Search filtering (client-side) ──
    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return employees;
        return employees.filter(
            (e) =>
                e.employeeName?.toLowerCase().includes(q) ||
                e.email?.toLowerCase().includes(q) ||
                e.designation?.toLowerCase().includes(q) ||
                e.department?.toLowerCase().includes(q)
        );
    }, [employees, searchQuery]);


    // ── Delete handlers ──
    function handleDeleteClick(employee) {
        setDeleteDialog({ open: true, employee });
    }

    function handleDeleteConfirm() {
        const emp = deleteDialog.employee;
        setDeleteDialog({ open: false, employee: null });

        deleteEmployee(emp.employeeId)
            .then(() => {
                setEmployees((prev) =>
                    prev.filter((e) => e.employeeId !== emp.employeeId)
                );
                showToast({
                    type:    "success",
                    title:   "Deleted!",
                    message: `${emp.employeeName} has been removed.`,
                });
            })
            .catch((err) => {
                console.error(err);
                showToast({
                    type:    "error",
                    title:   "Delete Failed",
                    message: "Could not delete the employee.",
                });
            });
    }

    function handleDeleteCancel() {
        setDeleteDialog({ open: false, employee: null });
    }


    // ── Helpers ──
    function getInitials(name = "") {
        return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    }

    function formatSalary(val) {
        if (val == null) return "—";
        return new Intl.NumberFormat("en-IN", {
            style: "currency", currency: "INR", maximumFractionDigits: 0,
        }).format(val);
    }


    return (
        <div className="employee-container">

            {/* ── Page Header ── */}
            <div className="employee-page-header">
                <div>
                    <h1 className="employee-page-title">Employee Management</h1>
                    <p className="employee-page-subtitle">Manage your team members and their information</p>
                </div>
                <button className="btn-add" onClick={() => navigate("/add-employee")}>
                    ＋ Add Employee
                </button>
            </div>

            {/* ── Toolbar ── */}
            <div className="employee-toolbar">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name, email, designation…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <span className="employee-count-badge">
                    {filtered.length} of {employees.length} employees
                </span>
            </div>

            {/* ── Table Card ── */}
            <div className="employee-table-card">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th className="hide-sm">Designation</th>
                            <th className="hide-md">Department</th>
                            <th className="hide-sm">Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {/* Loading skeleton rows */}
                        {loading && Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="loading-row">
                                <td><div className="skeleton-line" style={{ width: "160px" }} /></td>
                                <td className="hide-sm"><div className="skeleton-line" style={{ width: "100px" }} /></td>
                                <td className="hide-md"><div className="skeleton-line" style={{ width: "80px" }} /></td>
                                <td className="hide-sm"><div className="skeleton-line" style={{ width: "80px" }} /></td>
                                <td><div className="skeleton-line" style={{ width: "120px" }} /></td>
                            </tr>
                        ))}

                        {/* No results */}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td colSpan="5">
                                    <div className="table-empty">
                                        <div className="table-empty-icon">
                                            {searchQuery ? "🔍" : "👥"}
                                        </div>
                                        <h3>
                                            {searchQuery
                                                ? "No results found"
                                                : "No employees yet"
                                            }
                                        </h3>
                                        <p>
                                            {searchQuery
                                                ? `No employee matches "${searchQuery}"`
                                                : "Click \"Add Employee\" to get started"
                                            }
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Employee rows */}
                        {!loading && filtered.map((emp) => (
                            <tr key={emp.employeeId}>
                                <td>
                                    <div className="emp-name-cell">
                                        <div className="emp-avatar">
                                            {getInitials(emp.employeeName)}
                                        </div>
                                        <div>
                                            <div className="emp-name">{emp.employeeName}</div>
                                            <div className="emp-email">{emp.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hide-sm">
                                    {emp.designation
                                        ? <span className="designation-badge">{emp.designation}</span>
                                        : "—"
                                    }
                                </td>
                                <td className="hide-md">
                                    {emp.department
                                        ? <span className="dept-badge">{emp.department}</span>
                                        : "—"
                                    }
                                </td>
                                <td className="hide-sm salary-cell">
                                    {formatSalary(emp.salary)}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-edit"
                                            onClick={() => navigate(`/edit-employee/${emp.employeeId}`)}
                                        >
                                            ✏️ <span>Edit</span>
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteClick(emp)}
                                        >
                                            🗑️ <span>Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {/* ── Confirm Delete Dialog ── */}
            <ConfirmDialog
                isOpen={deleteDialog.open}
                title="Delete Employee"
                message={
                    deleteDialog.employee
                        ? <>Are you sure you want to delete{" "}
                            <span className="confirm-dialog-name">
                                {deleteDialog.employee.employeeName}
                            </span>?
                            This action cannot be undone.</>
                        : ""
                }
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />

            {/* ── Toast Notifications ── */}
            <ToastContainer />

        </div>
    );
}


export default Employees;