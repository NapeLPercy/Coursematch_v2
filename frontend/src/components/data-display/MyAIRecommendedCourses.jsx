import React, { useState, useMemo } from "react";
import { Sparkles, Search, X, ChevronDown } from "lucide-react";
import { useGetMyRecommendedCourses } from "../../hooks/useStudent";
import renderRecommendationCard from "../ui/RecommendationCard";
import PageHeader from "../ui/PageHeader";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import "../../styles/MyAiRecommendedCourses.css";
import UniversityCoursesSkeleton from "../ui/UniversityCoursesSkeleton";

export default function MyAIRecommendedCourses() {
  const {
    data: { recommendedCourses } = {},
    isPending,
    error,
    refetch,
  } = useGetMyRecommendedCourses();

  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState("all");
  const [sort, setSort] = useState("fit_desc");

  const universities = useMemo(
    () =>
      [...new Set((recommendedCourses || []).map((c) => c.university))].sort(),
    [recommendedCourses],
  );

  const filtered = useMemo(() => {
    if (!recommendedCourses) return [];
    const q = search.toLowerCase().trim();

    return [...recommendedCourses]
      .filter((c) => {
        const matchSearch =
          !q ||
          c.qualificationName?.toLowerCase().includes(q) ||
          c.university?.toLowerCase().includes(q) ||
          c.code?.toLowerCase().includes(q) ||
          c.reason?.toLowerCase().includes(q);
        const matchUni = university === "all" || c.university === university;
        return matchSearch && matchUni;
      })
      .sort((a, b) =>
        sort === "fit_desc" ? b.fitScore - a.fitScore : a.fitScore - b.fitScore,
      );
  }, [recommendedCourses, search, university, sort]);

  const uniCount = useMemo(
    () => new Set((recommendedCourses || []).map((c) => c.university)).size,
    [recommendedCourses],
  );

  return (
    <div className="mrc">
      <PageHeader
        icon={Sparkles}
        title="AI recommended courses"
        subtitle="Personalised qualifications ranked by how well they match your academic profile, interests, and career goals."
        pillOne={
          !isPending && !error && recommendedCourses?.length
            ? `${recommendedCourses.length} course${recommendedCourses.length !== 1 ? "s" : ""}`
            : null
        }
        pillTwo={
          !isPending && !error && uniCount
            ? `${uniCount} universit${uniCount !== 1 ? "ies" : "y"}`
            : null
        }
      />

      {/* Controls */}
      {!isPending && !error && recommendedCourses?.length > 0 && (
        <div className="mrc__controls">
          <div className="mrc__search-wrap">
            <Search size={14} className="mrc__search-icon" />
            <input
              className="mrc__search"
              type="text"
              placeholder="Search courses, universities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="mrc__search-clear"
                onClick={() => setSearch("")}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="mrc__select-wrap">
            <select
              className="mrc__select"
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
            <ChevronDown size={13} className="mrc__chevron" />
          </div>

          <div className="mrc__select-wrap">
            <select
              className="mrc__select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="fit_desc">Fit score: high → low</option>
              <option value="fit_asc">Fit score: low → high</option>
            </select>
            <ChevronDown size={13} className="mrc__chevron" />
          </div>
        </div>
      )}

      {/* Meta */}
      {!isPending && !error && filtered.length > 0 && (
        <p className="mrc__meta">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {search || university !== "all" ? " found" : ""}
        </p>
      )}

      {/* States */}
      {isPending && (
        <div className="mrc__list">
          {Array.from({ length: 4 }).map((_, i) => (
            <UniversityCoursesSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <ErrorState
          message="Failed to load your recommended courses. Please try again."
          onRetry={refetch}
        />
      )}

      {!isPending && !error && filtered.length === 0 && (
        <EmptyState
          message={
            search || university !== "all"
              ? "No courses match your current search or filter."
              : "No AI recommendations yet. Complete your profile and subjects to unlock personalised course recommendations."
          }
        />
      )}

      {!isPending && !error && filtered.length > 0 && (
        <ul className="rec-list">
          {filtered.map((course) => renderRecommendationCard(course))}
        </ul>
      )}
    </div>
  );
}
