import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";

import { useSubjects } from "../../context/SubjectContext";

export default function Dashboard({ user }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addSubjects } = useSubjects();

  // Load studentId from sessionStorage
  const studentId = (() => {
    try {
      const stored = sessionStorage.getItem("student");
      console.log("This is the student id in dashboard", stored);
      if (!stored) return null;
      const student = JSON.parse(stored);

      return student.studentId;
    } catch (e) {
      console.error("Invalid student data in sessionStorage:", e);
      return null;
    }
  })();

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/subjects/${studentId}`
      );

      console.log("These are the subjects", res.data);

      if (res.data.success) {
        // Save to local component state for UI
        setSubjects(res.data.subjects);

        addSubjects(res.data.subjects);
      }
    } catch (err) {
      console.error("Error loading subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    fetchSubjects();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  // Count endorsement subjects
  const endorsementCount = subjects.filter(
    (s) => s.Endorsement_Subject === 1
  ).length;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name || "Student"}</h2>

      {subjects.length === 0 ? (
        <div className="no-subjects">
          <p>You have not submitted any subjects yet.</p>
          <button onClick={() => navigate("/add-subject")}>Add Subjects</button>
        </div>
      ) : (
        <div className="subject-stats">
          <p>Total subjects: {subjects.length}</p>
          <p>Endorsement subjects: {endorsementCount}</p>

          <div className="subject-list">
            {subjects.map((s) => (
              <div key={s.subject_id} className="subject-item">
                <span>
                  {s.Name} (Mark: {s.Mark})
                </span>
                <button
                  onClick={() => navigate(`/subjects/edit/${s.subject_id}`)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
