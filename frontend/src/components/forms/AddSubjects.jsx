import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Send,
  X,
  AlertCircle,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import "../../styles/AddSubjects.css";
import { useSubjects } from "../../context/SubjectContext";
import { addStudentSubjects } from "../../services/subjectService";
import SubmitSuccess from "../ui/SubmitSuccess";
import ProgressBar from "../ui/ProgressBar";
import PageHeader from "../ui/PageHeader";
import { validate } from "../../Utils/subjectsValidater";
import SubjectSelect from "../ui/SubjectSelect";
import MinorCourseMatching from "../data-display/MinorCourseMatching";

export default function AddSubjects() {
  const { addSubjects, getSubjects } = useSubjects();

  const [subjects, setSubjects] = useState([{ name: "", mark: "" }]);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMinorMatches, setShowMinorMatches] = useState(false);
  const MAX = 15;
  const MIN = 7;

  const takenNames = new Set(subjects.map((s) => s.name).filter(Boolean));

  const addRow = () => {
    if (subjects.length >= MAX) return;
    setSubjects((prev) => [...prev, { name: "", mark: "" }]);
  };

  const deleteRow = (i) => {
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  };

  const change = (i, field, val) => {
    setSubjects((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: val };
      return copy;
    });
    if (errors.length) setErrors([]);
  };

  useEffect(() => {
    const subjectsData = getSubjects();
    if (subjectsData && subjectsData.length > 0) setSubjects(subjectsData);
  }, []);

  const handleSubmit = async () => {
    const errs = validate(subjects);
    if (errs.length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors([]);

    const payload = subjects.map((s) => ({ ...s, endorsementSubject: 0 }));

    try {
      const { data } = await addStudentSubjects(payload);
      if (!data.success) {
        setErrors([data.message] || ["Subjects submission failed"]);
        return;
      }
      setSubmitted(true);
      addSubjects(data.subjects);
      setTimeout(() => reset(), 3000);

      ///subjects submitted, add endorsement to session,remove current dashboard
      sessionStorage.setItem("endorsement", JSON.stringify(data?.endorsement));

      sessionStorage.removeItem("student_dashboard");
      setShowMinorMatches(true);
    } catch (err) {
      setErrors([
        err.response?.data?.message || "Submission failed. Try again.",
      ]);

      const errorOuput = err?.response;
      //user already added subjects,show minor match
      if (
        errorOuput.data.message === "You already added your Subjects" &&
        errorOuput.status === 409
      ) {
        setShowMinorMatches(true);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const reset = () => {
    setSubjects([{ name: "", mark: "" }]);
    setErrors([]);
    setSubmitted(false);
  };

  const requirements = [
    {
      label: "7–15 subjects",
      met: subjects.length >= MIN && subjects.length <= MAX,
    },
    {
      label: "Maths / Tech Maths / Maths Lit",
      met: subjects.some((s) =>
        [
          "Mathematics",
          "Technical Mathematics",
          "Mathematical Literacy",
        ].includes(s.name),
      ),
    },
    {
      label: "Life Orientation",
      met: subjects.some((s) => s.name === "Life Orientation"),
    },
    {
      label: "At least one FAL",
      met: subjects.some((s) => s.name.endsWith("FAL")),
    },
    {
      label: "At least one HL",
      met: subjects.some((s) => s.name.endsWith("HL")),
    },
  ];

  if (showMinorMatches) return <MinorCourseMatching />;
  return (
    <div className="as">
      {/* Header */}
      <PageHeader
        icon={BookOpen}
        title="Add your subjects"
        subtitle="Enter your matric subjects and marks. You need between 7 and 15
            subjects."
      />

      {/* Requirements strip */}
      <div className="as__reqs">
        {requirements.map((r) => (
          <div
            key={r.label}
            className={`as__req ${r.met ? "as__req--met" : ""}`}
          >
            <CheckCircle2
              size={13}
              strokeWidth={2.2}
              className="as__req-icon"
            />
            {r.label}
          </div>
        ))}
      </div>

      {/* Progress */}
      <ProgressBar current={subjects.length} max={MAX} />

      {/* Rows grid */}
      <div className="as__rows">
        {subjects.map((s, i) => (
          <div
            key={i}
            className="as__row"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <span className="as__row-num">{i + 1}</span>

            <SubjectSelect
              value={s.name}
              onChange={(val) => change(i, "name", val)}
              takenNames={takenNames}
            />

            <div className="as__mark-wrap">
              <input
                type="number"
                className="as__mark-input"
                placeholder="%"
                min="0"
                max="100"
                value={s.mark}
                onChange={(e) => change(i, "mark", e.target.value)}
              />
            </div>

            {subjects.length > 1 && (
              <button
                type="button"
                className="as__delete"
                onClick={() => deleteRow(i)}
                aria-label={`Remove row ${i + 1}`}
              >
                <Trash2 size={15} strokeWidth={2} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="as__errors">
          <div className="as__errors-header">
            <AlertCircle size={15} strokeWidth={2} />
            <span>Please fix the following</span>
            <button
              type="button"
              className="as__errors-dismiss"
              onClick={() => setErrors([])}
            >
              <X size={13} strokeWidth={2.2} />
            </button>
          </div>
          <ul className="as__errors-list">
            {errors.map((e, i) => (
              <li key={i} className="as__error-item">
                <X size={11} strokeWidth={2.5} className="as__error-bullet" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success */}
      {submitted && <SubmitSuccess success="Subjects submitted successfully" />}

      {/* Actions */}
      <div className="as__actions">
        {subjects.length < MAX && (
          <button type="button" className="as__add-btn" onClick={addRow}>
            <Plus size={15} strokeWidth={2.2} />
            Add Another
          </button>
        )}
        <button
          type="button"
          className="as__submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="as__spinner" />
          ) : (
            <Send size={16} strokeWidth={2.2} />
          )}
          {loading ? "Saving…" : "Submit Subjects"}
        </button>
      </div>
    </div>
  );
}
