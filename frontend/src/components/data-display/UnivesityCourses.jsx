import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CourseContext } from "../../context/CourseContext";
import TutAPS from "../../Utils/TUT/TutAPS";

import { useSubjects } from "../../context/SubjectContext";

export default function UniversityCourses() {
  let { courseSlug } = useParams();
  courseSlug = courseSlug.toUpperCase();

  const { qualifications, updateQualifications, clearQualifications } =
    useContext(CourseContext);
  const { subjects } = useSubjects();

  const [courses, setCourses] = useState(qualifications);
  const [qualifiedCourses, setQualifiedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("full"); // 'full' or 'qualified'
  const [computingQualified, setComputingQualified] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/university/${courseSlug}`
        );

        if (response.data.success) {
          console.log("This is the reply", response.data.courses);
          setCourses(response.data.courses);
          updateQualifications(response.data.courses);
        } else {
          setError(response.data.message || "Failed to fetch courses");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [courseSlug]);

  const computeQualifiedCourses = () => {
    setComputingQualified(true);
    // 1 compute the aps for the specific university using the slug

    const apsCalc = new TutAPS(subjects);
    const studentAPS = apsCalc.computeAPS();
    console.log("THis is the aps === ",studentAPS);
    console.log("THis is the subjects === ",subjects);

    // TODO: Replace this with your actual computation logic
    // Example: Filter courses based on user's grades/prerequisites
    // This is where you'd check if user meets prerequisite requirements

    setTimeout(() => {
      // Placeholder computation - replace with actual logic
      const qualified = courses.filter((course) => {
        // Example logic: Check if user meets minimum APS requirement
        // You'll need to get user's actual APS/grades from context or props
        const userAPS = 30; // Replace with actual user data
        return course.minimum_required <= userAPS;
      });

      setQualifiedCourses(qualified);
      setComputingQualified(false);
    }, 500);
  };

  useEffect(() => {
    if (
      activeTab === "qualified" &&
      qualifiedCourses.length === 0 &&
      courses.length > 0
    ) {
      computeQualifiedCourses();
    }
  }, [activeTab, courses]);

  const renderCourseList = (courseList, emptyMessage) => {
    if (courseList.length === 0) {
      return <p>{emptyMessage}</p>;
    }

    return (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {courseList.map((course, index) => (
          <li
            key={index}
            style={{
              padding: "15px",
              margin: "10px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
              {course.qualification_name}
            </h3>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
              <strong>Code:</strong> {course.qualification_code}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
              <strong>Duration:</strong> {course.minimum_duration} years
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
              <strong>Minimum APS:</strong> {course.minimum_required}
            </p>
            {course.prereqs && course.prereqs.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <strong style={{ fontSize: "14px", color: "#333" }}>
                  Prerequisites:
                </strong>
                <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                  {course.prereqs.map((prereq, idx) => (
                    <li key={idx} style={{ fontSize: "13px", color: "#555" }}>
                      {prereq.subject}: {prereq.min_mark}% minimum
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Viewing Courses: {courseSlug}</h1>

      {/* Tab Navigation */}
      <div style={{ marginTop: "20px", borderBottom: "2px solid #ddd" }}>
        <button
          onClick={() => setActiveTab("full")}
          style={{
            padding: "10px 20px",
            marginRight: "5px",
            border: "none",
            borderBottom: activeTab === "full" ? "3px solid #007bff" : "none",
            backgroundColor: activeTab === "full" ? "#f0f8ff" : "transparent",
            cursor: "pointer",
            fontWeight: activeTab === "full" ? "bold" : "normal",
            fontSize: "16px",
          }}
        >
          Full Courses
        </button>
        <button
          onClick={() => setActiveTab("qualified")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderBottom:
              activeTab === "qualified" ? "3px solid #007bff" : "none",
            backgroundColor:
              activeTab === "qualified" ? "#f0f8ff" : "transparent",
            cursor: "pointer",
            fontWeight: activeTab === "qualified" ? "bold" : "normal",
            fontSize: "16px",
          }}
        >
          Qualified Courses
        </button>
      </div>

      {/* Content Area */}
      <div style={{ marginTop: "20px" }}>
        {loading && <p>Loading courses...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            {activeTab === "full" &&
              renderCourseList(courses, "No courses to view yet!")}

            {activeTab === "qualified" && (
              <>
                {computingQualified ? (
                  <p>Computing qualified courses...</p>
                ) : (
                  renderCourseList(
                    qualifiedCourses,
                    "No courses match your qualifications yet. Complete your profile to see qualified courses."
                  )
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
