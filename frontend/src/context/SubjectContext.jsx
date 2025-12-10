// src/context/SubjectsContext.js
import { createContext, useContext, useState, useEffect } from "react";

const SubjectContext = createContext();

export function SubjectProvider({ children }) {
  /* ------------------------------------
     INITIAL LOAD FROM sessionStorage
  ------------------------------------- */
  const [subjects, setSubjects] = useState(() => {
    const saved = sessionStorage.getItem("all-subjects");
    return saved ? JSON.parse(saved) : [];
  });

  /* ------------------------------------
     SAVE TO sessionStorage WHEN CHANGED
  ------------------------------------- */
  useEffect(() => {
    sessionStorage.setItem("all-subjects", JSON.stringify(subjects));
  }, [subjects]);

  /* ------------------------------------
     SUBJECT CRUD
  ------------------------------------- */

  const addSubjects = (subjects) => {
    setSubjects(subjects);
  };

  const getSubjects = () => {
    return subjects;
  };

  return (
    <SubjectContext.Provider
      value={{
        addSubjects,
        getSubjects,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
}

export function useSubjects() {
  return useContext(SubjectContext);
}
