import React, { useEffect, useState, useContext, useMemo } from "react";
import "../../styles/Recommendations.css";
import { useSubjects } from "../../context/SubjectContext";
import { CourseContext } from "../../context/CourseContext";
import { generateRecommendationsPdf } from "../../Utils/recommendationsPDF";
import renderRecommendationCard from "../ui/RecommendationCard";
import ErrorState from "../ui/ErrorState";
import CourseFilter from "../../Utils/courseFilters/CourseFilter";
import UniversityCoursesSkeleton from "../ui/UniversityCoursesSkeleton";
import EmptyState from "../ui/EmptyState";
import { getOrCreateAIRecommedations } from "../../services/aiService";
import { getCachedDashboard } from "../../Utils/studentDashboardCache";

function Recommendations({ uniSlug, setAps, setUnlockedCount }) {
  const [loading, setLoading] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null);
  const [noProfile, setNoProfile] = useState(false);

  const { qualifications } = useContext(CourseContext);
  const { getSubjects } = useSubjects();
  const subjects = getSubjects();

  const qualifiedCourses = useMemo(() => {
    if (qualifications.length === 0 || subjects.length === 0) return [];

    const endorsement = JSON.parse(sessionStorage.getItem("endorsement"));

    const courseFilter = new CourseFilter(
      subjects,
      qualifications,
      endorsement,
      uniSlug,
    );

    const results = courseFilter.getQualifiedCourses();

    // Update parent
    const rawAps = sessionStorage.getItem("aps");
    const parsedAps = rawAps && rawAps !== "null" ? Number(rawAps) : null;

    setAps(parsedAps);
    setUnlockedCount(results.length);
    return results;
  }, [qualifications, subjects, uniSlug]);

  // Persist qualified courses
  useEffect(() => {
    sessionStorage.setItem(
      "qualified-courses",
      JSON.stringify(qualifiedCourses),
    );
  }, [qualifiedCourses]);

  // fetch ai recomendations
  useEffect(() => {
    fetchAiRecommendations();
  }, [subjects, qualifiedCourses]);

  const fetchAiRecommendations = async () => {
    setLoading(true);
    setError(null);
    setNoProfile(false);

    try {
      const { data } = await getOrCreateAIRecommedations(
        subjects,
        qualifiedCourses,
        uniSlug,
      );

      if (!data.success) {
        setError(data.message || "Failed to get AI recommendations");
        return;
      }

      const results = data.results || [];
      setRecommendedCourses(results);
      //recomendations fetched for first time, remove cache
      const dashboardData = getCachedDashboard();
      if (dashboardData && !dashboardData.data.flags.hasRecommendation) {
        sessionStorage.removeItem("student_dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message;

      // Detect missing profile
      if (
        err.response?.status === 400 &&
        message === "Please complete your student profile first."
      ) {
        setNoProfile(true);
        return;
      }

      setError(message || "Failed to get AI recommendations");
    } finally {
      setLoading(false);
    }
  };

  const sortedCourses = useMemo(() => {
    return [...recommendedCourses].sort((a, b) =>
      sortOrder === "asc" ? a.fitScore - b.fitScore : b.fitScore - a.fitScore,
    );
  }, [recommendedCourses, sortOrder]);

  const handleDownloadPdf = () => {
    generateRecommendationsPdf(recommendedCourses, {
      subtitle: "Filtered qualified courses + AI fit scoring",
      filename: "AI-course-recommendations.pdf",
    });
  };

  const renderControls = () => (
    <div className="rec-controls">
      <select
        className="rec-controls__select"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="desc">Highest First</option>
        <option value="asc">Lowest First</option>
      </select>

      <button className="download-pdf-btn" onClick={handleDownloadPdf}>
        Download PDF
      </button>
    </div>
  );

  const renderRecommendations = () => (
    <>
      {renderControls()}
      <ul className="rec-list">
        {sortedCourses.map((course) => renderRecommendationCard(course))}
      </ul>
    </>
  );

  const renderEmpty = () => {
    if (error) {
      return <ErrorState message={error} onRetry={fetchAiRecommendations} />;
    }

    if (subjects.length === 0) {
      return (
        <EmptyState message="You haven’t added your subjects yet, so we can’t generate AI recommendations. Add your subjects to get personalized course suggestions." />
      );
    }

    if (noProfile) {
      return (
        <EmptyState message="You haven’t added your personality profile yet, so we can’t generate personalized AI recommendations. Add profile to get personalized course suggestions." />
      );
    }

    if (!qualifiedCourses.length) {
      return (
        <EmptyState message="You need to qualify for at least one course before we can generate AI recommendations. Try updating your results or exploring other institutions." />
      );
    }

    return (
      <EmptyState message="We couldn’t generate recommendations right now. Please try again." />
    );
  };

  if (loading) return <UniversityCoursesSkeleton />;

  if (recommendedCourses.length === 0) {
    return renderEmpty();
  }

  return <div>{renderRecommendations()}</div>;
}

export default Recommendations;
