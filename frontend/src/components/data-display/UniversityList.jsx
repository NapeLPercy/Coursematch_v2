// src/components/UniversityList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/UniversityList.css";
const universities = [
  {
    id: "tut",
    name: "Tshwane University of Technology",
    description: "This is just an explanation",
  },
  {
    id: "uj",
    name: "University of Johannesburg",
    description: "This is just an explanation",
  },
  {
    id: "up",
    name: "University of Pretoria",
    description: "This is just an explanation",
  },
  {
    id: "wits",
    name: "University of the Witwatersrand",
    description: "This is just an explanation",
  },
  { id: "unisa", name: "UNISA", description: "This is just an explanation" },
  {
    id: "cput",
    name: "Cape Peninsula University of Technology",
    description: "This is just an explanation",
  },
  {
    id: "cut",
    name: "Central University of Technology",
    description: "This is just an explanation",
  },
  {
    id: "dut",
    name: "Durban University of Technology",
    description: "This is just an explanation",
  },
  {
    id: "mut",
    name: "Mangosuthu University of Technology",
    description: "This is just an explanation",
  },
];

export default function UniversityList() {
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigate(path);
  };
  return (
    <div>
      {universities.map((uni) => (
        <div
          key={uni.id}
          onClick={() => handleLinkClick(`/view-courses/${uni.id}`)}
          className="university-card"
        >
          <h2 className="university-name">{uni.name}</h2>
          <p className="university-desc">{uni.description}</p>
          <p className="card-meta">Click to view courses</p>
        </div>
      ))}
    </div>
  );
}
