// src/pages/ViewCourses.jsx
import React from "react";
import UniversityList from "./UniversityList";
import { useNavigate } from "react-router-dom";
import "../../styles/ViewCourses.css";

export default function ViewCourses() {
  return (
    <div className="view-courses-container">
      <h1 className="view-courses-title" >Select a University</h1>
      <p className="view-courses-text" >
        Choose a South African university below to see which courses you
        qualify for based on your subjects and marks.
      </p>

      <UniversityList />
    </div>
  );
}


