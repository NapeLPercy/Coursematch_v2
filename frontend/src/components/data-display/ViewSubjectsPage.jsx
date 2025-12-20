// ViewSubjectsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ViewSubjects from "./ViewSubjects";

export default function ViewSubjectsPage() {
  const [studentId, setStudentId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  //Load the logged-in user from session
  useEffect(() => {
    const stored = sessionStorage.getItem("student");
    if (!stored) return;

    try {
      const student = JSON.parse(stored);
      if (student && student.studentId) {
        setStudentId(student.studentId);
      }
    } catch (e) {
      console.error("Failed to parse student from sessionStorage:", e);
    }
  }, []);

  //Fetch subjects once we have the studentId
  useEffect(() => {
    if (!studentId) return;
    fetchSubjects();
  }, [studentId]);

  const fetchSubjects = async () => {
    try {
      console.log("About to view pages");
      const res = await axios.get(
        `http://localhost:5000/api/subjects/${studentId}`
      );

      console.log("This is the data", res.data);
      setSubjects(res.data.subjects);
    } catch (err) {
      console.error("Error loading subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading student subjects...</p>;

  return <ViewSubjects subjects={subjects} />;
}
