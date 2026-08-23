import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Send,
  X,
  AlertCircle,
  CheckCircle2,
  Calculator,
} from "lucide-react";
import "../../styles/AddSubjects.css";
import { useSubjects } from "../../context/SubjectContext";
import { guestGetAllQualifications } from "../../services/guestService";
import MultiCourseFilter from "../../Utils/courseFilters/multiCourseFilter";
import SubmitSuccess from "../ui/SubmitSuccess";
import ProgressBar from "../ui/ProgressBar";
import { validate } from "../../Utils/subjectsValidater";
import SubjectSelect from "../ui/SubjectSelect";
import GuestResultsSummary from "../data-display/GuestResultsSummary";
import SEO from "../ui/SEO";
import { calculateApsFaqs } from "../../Utils/textData/SeoFaqs";
import { getPageRelatedPosts } from "../../services/blogService";
import RelatedPosts from "../RelatedPosts";
import PageHeader from "../ui/PageHeader";
export default function GuestCalculateAPS() {
  const { addSubjects, getSubjects } = useSubjects();

  const [subjects, setSubjects] = useState([{ name: "", mark: "" }]);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState(null);
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

  useEffect(() => {
    fetchPageRelatedPosts();
  }, []);

  const reset = () => {
    setSubjects([{ name: "", mark: "" }]);
    setErrors([]);
    setSubmitted(false);
  };

  const guestComputeAPS = async () => {
    const errs = validate(subjects);
    if (errs.length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors([]);

    const payload = subjects.map((s) => ({ ...s, endorsementSubject: 0 }));

    try {
      const { data } = await guestGetAllQualifications(payload);
      if (!data.success) {
        setErrors(["APS computation failed, try again"]);
        return;
      }
      const filter = new MultiCourseFilter(
        subjects,
        data.qualifications,
        data.endorsement,
      );
      const results = filter.getQualifiedCourses();
      setSubmitted(true);
      setResults(results);
      addSubjects(subjects);
      setTimeout(() => reset(), 3000);
    } catch (err) {
      setErrors([
        err.response?.data?.error ||
          "Unexpected server error occured. Try again.",
      ]);
    } finally {
      setLoading(false);
      setSubmitted(false);
    }
  };

  if (results)
    return <GuestResultsSummary data={results} posts={relatedPosts} />;

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

  //RELATED POSTS
  const fetchPageRelatedPosts = async () => {
    try {
      const { data } = await getPageRelatedPosts("APS");

      if (data.success) {
        setRelatedPosts(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  return (
    <>
      <SEO
        title="APS Calculator South Africa | CourseMatch"
        description="Calculate your APS score and compare university entry requirements."
        url="https://coursematchapp.co.za/aps-calculator"
        faq={calculateApsFaqs}
      />

      <div className="as">
        {/* Hero */}
        <PageHeader
          icon={Calculator}
          title="Calculate your APS"
          subtitle="Enter your matric subjects and marks to instantly see your APS for
              different South African universities."
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
        {submitted && <SubmitSuccess success="Computing your APS…" />}

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
            onClick={guestComputeAPS}
            disabled={loading}
          >
            {loading ? (
              <span className="as__spinner" />
            ) : (
              <Send size={16} strokeWidth={2.2} />
            )}
            {loading ? "Computing…" : "Calculate APS"}
          </button>
        </div>
        <RelatedPosts
          posts={relatedPosts}
          header="Here are some of the APS related posts"
        />
      </div>
    </>
  );
}
