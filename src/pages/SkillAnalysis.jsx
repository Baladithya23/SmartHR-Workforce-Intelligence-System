import { useState, useEffect } from "react";
import { getEmployees } from "../Services/EmployeeService";
import { analyzeSkillGap } from "../Services/SkillGapService";
import "../styles/skill.css";


function getScoreClass(pct) {
    if (pct >= 80) return "score-excellent";
    if (pct >= 60) return "score-good";
    if (pct >= 40) return "score-fair";
    return "score-low";
}

function getProgressColor(pct) {
    if (pct >= 80) return "var(--success)";
    if (pct >= 60) return "var(--primary)";
    if (pct >= 40) return "var(--warning)";
    return "var(--danger)";
}


function SkillAnalysis() {
    const [employees,   setEmployees]   = useState([]);
    const [selectedId,  setSelectedId]  = useState("");
    const [result,      setResult]      = useState(null);
    const [loading,     setLoading]     = useState(false);
    const [loadingEmps, setLoadingEmps] = useState(true);
    const [error,       setError]       = useState("");


    useEffect(() => {
        getEmployees()
            .then(res => setEmployees(res.data))
            .catch(() => setError("Could not load employees."))
            .finally(() => setLoadingEmps(false));
    }, []);


    async function handleAnalyze() {
        if (!selectedId) return;
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await analyzeSkillGap(selectedId);
            setResult(res.data);
        } catch (err) {
            setError(err?.response?.data?.message || "Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="skill-page">

            {/* ── Selector ── */}
            <div className="skill-selector-card">
                <span className="skill-selector-label">Select Employee for Analysis</span>
                <div className="skill-selector-row">
                    <select
                        className="skill-selector-select"
                        value={selectedId}
                        onChange={e => { setSelectedId(e.target.value); setResult(null); setError(""); }}
                        disabled={loadingEmps}
                    >
                        <option value="">
                            {loadingEmps ? "Loading employees…" : "— Choose an employee —"}
                        </option>
                        {employees.map(emp => (
                            <option key={emp.employeeId} value={emp.employeeId}>
                                {emp.employeeName} – {emp.designation} ({emp.departmentName || "No Dept"})
                            </option>
                        ))}
                    </select>
                    <button
                        className="skill-analyze-btn"
                        onClick={handleAnalyze}
                        disabled={!selectedId || loading}
                        id="analyze-skill-gap-btn"
                    >
                        {loading ? "Analyzing…" : "🎯 Analyze"}
                    </button>
                </div>
                {error && (
                    <p style={{ color: "var(--danger)", fontSize: "13px", marginTop: "10px" }}>⚠ {error}</p>
                )}
            </div>

            {/* ── Empty state ── */}
            {!result && !loading && (
                <div className="skill-result-card">
                    <div className="skill-empty">
                        <div className="skill-empty-icon">🎯</div>
                        <h3 style={{ marginBottom: "8px" }}>Skill Gap Analyzer</h3>
                        <p>Select an employee above and click Analyze to see their skill gap report.</p>
                    </div>
                </div>
            )}

            {/* ── Result ── */}
            {result && (
                <div className="skill-result-card">

                    {/* Header */}
                    <div className="skill-result-header">
                        <div>
                            <div className="skill-result-name">{result.employeeName}</div>
                            <div className="skill-result-designation">{result.designation}</div>
                        </div>
                        <div className={`skill-score-circle ${getScoreClass(result.matchPercentage)}`}>
                            <span className="skill-score-number">{result.matchPercentage}%</span>
                            <span className="skill-score-label">Match</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="skill-progress-section">
                        <div className="skill-progress-label">
                            <span>Skill Match Score</span>
                            <span style={{ fontWeight: 700, color: getProgressColor(result.matchPercentage) }}>
                                {result.matchingSkills.length} / {result.requiredSkills.length} required skills
                            </span>
                        </div>
                        <div className="skill-progress-track">
                            <div
                                className="skill-progress-fill"
                                style={{
                                    width: `${result.matchPercentage}%`,
                                    background: `linear-gradient(90deg, ${getProgressColor(result.matchPercentage)}, ${getProgressColor(result.matchPercentage)}aa)`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Matching / Missing */}
                    <div className="skill-body">
                        <div className="skill-column">
                            <div className="skill-column-title matching">
                                ✅ Matching Skills ({result.matchingSkills.length})
                            </div>
                            {result.matchingSkills.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No matching skills found.</p>
                            ) : (
                                <div className="skill-chip-list">
                                    {result.matchingSkills.map(s => (
                                        <span key={s} className="skill-chip match">
                                            <span className="skill-chip-icon">✓</span> {s}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="skill-column">
                            <div className="skill-column-title missing">
                                ❌ Missing Skills ({result.missingSkills.length})
                            </div>
                            {result.missingSkills.length === 0 ? (
                                <p style={{ color: "var(--success)", fontSize: "13px", fontWeight: 600 }}>
                                    🎉 All required skills present!
                                </p>
                            ) : (
                                <div className="skill-chip-list">
                                    {result.missingSkills.map(s => (
                                        <span key={s} className="skill-chip miss">
                                            <span className="skill-chip-icon">✗</span> {s}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Employee's own skills */}
                    {result.employeeSkills?.length > 0 && (
                        <div className="skill-own-section">
                            <div className="skill-own-title">
                                Employee's Current Skills ({result.employeeSkills.length})
                            </div>
                            <div className="skill-chip-list">
                                {result.employeeSkills.map(s => (
                                    <span key={s} className="skill-chip neutral">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

export default SkillAnalysis;
