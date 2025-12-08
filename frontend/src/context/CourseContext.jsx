import React, { createContext, useState, useEffect } from "react";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [qualifications, setQualifications] = useState(() => {
    const stored = sessionStorage.getItem("courses");
    return stored ? JSON.parse(stored) : [];
  });

  // Persist the whole list whenever it changes
  useEffect(() => {
    sessionStorage.setItem("courses", JSON.stringify(qualifications));
  }, [qualifications]);

  // Replace the entire list
  const updateQualifications = (newCourses) => {
    setQualifications(newCourses);
  };

  // Clear all courses
  const clearQualifications = () => {
    setQualifications([]);
  };

  return (
    <CourseContext.Provider
      value={{ qualifications, updateQualifications, clearQualifications }}
    >
      {children}
    </CourseContext.Provider>
  );
};
