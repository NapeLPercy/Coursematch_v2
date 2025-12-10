import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import TutAPS from "../../Utils/TUT/TutAPS";
import CourseManager from "../../Utils/CourseManager";

//context
import { CourseContext } from "../../context/CourseContext";
import { useSubjects } from "../../context/SubjectContext";

export default function UniversityCourses() {
  let { courseSlug } = useParams();
  courseSlug = courseSlug.toUpperCase();

  //context
  const { qualifications, updateQualifications, clearQualifications } =
    useContext(CourseContext);

  const { getSubjects, addSubjects } = useSubjects();

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

    const apsCalc = new TutAPS(getSubjects());
    const studentAPS = apsCalc.computeAPS();

    console.log("This is tut APS", studentAPS);

    const studentEndorsement = JSON.parse(
      sessionStorage.getItem("student")
    ).endorsement;

    const courseManager = new CourseManager();
    console.log("This is the course manager", courseManager);
    //qualified by aps courses
    const qualifiedByAps = courseManager.filterCoursesByAps(
      courses,
      studentAPS
    );

    console.log("This is the courses after aps", qualifiedByAps);
    //qualified by endorsement courses
    const qualifiedByEndorsement = courseManager.filterCoursesByEndorsement(
      qualifiedByAps,
      studentEndorsement
    );

    console.log(
      "This is the courses after endorsement",
      qualifiedByEndorsement
    );
    //qualified by pre-requiste subjects(names & marks)
    const qualifiedCourse = courseManager.filterCoursesByPrerequisites(
      getSubjects(),
      qualifiedByEndorsement
    );

    console.log("This is the courses after prerequiste", qualifiedCourse);
    setTimeout(() => {
      setQualifiedCourses(qualifiedCourse);
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
              <strong>Minimum APS:</strong> {course.minimum_aps}
            </p>
            {course.prereqs && course.prereqs.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <strong style={{ fontSize: "14px", color: "#333" }}>
                  Prerequisites:
                </strong>
                <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                  {course.prereqs.map((prereq, idx) => (
                    <li key={idx} style={{ fontSize: "13px", color: "#555" }}>
                      {prereq.subject_name}: {prereq.min_mark}% minimum
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
