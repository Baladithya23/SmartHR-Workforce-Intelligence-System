import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";


const PAGE_TITLES = {
    "/":                { title: "Dashboard",          sub: "Workforce overview"                },
    "/employees":       { title: "Employee Management",sub: "Manage your team"                  },
    "/add-employee":    { title: "Add Employee",       sub: "Create a new employee record"      },
    "/departments":     { title: "Departments",        sub: "Manage your organization units"    },
    "/skill-analysis":  { title: "Skill Analysis",     sub: "Identify skill gaps in your team"  },
    "/audit-logs":      { title: "Audit Logs",         sub: "Full activity trail (Admin only)"  },
    "/profile":         { title: "My Profile",         sub: "Your account information"          },
};


function Navbar({ onMenuToggle }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();

    // Match dynamic routes
    let pageInfo = PAGE_TITLES[location.pathname];
    if (!pageInfo && location.pathname.startsWith("/edit-employee")) {
        pageInfo = { title: "Edit Employee", sub: "Update employee details" };
    }
    if (!pageInfo && location.pathname.startsWith("/employees/")) {
        pageInfo = { title: "Employee Details", sub: "View employee profile" };
    }
    if (!pageInfo) {
        pageInfo = { title: "SmartHR", sub: "" };
    }

    function getInitials(name = "") {
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    }

    const displayName = user?.username || "User";
    const primaryRole = user?.roles?.includes("ROLE_ADMIN")
        ? "Admin"
        : user?.roles?.includes("ROLE_HR")
        ? "HR"
        : "Employee";

    function handleLogout() {
        logoutUser();
        navigate("/login");
    }

    return (
        <header className="navbar">

            {/* ── Left ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                    className="navbar-hamburger"
                    onClick={onMenuToggle}
                    aria-label="Toggle sidebar"
                >
                    ☰
                </button>

                <div className="navbar-left">
                    <h1 className="navbar-title">{pageInfo.title}</h1>
                    {pageInfo.sub && (
                        <span className="navbar-breadcrumb">{pageInfo.sub}</span>
                    )}
                </div>
            </div>

            {/* ── Right ── */}
            <div className="navbar-right">

                {/* Notifications */}
                <button className="navbar-icon-btn" aria-label="Notifications">
                    🔔
                    <span className="navbar-badge" />
                </button>

                {/* User chip */}
                <div className="navbar-user">
                    <div className="navbar-user-avatar">{getInitials(displayName)}</div>
                    <div>
                        <div className="navbar-user-name">{displayName}</div>
                        <div className="navbar-user-role">{primaryRole}</div>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    className="navbar-logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                    aria-label="Logout"
                >
                    🚪
                </button>

            </div>
        </header>
    );
}


export default Navbar;