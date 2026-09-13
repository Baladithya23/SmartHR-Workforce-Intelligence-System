import { useState, useCallback } from "react";
import "../styles/modal.css";


/**
 * useToast — Custom hook for managing toast notifications.
 *
 * Returns:
 *   toasts    {Array}   — current list of toasts
 *   showToast {fn}      — showToast({ type, title, message })
 *   ToastContainer      — React component to render in JSX
 */
function useToast() {

    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(({ type = "info", title, message }) => {
        const id = Date.now();

        setToasts((prev) => [...prev, { id, type, title, message }]);

        // Auto-remove after 3.8s (matches CSS progress animation)
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3800);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Icons for each type
    const ICONS = {
        success: "✅",
        error:   "❌",
        info:    "ℹ️",
        warning: "⚠️",
    };

    function ToastContainer() {
        return (
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast ${toast.type}`}>
                        <div className="toast-icon">{ICONS[toast.type] || "ℹ️"}</div>
                        <div className="toast-body">
                            {toast.title   && <div className="toast-title">{toast.title}</div>}
                            {toast.message && <div className="toast-message">{toast.message}</div>}
                        </div>
                        <button
                            className="toast-close"
                            onClick={() => removeToast(toast.id)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    return { showToast, ToastContainer };
}


export default useToast;
