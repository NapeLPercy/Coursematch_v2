import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getOrCreateDeepDive } from "../../services/aiService";
import { useSubjects } from "../../context/SubjectContext";
import ErrorState from "../ui/ErrorState";
import {
  ArrowLeft,
  TrendingUp,
  Building2,
  Lightbulb,
  AlertTriangle,
  Star,
  Briefcase,
  GraduationCap,
  BookOpen,
  ChevronRight,
  Info,
} from "lucide-react";
import "../../styles/DeepDive.css";
import DeepDiveSkeleton from "../ui/DeepDiveSkeleton";
import { formatTimestamp } from "../../Utils/datetime";
import { getCachedDashboard } from "../../Utils/studentDashboardCache";

export default function DeepDive() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course;
  const { getSubjects } = useSubjects();

  const [deepDive, setDeepDive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    computeDeepDive();
  }, []);

  const computeDeepDive = async () => {
    if (!course) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const { data } = await getOrCreateDeepDive(getSubjects(), course);

      setDeepDive(data.results);

      //recomendations fetched for first time, remove cache
      const dashboardData = getCachedDashboard();
      if (dashboardData && !dashboardData.data.flags.hasDeepDive) {
        sessionStorage.removeItem("student_dashboard");
      }
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DeepDiveSkeleton />;

  if (error)
    return (
      <div className="dd">
        <button className="dd__back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </button>
        <ErrorState
          message="We couldn't load the deep dive. Please try again."
          onRetry={computeDeepDive}
        />
      </div>
    );

  if (!deepDive || !course) return null;

  const {
    summary,
    description,
    challenges,
    salary,
    careerPaths = [],
    companies = [],
    alternatives = [],
    howToExcel = [],
    createdAt,
  } = deepDive;

  return (
    <div className="dd">
      {/* Back */}
      <button className="dd__back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} strokeWidth={2.5} />
        Back
      </button>

      {/* Hero — course info header */}
      <div className="dd__hero">
        <div className="dd__hero-icon">
          <GraduationCap size={26} strokeWidth={1.8} />
        </div>
        <div className="dd__hero-text">
          <h1 className="dd__hero-title">
            {course.qualification_name} at {course.university_name}
          </h1>
          <div className="dd__hero-tags">
            <span className="dd__htag dd__htag--blue">
              <BookOpen size={11} strokeWidth={2.5} />
              {course.faculty_name}
            </span>
            <span className="dd__htag dd__htag--green">
              APS {course.minimum_aps}
            </span>
            <span className="dd__htag dd__htag--purple">NQF {course.nqf}</span>
            <span className="dd__htag dd__htag--fit">
              {course.fit_score}% fit
            </span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <p className="qcp__meta" id="date__el">
        {!isNaN(Date.parse(formatTimestamp(createdAt)))
          ? "Created On: " + formatTimestamp(createdAt)
          : "Created " + formatTimestamp(createdAt)}
      </p>

      {/* Summary banner */}
      <div className="dd__summary">
        <p>{summary}</p>
      </div>

      {/* Main grid */}
      <div className="dd__grid">
        {/* Description */}
        <div className="dd__card" style={{ "--i": 0 }}>
          <div className="dd__card-icon dd__card-icon--orange">
            <Info size={18} strokeWidth={2} />
          </div>
          <h3 className="dd__card-title">Qualification Description</h3>
          <p className="dd__description">{description}</p>
        </div>

        {/* Salary */}
        <div className="dd__card dd__card--salary" style={{ "--i": 1 }}>
          <div className="dd__card-icon dd__card-icon--green">
            <TrendingUp size={18} strokeWidth={2} />
          </div>
          <h3 className="dd__card-title">Salary outlook</h3>
          <div className="dd__salary-tiers">
            <div className="dd__salary-tier">
              <span className="dd__salary-label">Entry level</span>
              <span className="dd__salary-value">{salary?.entry}</span>
            </div>
            <div className="dd__salary-bar">
              <div className="dd__salary-bar-fill dd__salary-bar-fill--entry" />
            </div>
            <div className="dd__salary-tier">
              <span className="dd__salary-label">Mid career</span>
              <span className="dd__salary-value dd__salary-value--mid">
                {salary?.mid}
              </span>
            </div>
            <div className="dd__salary-bar">
              <div className="dd__salary-bar-fill dd__salary-bar-fill--mid" />
            </div>
            <div className="dd__salary-tier">
              <span className="dd__salary-label">Senior</span>
              <span className="dd__salary-value dd__salary-value--senior">
                {salary?.senior}
              </span>
            </div>
            <div className="dd__salary-bar">
              <div className="dd__salary-bar-fill dd__salary-bar-fill--senior" />
            </div>
          </div>
        </div>

        {/* Career paths */}
        <div className="dd__card dd__card--careers" style={{ "--i": 2 }}>
          <div className="dd__card-icon dd__card-icon--blue">
            <Briefcase size={18} strokeWidth={2} />
          </div>
          <h3 className="dd__card-title">Career paths</h3>
          <div className="dd__career-list">
            {careerPaths.map((cp, i) => (
              <div key={i} className="dd__career-item">
                <div className="dd__career-dot" />
                <div>
                  <p className="dd__career-title">{cp.title}</p>
                  <p className="dd__career-desc">{cp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to excel */}
        <div className="dd__card" style={{ "--i": 3 }}>
          <div className="dd__card-icon dd__card-icon--amber">
            <Star size={18} strokeWidth={2} />
          </div>
          <h3 className="dd__card-title">How to excel</h3>
          <ul className="dd__list">
            {howToExcel.map((tip, i) => (
              <li key={i} className="dd__list-item">
                <ChevronRight
                  size={13}
                  strokeWidth={2.5}
                  className="dd__list-arrow"
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="dd__card" style={{ "--i": 4 }}>
          <div className="dd__card-icon dd__card-icon--red">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
          <h3 className="dd__card-title">Challenges to watch</h3>
          <p className="dd__challenges">{challenges}</p>
        </div>

        {/* Companies */}
        <div className="dd__card" style={{ "--i": 5 }}>
          <div className="dd__card-icon dd__card-icon--teal">
            <Building2 size={18} strokeWidth={2} />
          </div>
          <h3 className="dd__card-title">Top employers</h3>
          <div className="dd__companies">
            {companies.map((c, i) => (
              <span key={i} className="dd__company-pill">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Alternatives */}
        <div className="dd__card" style={{ "--i": 6 }}>
          <div className="dd__card-icon dd__card-icon--purple">
            <Lightbulb size={18} strokeWidth={2} />
          </div>
          <h3 className="dd__card-title">Alternative fields</h3>
          <div className="dd__alternatives">
            {alternatives.map((alt, i) => (
              <span key={i} className="dd__alt-pill">
                {alt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
