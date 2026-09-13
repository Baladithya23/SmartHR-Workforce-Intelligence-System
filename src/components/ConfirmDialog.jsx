import { useEffect } from "react";
import "../styles/modal.css";


/**
 * ConfirmDialog — Reusable delete confirmation modal.
 *
 * Props:
 *   isOpen    {boolean}  — controls visibility
 *   title     {string}   — dialog heading
 *   message   {string}   — dialog body text
 *   onConfirm {fn}       — called when Delete is clicked
 *   onCancel  {fn}       — called when Cancel is clicked
 */
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {

    // Close on Escape key
    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") onCancel();
        }
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>

            <div
                className="confirm-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Danger stripe */}
                <div className="confirm-dialog-stripe" />

                <div className="confirm-dialog-body">

                    {/* Warning icon */}
                    <div className="confirm-dialog-icon">⚠️</div>

                    <h2 className="confirm-dialog-title">{title || "Are you sure?"}</h2>

                    <p className="confirm-dialog-message">
                        {message || "This action cannot be undone."}
                    </p>

                    <div className="confirm-dialog-actions">
                        <button className="btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                        <button
                            className="btn-confirm-delete"
                            onClick={onConfirm}
                        >
                            🗑️ Delete
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
}


export default ConfirmDialog;
