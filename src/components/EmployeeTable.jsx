/**
 * EmployeeTable — Reusable presentational component.
 *
 * Renders the employee data table with avatar initials,
 * designation/department badges, formatted salary, and
 * Edit / Delete action buttons.
 *
 * Props:
 *   employees  {Array}   — filtered list of employee objects
 *   loading    {boolean} — show skeleton rows when true
 *   onEdit     {fn}      — called with employee object when Edit clicked
 *   onDelete   {fn}      — called with employee object when Delete clicked
 */

import "../styles/employee.css";


function EmployeeTable({ employees = [], loading = false, onEdit, onDelete }) {

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

                    {/* Skeleton loading rows */}
                    {loading && Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="loading-row">
                            <td><div className="skeleton-line" style={{ width: "160px" }} /></td>
                            <td className="hide-sm"><div className="skeleton-line" style={{ width: "100px" }} /></td>
                            <td className="hide-md"><div className="skeleton-line" style={{ width: "80px" }} /></td>
                            <td className="hide-sm"><div className="skeleton-line" style={{ width: "80px" }} /></td>
                            <td><div className="skeleton-line" style={{ width: "120px" }} /></td>
                        </tr>
                    ))}

                    {/* Empty state */}
                    {!loading && employees.length === 0 && (
                        <tr>
                            <td colSpan="5">
                                <div className="table-empty">
                                    <div className="table-empty-icon">👥</div>
                                    <h3>No employees found</h3>
                                    <p>Try adjusting your search or add a new employee</p>
                                </div>
                            </td>
                        </tr>
                    )}

                    {/* Data rows */}
                    {!loading && employees.map((emp) => (
                        <tr key={emp.employeeId}>
                            <td>
                                <div className="emp-name-cell">
                                    <div className="emp-avatar">{getInitials(emp.employeeName)}</div>
                                    <div>
                                        <div className="emp-name">{emp.employeeName}</div>
                                        <div className="emp-email">{emp.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="hide-sm">
                                {emp.designation
                                    ? <span className="designation-badge">{emp.designation}</span>
                                    : "—"}
                            </td>
                            <td className="hide-md">
                                {emp.department
                                    ? <span className="dept-badge">{emp.department}</span>
                                    : "—"}
                            </td>
                            <td className="hide-sm salary-cell">
                                {formatSalary(emp.salary)}
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="btn-edit" onClick={() => onEdit && onEdit(emp)}>
                                        ✏️ <span>Edit</span>
                                    </button>
                                    <button className="btn-delete" onClick={() => onDelete && onDelete(emp)}>
                                        🗑️ <span>Delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}


export default EmployeeTable;
