import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";


const NAV_ITEMS = [
    {
        section: "Main",
        links: [
            { to: "/",              icon: "🏠", label: "Dashboard"      },
        ]
    },
    {
        section: "Management",
        links: [
            { to: "/employees",     icon: "👥", label: "Employees"      },
            { to: "/departments",   icon: "🏢", label: "Departments"    },
        ]
    },
    {
        section: "Intelligence",
        links: [
            { to: "/skill-analysis",icon: "🎯", label: "Skill Analysis" },
            { to: "/audit-logs",    icon: "📋", label: "Audit Logs",  adminOnly: true },
        ]
    },
    {
        section: "Account",
        links: [
            { to: "/profile",       icon: "👤", label: "My Profile"     },
        ]
    },
];


function Sidebar({ mobileOpen, onClose }) {
    const navigate = useNavigate();
    const { user, logoutUser, isAdmin } = useAuth();

    function handleLogout() {
        logoutUser();
        navigate("/login");
    }

    function getInitials(name = "") {
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    }

    const displayName = user?.username || "User";
    const primaryRole = user?.roles?.includes("ROLE_ADMIN")
        ? "Administrator"
        : user?.roles?.includes("ROLE_HR")
        ? "HR Manager"
        : "Employee";

    return (
        <>
            {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}

            <div className={`sidebar${mobileOpen ? " mobile-open" : ""}`}>

                {/* ── Brand ── */}
                <div className="sidebar-brand">
                    <div className="sidebar-brand-logo">
                        <div className="sidebar-logo-icon">🏛️</div>
                        <div className="sidebar-brand-text">
                            <span className="sidebar-brand-name">SmartHR</span>
                            <span className="sidebar-brand-tagline">Workforce Intelligence</span>
                        </div>
                    </div>
                </div>

                {/* ── Navigation ── */}
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((section) => {
                        // Filter out adminOnly links for non-admins
                        const links = section.links.filter(l => !l.adminOnly || isAdmin());
                        if (links.length === 0) return null;
                        return (
                            <div key={section.section} className="sidebar-nav-section">
                                <span className="sidebar-nav-label">{section.section}</span>
                                <ul>
                                    {links.map((item) => (
                                        <li key={item.to}>
                                            <NavLink
                                                to={item.to}
                                                end={item.to === "/"}
                                                className={({ isActive }) =>
                                                    `sidebar-link${isActive ? " active" : ""}`
                                                }
                                                onClick={() => onClose && onClose()}
                                            >
                                                <span className="sidebar-icon">{item.icon}</span>
                                                <span className="sidebar-link-text">{item.label}</span>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </nav>

                {/* ── User Footer ── */}
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">{getInitials(displayName)}</div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{displayName}</div>
                            <div className="sidebar-user-role">{primaryRole}</div>
                        </div>
                    </div>
                    <button
                        className="sidebar-logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        🚪 Logout
                    </button>
                </div>

            </div>
        </>
    );
}


export default Sidebar;