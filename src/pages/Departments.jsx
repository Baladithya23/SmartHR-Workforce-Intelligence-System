import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
} from "../Services/DepartmentService";
import ConfirmDialog from "../components/ConfirmDialog";
import useToast from "../components/Toast";
import "../styles/employee.css";
import "../styles/modal.css";
import "../styles/form.css";


const INITIAL_FORM = {
    departmentName: "",
    description:    "",
    location:       "",
};

const DEPT_ICONS = ["💻", "📊", "🎨", "🔧", "📦", "💼", "🏥", "📐", "🔬", "🎯"];


function Departments() {

    const navigate = useNavigate();
    const { showToast, ToastContainer } = useToast();

    const [departments, setDepartments]   = useState([]);
    const [loading, setLoading]           = useState(true);
    const [showForm, setShowForm]         = useState(false);
    const [editId, setEditId]             = useState(null);
    const [form, setForm]                 = useState(INITIAL_FORM);
    const [errors, setErrors]             = useState({});
    const [saving, setSaving]             = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, dept: null });


    useEffect(() => {
        loadDepartments();
    }, []);


    function loadDepartments() {
        setLoading(true);
        getDepartments()
            .then((res) => setDepartments(res.data))
            .catch(() => showToast({ type: "error", title: "Load Failed", message: "Could not fetch departments." }))
            .finally(() => setLoading(false));
    }


    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }


    function validate() {
        const e = {};
        if (!form.departmentName.trim()) e.departmentName = "Department name is required.";
        return e;
    }


    function openAddForm() {
        setForm(INITIAL_FORM);
        setErrors({});
        setEditId(null);
        setShowForm(true);
    }


    function openEditForm(dept) {
        setForm({
            departmentName: dept.departmentName || "",
            description:    dept.description    || "",
            location:       dept.location       || "",
        });
        setErrors({});
        setEditId(dept.departmentId);
        setShowForm(true);
    }


    function handleFormCancel() {
        setShowForm(false);
        setEditId(null);
        setErrors({});
    }


    function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSaving(true);

        const action = editId
            ? updateDepartment(editId, form)
            : addDepartment(form);

        action
            .then(() => {
                showToast({
                    type:    "success",
                    title:   editId ? "Updated!" : "Department Added!",
                    message: `${form.departmentName} has been ${editId ? "updated" : "created"} successfully.`,
                });
                setShowForm(false);
                setEditId(null);
                loadDepartments();
            })
            .catch(() => {
                showToast({ type: "error", title: "Save Failed", message: "Could not save department." });
            })
            .finally(() => setSaving(false));
    }


    function handleDeleteClick(dept) {
        setDeleteDialog({ open: true, dept });
    }

    function handleDeleteConfirm() {
        const dept = deleteDialog.dept;
        setDeleteDialog({ open: false, dept: null });

        deleteDepartment(dept.departmentId)
            .then(() => {
                setDepartments((prev) => prev.filter((d) => d.departmentId !== dept.departmentId));
                showToast({
                    type:    "success",
                    title:   "Deleted!",
                    message: `${dept.departmentName} department has been removed.`,
                });
            })
            .catch(() => {
                showToast({ type: "error", title: "Delete Failed", message: "Could not delete department." });
            });
    }


    return (
        <div className="dept-container">

            {/* ── Page Header ── */}
            <div className="dept-page-header">
                <div>
                    <h1 className="dept-page-title">Departments</h1>
                    <p className="dept-page-subtitle">
                        {departments.length} department{departments.length !== 1 ? "s" : ""} in your organization
                    </p>
                </div>
                <button className="btn-add" onClick={openAddForm}>
                    ＋ Add Department
                </button>
            </div>

            {/* ── Add / Edit Form Modal ── */}
            {showForm && (
                <div className="modal-overlay" onClick={handleFormCancel}>
                    <div
                        className="confirm-dialog"
                        style={{ maxWidth: "520px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="confirm-dialog-stripe"
                            style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
                        />
                        <div className="confirm-dialog-body">
                            <h2 className="confirm-dialog-title" style={{ textAlign: "left", marginBottom: "20px" }}>
                                {editId ? "✏️ Edit Department" : "➕ Add Department"}
                            </h2>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group" style={{ marginBottom: "16px" }}>
                                    <label className="form-label" htmlFor="departmentName">
                                        Department Name <span className="required">*</span>
                                    </label>
                                    <input
                                        id="departmentName"
                                        name="departmentName"
                                        type="text"
                                        className={`form-input${errors.departmentName ? " error" : ""}`}
                                        placeholder="e.g. Engineering"
                                        value={form.departmentName}
                                        onChange={handleChange}
                                    />
                                    {errors.departmentName && (
                                        <span className="form-error-msg">⚠ {errors.departmentName}</span>
                                    )}
                                </div>

                                <div className="form-group" style={{ marginBottom: "16px" }}>
                                    <label className="form-label" htmlFor="location">
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Floor 3, Block A"
                                        value={form.location}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: "24px" }}>
                                    <label className="form-label" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="form-textarea"
                                        placeholder="Brief description of the department…"
                                        rows="3"
                                        value={form.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="confirm-dialog-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={handleFormCancel}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-save"
                                        style={{ flex: 1 }}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <><span className="btn-spinner" /> Saving…</>
                                        ) : (
                                            editId ? "✓ Update" : "✓ Create"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Department Cards Grid ── */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                    Loading departments…
                </div>
            ) : departments.length === 0 ? (
                <div className="table-empty">
                    <div className="table-empty-icon">🏢</div>
                    <h3>No departments yet</h3>
                    <p>Click "Add Department" to create your first department</p>
                </div>
            ) : (
                <div className="dept-grid">
                    {departments.map((dept, idx) => (
                        <div key={dept.departmentId} className="dept-card">
                            <div className="dept-card-header">
                                <div className="dept-card-icon">
                                    {DEPT_ICONS[idx % DEPT_ICONS.length]}
                                </div>
                                <div>
                                    <div className="dept-card-name">{dept.departmentName}</div>
                                    {dept.location && (
                                        <div className="dept-card-location">
                                            📍 {dept.location}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {dept.description && (
                                <p className="dept-card-desc">{dept.description}</p>
                            )}

                            <div className="dept-card-actions">
                                <button
                                    className="btn-edit"
                                    onClick={() => openEditForm(dept)}
                                >
                                    ✏️ <span>Edit</span>
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDeleteClick(dept)}
                                >
                                    🗑️ <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Confirm Delete ── */}
            <ConfirmDialog
                isOpen={deleteDialog.open}
                title="Delete Department"
                message={
                    deleteDialog.dept
                        ? <>Are you sure you want to delete the{" "}
                            <span className="confirm-dialog-name">{deleteDialog.dept.departmentName}</span>{" "}
                            department? This action cannot be undone.</>
                        : ""
                }
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ open: false, dept: null })}
            />

            <ToastContainer />
        </div>
    );
}


export default Departments;
