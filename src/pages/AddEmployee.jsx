import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addEmployee } from "../Services/EmployeeService";
import { getDepartments } from "../Services/DepartmentService";
import useToast from "../components/Toast";
import "../styles/form.css";


const INITIAL_FORM = {
    employeeName: "",
    email:        "",
    phone:        "",
    designation:  "",
    department:   "",
    salary:       "",
    joiningDate:  new Date().toISOString().split("T")[0],
    status:       "ACTIVE",
    skills:       "",      // comma-separated string
};

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "ON_LEAVE"];


function AddEmployee() {
    const navigate = useNavigate();
    const { showToast, ToastContainer } = useToast();

    const [form,        setForm]        = useState(INITIAL_FORM);
    const [errors,      setErrors]      = useState({});
    const [saving,      setSaving]      = useState(false);
    const [departments, setDepartments] = useState([]);


    useEffect(() => {
        getDepartments()
            .then((res) => setDepartments(res.data))
            .catch(() => {/* non-critical */});
    }, []);


    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }


    function validate() {
        const e = {};
        if (!form.employeeName.trim())     e.employeeName = "Employee name is required.";
        if (!form.email.trim())            e.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
        if (!form.designation.trim())      e.designation = "Designation is required.";
        if (!form.salary)                  e.salary = "Salary is required.";
        else if (Number(form.salary) <= 0) e.salary = "Salary must be greater than zero.";
        return e;
    }


    function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

        setSaving(true);

        // Build the payload matching backend EmployeeRequest DTO
        const selectedDept = departments.find(d => d.departmentName === form.department);
        const skillsList   = form.skills
            ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
            : [];

        const payload = {
            employeeName: form.employeeName,
            email:        form.email,
            phone:        form.phone || null,
            designation:  form.designation,
            salary:       Number(form.salary),
            joiningDate:  form.joiningDate || null,
            status:       form.status,
            departmentId: selectedDept ? selectedDept.departmentId : null,
            skills:       skillsList,
        };

        addEmployee(payload)
            .then(() => {
                showToast({ type: "success", title: "Employee Added!", message: `${form.employeeName} has been added successfully.` });
                setTimeout(() => navigate("/employees"), 1200);
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || "Could not add employee. Please try again.";
                showToast({ type: "error", title: "Save Failed", message: msg });
                setSaving(false);
            });
    }


    return (
        <div className="form-page">

            {/* ── Header ── */}
            <div className="form-page-header">
                <button className="btn-back" onClick={() => navigate("/employees")}>←</button>
                <div>
                    <h1 className="form-page-title">Add New Employee</h1>
                    <p className="form-page-subtitle">Fill in the details to create a new employee record</p>
                </div>
            </div>

            {/* ── Form Card ── */}
            <div className="form-card">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">

                        {/* Employee Name */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="employeeName">
                                Full Name <span className="required">*</span>
                            </label>
                            <input id="employeeName" name="employeeName" type="text"
                                className={`form-input${errors.employeeName ? " error" : ""}`}
                                placeholder="e.g. John Smith"
                                value={form.employeeName} onChange={handleChange} />
                            {errors.employeeName && <span className="form-error-msg">⚠ {errors.employeeName}</span>}
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email Address <span className="required">*</span>
                            </label>
                            <input id="email" name="email" type="email"
                                className={`form-input${errors.email ? " error" : ""}`}
                                placeholder="e.g. john@smarthr.com"
                                value={form.email} onChange={handleChange} />
                            {errors.email && <span className="form-error-msg">⚠ {errors.email}</span>}
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone Number</label>
                            <input id="phone" name="phone" type="tel"
                                className="form-input"
                                placeholder="e.g. +91-9876543210"
                                value={form.phone} onChange={handleChange} />
                        </div>

                        {/* Designation */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="designation">
                                Designation <span className="required">*</span>
                            </label>
                            <input id="designation" name="designation" type="text"
                                className={`form-input${errors.designation ? " error" : ""}`}
                                placeholder="e.g. Backend Developer"
                                value={form.designation} onChange={handleChange} />
                            {errors.designation && <span className="form-error-msg">⚠ {errors.designation}</span>}
                        </div>

                        {/* Department */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="department">Department</label>
                            <select id="department" name="department" className="form-select"
                                value={form.department} onChange={handleChange}>
                                <option value="">— Select Department —</option>
                                {departments.map(d => (
                                    <option key={d.departmentId} value={d.departmentName}>
                                        {d.departmentName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="status">Status</label>
                            <select id="status" name="status" className="form-select"
                                value={form.status} onChange={handleChange}>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Joining Date */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="joiningDate">Joining Date</label>
                            <input id="joiningDate" name="joiningDate" type="date"
                                className="form-input"
                                value={form.joiningDate} onChange={handleChange} />
                        </div>

                        {/* Salary */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="salary">
                                Monthly Salary (₹) <span className="required">*</span>
                            </label>
                            <input id="salary" name="salary" type="number" min="1"
                                className={`form-input${errors.salary ? " error" : ""}`}
                                placeholder="e.g. 75000"
                                value={form.salary} onChange={handleChange} />
                            {errors.salary && <span className="form-error-msg">⚠ {errors.salary}</span>}
                        </div>

                        {/* Skills */}
                        <div className="form-group full-width">
                            <label className="form-label" htmlFor="skills">
                                Skills <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(comma-separated)</span>
                            </label>
                            <input id="skills" name="skills" type="text"
                                className="form-input"
                                placeholder="e.g. Java, Spring Boot, React, SQL"
                                value={form.skills} onChange={handleChange} />
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                                Used for Skill Gap Analysis. Separate each skill with a comma.
                            </span>
                        </div>

                    </div>

                    <hr className="form-divider" />

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate("/employees")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save" disabled={saving}>
                            {saving ? (<><span className="btn-spinner" /> Saving…</>) : (<>✓ Save Employee</>)}
                        </button>
                    </div>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
}

export default AddEmployee;