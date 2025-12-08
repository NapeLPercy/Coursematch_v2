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

  const [apsSubjects, setApsSubjects] = useState(() => {
    const saved = sessionStorage.getItem("endorsement-subjects");
    return saved ? JSON.parse(saved) : [];
  });

  /* ------------------------------------
     SAVE TO sessionStorage WHEN CHANGED
  ------------------------------------- */

  useEffect(() => {
    sessionStorage.setItem("all-subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    sessionStorage.setItem("aps-subjects", JSON.stringify(apsSubjects));
  }, [apsSubjects]);

  /* ------------------------------------
     SUBJECT CRUD
  ------------------------------------- */

  const addSubjects = (subjects) => {
    setSubjects(subjects);
  };


  const removeSubjects = () => {
    setSubjects([]);
  };



  /* ------------------------------------
     APS SUBJECTS (Always exactly 7)
  ------------------------------------- */

  const setSelectedApsSubjects = (arr) => {
    setApsSubjects(arr); // array of 7 subjects
  };

  const resetApsSubjects = () => {
    setApsSubjects([]);
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        apsSubjects,
        addSubjects,
        removeSubjects,
        setSelectedApsSubjects,
        resetApsSubjects,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
}

export function useSubjects() {
  return useContext(SubjectContext);
}
