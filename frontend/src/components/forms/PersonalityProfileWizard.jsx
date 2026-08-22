import { useState } from "react";
import {
  BrainCog,
  ChevronLeft,
  ChevronRight,
  Send,
  Check,
  GraduationCap,
} from "lucide-react";
import { personalityQuestions } from "../../Utils/textData/personalityQuestions";
import { addCompleteStudentInfo } from "../../services/studentService";
import SubmitSuccess from "../ui/SubmitSuccess";
import SubmitError from "../ui/SubmitError";
import PageHeader from "../ui/PageHeader";
import "../../styles/AddMyProfile.css";
import { STEPS } from "../../Utils/textData/personalityQuestions";
import { useSubjects } from "../../context/SubjectContext";
import ActionPrompt from "../data-display/ActionPrompt";

const TOTAL = STEPS.length;

const initialAnswers = personalityQuestions.reduce((acc, q) => {
  acc[q.name] = q.type === "single" ? "" : [];
  return acc;
}, {});

/* ── Multi-select chip grid ─────────────── */
function MultiSelect({ question, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      if (selected.length < question.maxAnswers) {
        onChange([...selected, opt]);
      }
    }
  };

  return (
    <div className="amp__chips">
      {question.options.map((opt) => {
        const isSelected = selected.includes(opt);
        const isDisabled =
          !isSelected && selected.length >= question.maxAnswers;
        return (
          <button
            key={opt}
            type="button"
            className={`amp__chip ${isSelected ? "amp__chip--active" : ""} ${isDisabled ? "amp__chip--disabled" : ""}`}
            onClick={() => toggle(opt)}
            disabled={isDisabled}
          >
            {isSelected && <Check size={12} strokeWidth={2.5} />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ── Single select card grid ────────────── */
function SingleSelect({ question, value, onChange }) {
  return (
    <div className="amp__singles">
      {question.options.map((opt) => {
        const val = typeof opt === "object" ? opt.value : opt;
        const label = typeof opt === "object" ? opt.label : opt;
        const isSelected = value === val;
        return (
          <button
            key={val}
            type="button"
            className={`amp__single ${isSelected ? "amp__single--active" : ""}`}
            onClick={() => onChange(val)}
          >
            {isSelected && (
              <span className="amp__single-check">
                <Check size={11} strokeWidth={2.5} />
              </span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Subject select list ────────────────── */
function SubjectSelect({ question, value, onChange }) {
  const { getSubjects } = useSubjects();

  // value is now a string, not an array
  const selected = Array.isArray(value) ? value : [];

  const handleChange = (e) => {
    const chosen = e.target.value;
    // keep it as array so the rest of the logic stays the same
    onChange(chosen ? [chosen] : []);
  };

  return (
    <div className="amp__subject-wrap">
      <select
        className="amp__subject-select"
        value={selected[0] || ""}
        onChange={handleChange}
        size={7}
      >
        <option value="" disabled hidden />
        {getSubjects()?.length > 0
          ? getSubjects().map((subject) => (
              <option key={subject.id} value={subject.name}>
                {subject.name + ": " + subject.mark + "%"}
              </option>
            ))
          : question.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
      </select>
      <span className="amp__subject-count">{selected.length} selected</span>
    </div>
  );
}

/* ── Paired subjects step ───────────────── */
function PairedSubjects({ questions, answers, onChange }) {
  const [enjoyed, disliked] = questions;
  return (
    <div className="amp__paired">
      <div className="amp__paired-col">
        <p className="amp__paired-label">{enjoyed.label}</p>
        <p className="amp__paired-helper">{enjoyed.helperText}</p>
        <SubjectSelect
          question={enjoyed}
          value={answers[enjoyed.name]}
          onChange={(val) => onChange(enjoyed.name, val)}
        />
      </div>
      <div className="amp__paired-col">
        <p className="amp__paired-label">{disliked.label}</p>
        <p className="amp__paired-helper">{disliked.helperText}</p>
        <SubjectSelect
          question={disliked}
          value={answers[disliked.name]}
          onChange={(val) => onChange(disliked.name, val)}
        />
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────── */
export default function PersonalityProfileWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [aiFeaturesPrompt, setAiFeaturesPrompt] = useState(false);

  const currentStep = STEPS[step];
  const isLast = step === TOTAL - 1;
  const progress = (step / TOTAL) * 100;

  const handleChange = (name, val) => {
    setAnswers((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    for (const q of currentStep.questions) {
      const val = answers[q.name];
      if (q.type === "single") {
        if (!val || val.trim() === "") {
          newErrors[q.name] = "Please select an option.";
        }
      } else {
        const arr = Array.isArray(val) ? val : [];
        if (arr.length < q.minAnswers) {
          newErrors[q.name] =
            `Select at least ${q.minAnswers} option${q.minAnswers > 1 ? "s" : ""}.`;
        }
        if (arr.length > q.maxAnswers) {
          newErrors[q.name] =
            `Select no more than ${q.maxAnswers} option${q.maxAnswers > 1 ? "s" : ""}.`;
        }
      }
    }
    // Cross-validate enjoyed vs disliked subjects
    if (currentStep.paired) {
      const enjoyed = Array.isArray(answers.enjoyedSubjects)
        ? answers.enjoyedSubjects
        : [];
      const disliked = Array.isArray(answers.dislikedSubjects)
        ? answers.dislikedSubjects
        : [];
      const overlap = enjoyed.filter((s) => disliked.includes(s));

      if (overlap.length > 0) {
        newErrors.enjoyedSubjects = `You can't like and dislike the same subject: ${overlap.join(", ")}`;
        // newErrors.dislikedSubjects = " "; // triggers red border without duplicate message
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setSubmitError("");

    const payload = Object.fromEntries(
      Object.entries(answers).map(([key, val]) => [
        key,
        Array.isArray(val) ? val.join(" and ") : val,
      ]),
    );

    try {
      await addCompleteStudentInfo(payload);
      setSuccess(true);
      sessionStorage.removeItem("student_dashboard");
      setTimeout(() => {
        setSuccess(false);
        setAnswers(initialAnswers);
        setStep(0);
      }, 3000);
    } catch (err) {
      if (err?.response?.status === 409) {
        setAiFeaturesPrompt(true);
        // setSubmitError("You already submitted your personality profile.");
        return;
      }
      setSubmitError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const q = currentStep.questions[0];

  return (
    <div className="amp">
      <PageHeader
        icon={BrainCog}
        title="My personality profile"
        subtitle="Your personal insights help our AI recommend courses that truly fit who you are."
      />
      {aiFeaturesPrompt ? (
        <ActionPrompt
          icon={GraduationCap}
          title="Profile submitted!"
          subtitle="You can now access personalized AI-driven course recommendations, compare qualifications side-by-side, and explore different careers."
          btnText="View University courses"
          navigateTo="/view-courses"
        />
      ) : (
        <>
          {/* Progress */}
          <div className="amp__progress">
            <div className="amp__progress-track">
              <div
                className="amp__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="amp__progress-label">
              {step + 1} <span className="amp__progress-sep">/</span> {TOTAL}
            </span>
          </div>

          {/* Card */}
          <div className="amp__card" key={step}>
            {!currentStep.paired && (
              <>
                <span className="amp__step-badge">
                  Question {step + 1} of {TOTAL}
                </span>
                <h2 className="amp__question">{q.label}</h2>
                {q.helperText && <p className="amp__helper">{q.helperText}</p>}

                {(q.type === "multiple" || q.type === "subjects") && (
                  <p className="amp__counter">
                    {Array.isArray(answers[q.name])
                      ? answers[q.name].length
                      : 0}{" "}
                    / {q.maxAnswers} selected
                  </p>
                )}

                {q.type === "multiple" && (
                  <MultiSelect
                    question={q}
                    value={answers[q.name]}
                    onChange={(val) => handleChange(q.name, val)}
                  />
                )}

                {q.type === "single" && (
                  <SingleSelect
                    question={q}
                    value={answers[q.name]}
                    onChange={(val) => handleChange(q.name, val)}
                  />
                )}

                {q.type === "subjects" && (
                  <SubjectSelect
                    question={q}
                    value={answers[q.name]}
                    onChange={(val) => handleChange(q.name, val)}
                  />
                )}

                {errors[q.name] && (
                  <p className="amp__error">{errors[q.name]}</p>
                )}
              </>
            )}

            {currentStep.paired && (
              <>
                <span className="amp__step-badge">
                  Question {step + 1} of {TOTAL}
                </span>
                <h2 className="amp__question">Your subject preferences</h2>
                <PairedSubjects
                  questions={currentStep.questions}
                  answers={answers}
                  onChange={handleChange}
                />
                {currentStep.questions.map((pq) =>
                  errors[pq.name] ? (
                    <p key={pq.name} className="amp__error">
                      {errors[pq.name]}
                    </p>
                  ) : null,
                )}
              </>
            )}
          </div>

          {success && (
            <SubmitSuccess success="Profile submitted successfully!" />
          )}
          {submitError && <SubmitError error={submitError} />}

          {/* Actions */}
          <div className="amp__actions">
            <button
              type="button"
              className="amp__btn amp__btn--back"
              onClick={handleBack}
              disabled={step === 0}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
              Back
            </button>

            {isLast ? (
              <button
                type="button"
                className="amp__btn amp__btn--submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="amp__spinner" />
                ) : (
                  <Send size={15} strokeWidth={2.2} />
                )}
                {loading ? "Submitting…" : "Submit Profile"}
              </button>
            ) : (
              <button
                type="button"
                className="amp__btn amp__btn--next"
                onClick={handleNext}
              >
                Next
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
