import React, { useEffect, useState, useMemo } from "react";
import { getMyMatches } from "../../services/studentService";
import { getOrCreateCourseComparisons } from "../../services/aiService";
import { useSubjects } from "../../context/SubjectContext";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import PageHeader from "../ui/PageHeader";
import {
  Search,
  X,
  ChevronDown,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import "../../styles/CourseComparisons.css";
import ComparisonResult from "./ComparisonResults";
import { getCachedDashboard } from "../../Utils/studentDashboardCache";

/* ── Skeleton ───────────────────────────── */
function CourseSkeleton() {
  return (
    <div className="cc__grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="cc__course-card cc__course-card--skel">
          <div className="cc__skel cc__skel--title" />
          <div className="cc__skel cc__skel--sub" />
          <div className="cc__skel cc__skel--tag" />
        </div>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────── */
export default function CourseComparisons() {
  const { getSubjects } = useSubjects();

  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [compareError, setCompareError] = useState(false);
  const [search, setSearch] = useState("");
  const [uniFilter, setUniFilter] = useState("all");

  useEffect(() => {
    fetchMatchedCourses();
  }, []);

  const fetchMatchedCourses = async () => {
    setFetchLoading(true);
    setFetchError(false);
    try {
      const { data } = await getMyMatches();
      console.log(data);
      setCourses(data.matchedData || []);
      //courses compared for first time, remove cache
      const dashboardData = getCachedDashboard();
      if (dashboardData && !dashboardData.data.flags.hasComparison) {
        sessionStorage.removeItem("student_dashboard");
      }
    } catch {
      setFetchError(true);
    } finally {
      setFetchLoading(false);
    }
  };

  const universities = useMemo(
    () => [...new Set(courses.map((c) => c.university_name))].sort(),
    [courses],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return courses.filter((c) => {
      const matchSearch =
        !q ||
        c.qualification_name?.toLowerCase().includes(q) ||
        c.university_name?.toLowerCase().includes(q) ||
        c.faculty_name?.toLowerCase().includes(q);
      const matchUni = uniFilter === "all" || c.university_name === uniFilter;
      return matchSearch && matchUni;
    });
  }, [courses, search, uniFilter]);

  const toggleCourse = (course) => {
    setComparison(null);
    setCompareError(false);
    setSelected((prev) => {
      const exists = prev.find((c) => c.course_code === course.course_code);
      if (exists)
        return prev.filter((c) => c.course_code !== course.course_code);
      if (prev.length < 2) return [...prev, course];
      return prev;
    });
  };

  const compare = async () => {
    if (selected.length !== 2) return;
    setLoading(true);
    setCompareError(false);
    setComparison(null);
    try {
      const { data } = await getOrCreateCourseComparisons({
        qualifications: selected,
        subjects: getSubjects(),
      });
      setComparison(data.comparison.comparisonData);
    } catch {
      setCompareError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cc">
      {/* Hero */}

      <PageHeader
        icon={GraduationCap}
        title="Compare courses"
        subtitle="Select 2 courses to generate a side-by-side AI comparison — match
            scores, career paths, salary outlook and more."
      />

      {/* Selected strip */}
      <div className="cc__selected-strip">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`cc__selected-slot ${selected[i] ? "cc__selected-slot--filled" : ""}`}
          >
            {selected[i] ? (
              <>
                <div className="cc__slot-info">
                  <span className="cc__slot-name">
                    {selected[i].qualification_name}
                  </span>
                  <span className="cc__slot-uni">
                    {selected[i].university_name}
                  </span>
                </div>
                <button
                  className="cc__slot-remove"
                  onClick={() => toggleCourse(selected[i])}
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <span className="cc__slot-empty">Select course {i + 1}</span>
            )}
          </div>
        ))}

        <button
          className="cc__compare-btn"
          disabled={selected.length !== 2 || loading}
          onClick={compare}
        >
          {loading ? <span className="cc__spinner" /> : null}
          {loading ? "Comparing…" : "Compare"}
          {!loading && <ArrowRight size={15} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Controls */}
      {!comparison && (
        <>
          <div className="cc__controls">
            <div className="cc__search-wrap">
              <Search size={14} className="cc__search-icon" />
              <input
                className="cc__search"
                type="text"
                placeholder="Search courses, universities, faculty…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="cc__search-clear"
                  onClick={() => setSearch("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="cc__select-wrap">
              <select
                className="cc__select"
                value={uniFilter}
                onChange={(e) => setUniFilter(e.target.value)}
              >
                <option value="all">All universities</option>
                {universities.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="cc__select-chevron" />
            </div>
          </div>

          {/* Course grid */}
          {fetchLoading && <CourseSkeleton />}
          {fetchError && (
            <ErrorState
              message="Failed to load your courses. Please try again."
              onRetry={fetchMatchedCourses}
            />
          )}

          {/* Compare error */}
          {compareError && (
            <ErrorState
              message="Comparison failed. Please try again."
              onRetry={compare}
            />
          )}

          {!fetchLoading && !fetchError && filtered.length === 0 && (
            <EmptyState message="No courses match your search." />
          )}
          {!fetchLoading && !fetchError && filtered.length > 0 && (
            <div className="cc__grid">
              {filtered.map((course, i) => {
                const isSelected = selected.find(
                  (c) => c.course_code === course.course_code,
                );
                const isDisabled = !isSelected && selected.length === 2;
                return (
                  <div
                    key={course.course_code}
                    className={`cc__course-card
                      ${isSelected ? "cc__course-card--selected" : ""}
                      ${isDisabled ? "cc__course-card--disabled" : ""}
                    `}
                    style={{ "--i": i }}
                    onClick={() => !isDisabled && toggleCourse(course)}
                  >
                    {isSelected && (
                      <span className="cc__selected-badge">
                        <CheckCircle2 size={12} strokeWidth={2.5} /> Selected
                      </span>
                    )}
                    {/* <div className="cc__course-avatar">
                      {course.abbreaviation?.slice(0, 2).toUpperCase()}
                    </div>*/}
                    <div className="cc__course-info">
                      <p className="cc__course-name">
                        {course.qualification_name}
                      </p>
                      <p className="cc__course-uni">{course.university_name}</p>
                    </div>
                    <div className="cc__course-aps">
                      <span className="cc__aps-label">APS</span>
                      <strong className="cc__aps-value">
                        {course.minimum_aps}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Result */}
      {comparison && (
        <>
          <button
            className="cc__back-btn"
            onClick={() => {
              setComparison(null);
              setSelected([]);
            }}
          >
            <X size={14} strokeWidth={2.5} /> Start over
          </button>
          <ComparisonResult comparison={comparison} />
        </>
      )}
    </div>
  );
}
