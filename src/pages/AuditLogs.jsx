import { useState, useEffect } from "react";
import { getAuditLogs } from "../Services/AuditLogService";
import "../styles/audit.css";


function getActionLabel(action) {
    switch (action) {
        case "EMPLOYEE_CREATED": return { label: "Created", icon: "✨", cls: "audit-action-created" };
        case "EMPLOYEE_UPDATED": return { label: "Updated", icon: "✏️", cls: "audit-action-updated" };
        case "EMPLOYEE_DELETED": return { label: "Deleted", icon: "🗑️", cls: "audit-action-deleted" };
        default:                 return { label: action,   icon: "📋", cls: "audit-action-updated" };
    }
}

function formatDateTime(ts) {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function getInitials(name = "") {
    return name.substring(0, 2).toUpperCase();
}


function AuditLogs() {
    const [logs,    setLogs]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState("");


    useEffect(() => {
        getAuditLogs()
            .then(res => setLogs(res.data))
            .catch(() => setError("Could not load audit logs. You may not have ADMIN access."))
            .finally(() => setLoading(false));
    }, []);


    return (
        <div className="audit-page">

            {/* Header */}
            <div className="audit-header">
                <div>
                    <h1 className="audit-title">Audit Logs</h1>
                    <p className="audit-subtitle">Complete trail of all HR actions in the system</p>
                </div>
                {!loading && (
                    <span className="audit-count-badge">
                        {logs.length} {logs.length === 1 ? "entry" : "entries"}
                    </span>
                )}
            </div>

            <div className="audit-card">
                {loading ? (
                    <div className="audit-empty"><p>Loading audit logs…</p></div>
                ) : error ? (
                    <div className="audit-empty">
                        <div className="audit-empty-icon">🔒</div>
                        <p>{error}</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="audit-empty">
                        <div className="audit-empty-icon">📋</div>
                        <h3 style={{ marginBottom: "8px" }}>No audit logs yet</h3>
                        <p>Actions like creating or deleting employees will appear here.</p>
                    </div>
                ) : (
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Action</th>
                                <th>Performed By</th>
                                <th>Target Employee</th>
                                <th>Details</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, idx) => {
                                const { label, icon, cls } = getActionLabel(log.action);
                                return (
                                    <tr key={log.id}>
                                        <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                                            {idx + 1}
                                        </td>
                                        <td>
                                            <span className={`audit-action-badge ${cls}`}>
                                                {icon} {label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="audit-performer">
                                                <div className="audit-performer-avatar">
                                                    {getInitials(log.performedBy)}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{log.performedBy}</span>
                                            </div>
                                        </td>
                                        <td>{log.targetEmployee || "—"}</td>
                                        <td style={{ color: "var(--text-muted)", fontSize: "13px", maxWidth: "200px" }}>
                                            {log.details || "—"}
                                        </td>
                                        <td>
                                            <span className="audit-timestamp">
                                                {formatDateTime(log.timestamp)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default AuditLogs;
