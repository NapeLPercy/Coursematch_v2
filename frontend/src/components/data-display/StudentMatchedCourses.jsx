import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  Building2,
  BookOpen,
  Bookmark,
  BookMarked,
  Microscope,
} from "lucide-react";
import { getMyMatches } from "../../services/studentService";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import "../../styles/StudentMatchedCourses.css";
import MatchedCoursesSkeleton from "../ui/MatchedCoursesSkeleton";
import PageHeader from "../ui/PageHeader";
import { useNavigate } from "react-router-dom";

export default function QualifiedCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState("all");
  const [sort, setSort] = useState("fit_desc");
  const [bookmarked, setBookmarked] = useState(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyMatchedCourses();
  }, []);

  const fetchMyMatchedCourses = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getMyMatches();
      console.log(data, "here is the data");
      setCourses(data.matchedData ?? []);
    } catch (err) {
      console.log("error occurred");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const universities = [
    ...new Set(courses.map((c) => c.university_name)),
  ].sort();

  const filtered = courses
    .filter((c) => {
      const q = search.toLowerCase().trim();
      if (q && !Object.values(c).join(" ").toLowerCase().includes(q))
        return false;
      if (university !== "all" && c.university_name !== university)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "aps_asc") return a.minimum_aps - b.minimum_aps;
      if (sort === "aps_desc") return b.minimum_aps - a.minimum_aps;
      return b.fit_score - a.fit_score;
    });

  const toggleBookmark = (id) => {
    console.log("bookmark toggled:", id);
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeepDive = (course) => {
    navigate("/student/course-deep-dive", { state: { course } });
  };

  const fitLabel = (score) => {
    if (score >= 80) return "qcp__fit--high";
    if (score >= 60) return "qcp__fit--mid";
    return "qcp__fit--low";
  };

  if (loading) {
    return <MatchedCoursesSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message="We couldn't load your matched courses. Please try again."
        onRetry={fetchMyMatchedCourses}
      />
    );
  }

  return (
    <div className="qcp">
      {/* Header */}

      <PageHeader
        icon={GraduationCap}
        title="Your AI-recommended courses"
        subtitle="These courses are recommended based on your subjects, APS score,
            matric endorsement, and personality profile."
      />

      {/* EMPTY: no courses at all */}
      {!loading && courses.length === 0 && (
        <EmptyState message="You don’t have any AI-recommended courses yet. Head to “Get Matches” to generate your personalized recommendations" />
      )}

      {/* CONTROLS ONLY IF COURSES EXIST */}
      {courses.length > 0 && (
        <>
          {/* Controls */}
          <div className="qcp__controls">
            <input
              className="qcp__search"
              type="text"
              placeholder="Search courses, universities, faculty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="qcp__selects">
              <select
                className="qcp__select"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              >
                <option value="all">All universities</option>
                {universities.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <select
                className="qcp__select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="fit_desc">Best fit first</option>
                <option value="aps_desc">APS: high → low</option>
                <option value="aps_asc">APS: low → high</option>
              </select>
            </div>
          </div>

          {/* Meta */}
          <p className="qcp__meta">
            {filtered.length} qualification{filtered.length !== 1 ? "s" : ""}{" "}
            found
          </p>

          {/* EMPTY: filters/search remove all */}
          {!loading && filtered.length === 0 && (
            <EmptyState message="No courses match your current search or filters." />
          )}
        </>
      )}

      {/* Grid */}
      <div className="qcp__grid">
        {filtered.map((course, i) => (
          <div key={course.id} className="qcp__card" style={{ "--i": i }}>
            <div className="qcp__card-head">
              <div className="qcp__avatar">{course.abbreaviation}</div>
              <div className="qcp__card-meta">
                <span className="qcp__uni-name">{course.university_name}</span>
                <span className="qcp__faculty">{course.faculty_name}</span>
              </div>
              <span className={`qcp__fit ${fitLabel(course.fit_score)}`}>
                {course.fit_score}%
              </span>
            </div>

            <div className="qcp__card-body">
              <h3 className="qcp__course-name">{course.qualification_name}</h3>

              <div className="qcp__tags">
                <span className="qcp__tag qcp__tag--aps">NQF {course.nqf}</span>
                <span className="qcp__tag qcp__tag--code">
                  {course.course_code}
                </span>
                <span className="qcp__tag qcp__tag--aps">
                  APS {course.minimum_aps}
                </span>
              </div>

              <p className="qcp__reason">{course.reason}</p>
            </div>

            <div className="qcp__actions">
              <button
                className="qcp__action-btn"
                onClick={() => handleDeepDive(course)}
              >
                <Microscope size={15} strokeWidth={2} />
                Deep dive
              </button>
              <button
                className={`qcp__action-btn ${
                  bookmarked.has(course.id) ? "qcp__action-btn--saved" : ""
                }`}
                onClick={() => toggleBookmark(course.id)}
              >
                {bookmarked.has(course.id) ? (
                  <>
                    <BookMarked size={15} strokeWidth={2} /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={15} strokeWidth={2} /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
