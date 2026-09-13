import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function Profile() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    function getInitials(name = "") {
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    }

    const primaryRole = user?.roles?.includes("ROLE_ADMIN")
        ? "Administrator"
        : user?.roles?.includes("ROLE_HR")
        ? "HR Manager"
        : "Employee";

    const roleColor = user?.roles?.includes("ROLE_ADMIN")
        ? { bg: "rgba(220,38,38,0.1)", color: "#dc2626" }
        : user?.roles?.includes("ROLE_HR")
        ? { bg: "rgba(37,99,235,0.1)", color: "#2563eb" }
        : { bg: "rgba(22,163,74,0.1)", color: "#16a34a" };

    function handleLogout() {
        logoutUser();
        navigate("/login");
    }

    return (
        <div style={{ maxWidth: "600px" }}>

            {/* Profile Card */}
            <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
            }}>

                {/* Cover gradient */}
                <div style={{
                    height: "120px",
                    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                }} />

                {/* Avatar */}
                <div style={{ padding: "0 32px", marginTop: "-40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{
                        width: "80px", height: "80px", borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "28px", fontWeight: 800, color: "#fff",
                        border: "4px solid var(--surface)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    }}>
                        {getInitials(user?.username || "U")}
                    </div>
                    <span style={{
                        ...roleColor,
                        padding: "6px 16px",
                        borderRadius: "99px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "10px",
                    }}>
                        {primaryRole}
                    </span>
                </div>

                {/* Info */}
                <div style={{ padding: "20px 32px 32px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>
                        {user?.username}
                    </h2>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                        {user?.email}
                    </p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                        padding: "20px",
                        background: "var(--bg)",
                        borderRadius: "var(--radius-md)",
                        marginBottom: "24px",
                    }}>
                        <div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                                Username
                            </div>
                            <div style={{ fontWeight: 600 }}>{user?.username}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                                Email
                            </div>
                            <div style={{ fontWeight: 600 }}>{user?.email}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                                Role
                            </div>
                            <div style={{ fontWeight: 600 }}>{primaryRole}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                                Permissions
                            </div>
                            <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-secondary)" }}>
                                {user?.roles?.join(", ")}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            padding: "13px",
                            background: "rgba(220,38,38,0.08)",
                            border: "1px solid rgba(220,38,38,0.2)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--danger)",
                            fontWeight: 600,
                            fontSize: "14px",
                            fontFamily: "inherit",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.target.style.background = "rgba(220,38,38,0.15)"; }}
                        onMouseLeave={e => { e.target.style.background = "rgba(220,38,38,0.08)"; }}
                    >
                        🚪 Sign Out
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Profile;
