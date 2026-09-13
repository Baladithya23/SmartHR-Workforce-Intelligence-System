import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById } from "../Services/EmployeeService";
import "../styles/employee.css";


function EmployeeDetails() {
    const { id }     = useParams();
    const navigate   = useNavigate();
    const [emp,      setEmp]      = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState("");


    useEffect(() => {
        getEmployeeById(id)
            .then(res => setEmp(res.data))
            .catch(() => setError("Could not load employee details."))
            .finally(() => setLoading(false));
    }, [id]);


    function formatCurrency(value) {
        if (value == null) return "—";
        return new Intl.NumberFormat("en-IN", {
            style: "currency", currency: "INR", maximumFractionDigits: 0,
        }).format(value);
    }

    function formatDate(date) {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    }

    function getInitials(name = "") {
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    }

    const statusColor = {
        ACTIVE:   { bg: "rgba(22,163,74,0.1)",  color: "#16a34a" },
        INACTIVE: { bg: "rgba(220,38,38,0.1)",  color: "#dc2626" },
        ON_LEAVE: { bg: "rgba(217,119,6,0.1)",  color: "#d97706" },
    };


    if (loading) return (
        <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
            Loading employee details…
        </div>
    );

    if (error) return (
        <div style={{ padding: "40px" }}>
            <button className="btn-back" onClick={() => navigate("/employees")}>← Back</button>
            <p style={{ marginTop: "20px", color: "var(--danger)" }}>⚠ {error}</p>
        </div>
    );


    return (
        <div style={{ maxWidth: "700px" }}>

            {/* Back button */}
            <button className="btn-back" style={{ marginBottom: "20px" }} onClick={() => navigate("/employees")}>
                ← Back to Employees
            </button>

            {/* Profile card */}
            <div style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)",
            }}>
                {/* Cover */}
                <div style={{ height: "100px", background: "linear-gradient(135deg, var(--primary), var(--secondary))" }} />

                {/* Top info */}
                <div style={{ padding: "0 28px", marginTop: "-36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{
                        width: "72px", height: "72px", borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "24px", fontWeight: 800, color: "#fff",
                        border: "4px solid var(--surface)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}>
                        {getInitials(emp.employeeName)}
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <span style={{
                            ...(statusColor[emp.status] || statusColor.INACTIVE),
                            padding: "5px 14px", borderRadius: "99px",
                            fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        }}>
                            {emp.status}
                        </span>
                        <button
                            className="btn-edit"
                            onClick={() => navigate(`/edit-employee/${emp.employeeId}`)}
                        >
                            ✏️ Edit
                        </button>
                    </div>
                </div>

                <div style={{ padding: "16px 28px 28px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 700 }}>{emp.employeeName}</h2>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
                        {emp.designation} {emp.departmentName && `• ${emp.departmentName}`}
                    </p>

                    {/* Details grid */}
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
                        padding: "20px", background: "var(--bg)", borderRadius: "var(--radius-md)",
                        marginBottom: "20px",
                    }}>
                        {[
                            { label: "Email",       value: emp.email },
                            { label: "Phone",       value: emp.phone || "—" },
                            { label: "Department",  value: emp.departmentName || "—" },
                            { label: "Designation", value: emp.designation },
                            { label: "Salary",      value: formatCurrency(emp.salary) },
                            { label: "Joined",      value: formatDate(emp.joiningDate) },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                                    {label}
                                </div>
                                <div style={{ fontWeight: 600, fontSize: "14px", wordBreak: "break-all" }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    {emp.skills?.length > 0 && (
                        <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                                Skills
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {emp.skills.map(s => (
                                    <span key={s} style={{
                                        padding: "5px 12px", borderRadius: "99px", fontSize: "13px", fontWeight: 500,
                                        background: "var(--primary-light)", color: "var(--primary)",
                                        border: "1px solid rgba(37,99,235,0.15)",
                                    }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default EmployeeDetails;
