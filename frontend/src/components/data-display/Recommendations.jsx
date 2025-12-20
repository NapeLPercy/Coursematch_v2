import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Recommendations.css";

function Recommendations({ qualifiedCourses }) {
  const [loading, setLoading] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // default sort by highest score
  const navigate = useNavigate();

  useEffect(() => {
    // simulate 3s fetch delay
    setTimeout(() => {
      const stored = sessionStorage.getItem("ai-recommendations");
      const parsed = stored ? JSON.parse(stored) : [];
      setRecommendedCourses(parsed);
      setLoading(false);
    }, 1500);
  }, []);

  const sortedCourses = [...recommendedCourses].sort((a, b) => {
    return sortOrder === "asc" ? a.fit_score - b.fit_score : b.fit_score - a.fit_score;
  });

  const renderRecommendations = () => (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Sort by Fit Score: </label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Highest First</option>
          <option value="asc">Lowest First</option>
        </select>
      </div>
      <ul>
        {sortedCourses.map((course) => (
          <li key={course.qualification_code}>
            <strong>{course.qualification_name}</strong> ({course.qualification_code})  
            <br />
            Fit Score: {course.fit_score}  
            <br />
            Reason: {course.reason}
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) {
    return <p>displaying ai recommended courses...</p>;
  }

  if (recommendedCourses.length === 0) {
    if (qualifiedCourses.length === 0) {
      return (
        <div>
          <p>
            You need to complete your qualified courses first so we can generate
            recommendations for you.
          </p>
          <button onClick={() => navigate("/qualified-courses")}>
            Go to Qualified Courses
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <p>
            Enter your personalized profile data to get courses suitable for you.
          </p>
          <button onClick={() => navigate("/add-profile")}>Go to Profile</button>
        </div>
      );
    }
  }

  return (
    <div>
      <h3>AI Recommended Courses</h3>
      {renderRecommendations()}
    </div>
  );
}

export default Recommendations;
