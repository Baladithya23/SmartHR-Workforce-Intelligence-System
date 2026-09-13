import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const DEMO_USERS = [
    { role: "ADMIN",    label: "admin",    username: "admin",  password: "admin123" },
    { role: "HR",       label: "hr",       username: "hruser", password: "hr1234" },
    { role: "EMPLOYEE", label: "employee", username: "emp1",   password: "emp123" },
];

function Login() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { loginUser } = useAuth();

    const [form,    setForm]    = useState({ username: "", password: "" });
    const [errors,  setErrors]  = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || "/";

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name])  setErrors(p => ({ ...p, [name]: "" }));
        if (apiError)      setApiError("");
    }

    function validate() {
        const e = {};
        if (!form.username.trim()) e.username = "Username is required";
        if (!form.password.trim()) e.password = "Password is required";
        return e;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setLoading(true);
        setApiError("");
        try {
            await loginUser(form);
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setApiError("Unable to connect to backend server. Check if VITE_API_URL environment variable is set in live deployment or if backend is spinning up.");
            } else {
                const msg = err.response?.data?.message || "Invalid username or password";
                setApiError(msg);
            }
        } finally {
            setLoading(false);
        }
    }

    function fillDemo(user) {
        setForm({ username: user.username, password: user.password });
        setErrors({});
        setApiError("");
    }

    return (
        <div className="login-page">

            {/* Background decoration */}
            <div className="login-bg-decoration">
                <div className="login-bg-circle login-bg-circle-1" />
                <div className="login-bg-circle login-bg-circle-2" />
            </div>

            {/* ── Left Panel ── */}
            <div className="login-left">
                <div className="login-brand">
                    <div className="login-brand-icon">🏛️</div>
                    <div>
                        <div className="login-brand-name">SmartHR</div>
                        <span className="login-brand-tagline">Workforce Intelligence</span>
                    </div>
                </div>

                <h1 className="login-hero-title">
                    Manage your<br />
                    workforce <span>smarter</span>
                </h1>
                <p className="login-hero-subtitle">
                    A complete HR management system with intelligent skill tracking,
                    department analytics, and real-time workforce insights.
                </p>

                <div className="login-features">
                    {[
                        "JWT-secured role-based access control",
                        "Skill Gap Analyzer for every employee",
                        "Real-time workforce analytics dashboard",
                        "Complete audit trail of all HR actions",
                    ].map((f) => (
                        <div key={f} className="login-feature-item">
                            <div className="login-feature-dot" />
                            {f}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="login-right">
                <div className="login-card">
                    <h2 className="login-card-title">Welcome back</h2>
                    <p className="login-card-subtitle">Sign in to your SmartHR account</p>

                    {apiError && (
                        <div className="login-alert" role="alert">
                            ⚠️ {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="login-form-group">
                            <label className="login-label" htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className={`login-input${errors.username ? " error" : ""}`}
                                placeholder="Enter your username"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                            {errors.username && (
                                <span className="login-error-msg">⚠ {errors.username}</span>
                            )}
                        </div>

                        <div className="login-form-group">
                            <label className="login-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={`login-input${errors.password ? " error" : ""}`}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <span className="login-error-msg">⚠ {errors.password}</span>
                            )}
                        </div>

                        <button type="submit" className="login-btn" disabled={loading} id="login-submit-btn">
                            {loading ? (
                                <><div className="login-btn-spinner" /> Signing in…</>
                            ) : (
                                <> Sign In →</>
                            )}
                        </button>

                    </form>

                    {/* Demo credentials */}
                    <div className="login-demo">
                        <div className="login-demo-title">Demo Credentials</div>
                        {DEMO_USERS.map((u) => (
                            <div key={u.role} className="login-demo-row">
                                <span className={`login-demo-badge badge-${u.label}`}>{u.role}</span>
                                <span className="login-demo-creds">
                                    {u.username} / {u.password}
                                </span>
                                <button className="login-demo-fill" onClick={() => fillDemo(u)}>
                                    Fill ↗
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
