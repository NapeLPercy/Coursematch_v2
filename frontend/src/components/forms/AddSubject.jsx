import React, { useState } from "react";
import axios from "axios";
import "../../styles/AddSubjects.css";
import { useSubjects } from "../../context/SubjectContext";

export default function AddSubjects() {
  const { addSubjects} = useSubjects();

  // Initial subjects list (can come from props or API)
const subjectsList = [
  "Accounting",
  "Afrikaans FAL",
   "Afrikaans HL",
  "Agricultural Management Practices",
  "Agricultural Sciences",
  "Agricultural Technology",
  "Business Studies",
  "Civil Technology",
  "Computer Applications Technology",
  "Consumer Studies",
  "Dance Studies",
  "Design",
  "Dramatic Arts",
  "Economics",
  "Electrical Technology",
  "Engineering Graphics & Design",
  "English FAL",
  "English HL",
  "Geography",
  "History",
  "Hospitality Studies",
  "Information Technology",
  "Life Orientation",
  "Life Sciences",
  "Mathematical Literacy",
  "Mathematics",
  "Mechanical Technology",
  "Music",
  "Ndebele HL",
  "Northern Sotho HL",
  "Physical Science",
  "Religion Studies",
  "Southern Sotho HL",
  "Swazi HL",
  "Technical Mathematics",
  "Tourism",
  "Tsonga HL",
  "Tswana HL",
  "Venda HL",
  "Visual Arts",
  "Xhosa HL",
  "iSiZulu HL"
];


  // State for the subjects and marks
  const [subjects, setSubjects] = useState([
    { name: "", mark: "" }, // start with one empty field
  ]);

  const [errorText, setErrorText] = useState(null);
  const [deleteBtn, setDeleteBtn] = useState(false);

  // Add a new empty subject field
  const addSubjectField = () => {
    if (subjects.length > 0) {
      setDeleteBtn(true);
    }

    //15 max
    if (subjects.length >= 15) {
      setErrorText("You have added the maximum number of subjects");
      return;
    }

    setSubjects([...subjects, { name: "", mark: "" }]);
  };

  // Handle change for a specific field
  const handleChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    //checks num of subjects
    if (subjects.length < 7) {
      setErrorText("You have to submit a minimum of 7 subjects");
      return;
    }

    //validate each subject mark
    subjects.forEach((subject) => {
      if (subject.mark < 0 || subject.mark > 100) {
        setErrorText("Subject must have marks between 0 and 100");
        return;
      }
    });
    console.log("Subjects to save:", subjects);

    subjects.forEach((subject) => {
      subject.endorsementSubject = 0;
    });
    console.log("Subjects before adding", subjects);

    // TODO: Send subjects to backend via axios/fetch
    const userId = JSON.parse(sessionStorage.getItem("user"))?.id;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/subjects/addSubjects",
        {
          userId,
          subjects,
        }
      );

      console.log("Server response:", response.data);
      alert("Subjects submitted successfully!");

      addSubjects(subjects); //add all subjects to sessionData
      setSubjects([{ name: "", mark: "" }]); // reset
    } catch (err) {
      console.error(
        "Subjects submission error:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.error || "Subjects submission failed");
    }
  };

  const handleDelete = (index) => {
    console.log("Deleting subject at index:", index);

    const newSubjects = subjects.filter((_, i) => i !== index);

    console.log("After deleting subject:", newSubjects);
    setSubjects(newSubjects);
  };

  return (
    <div className="container mt-4">
      <h3>Add Subjects</h3>
      <form onSubmit={handleSubmit}>
        {errorText && (
          <p
            id="add-subject-error"
            style={{
              color: "#d93025",
              backgroundColor: "#ffe6e6",
              border: "1px solid #f5c2c2",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              display: "inline-block",
              marginTop: "6px",
            }}
          >
            {errorText}
          </p>
        )}
        {subjects.map((subject, index) => (
          <div className="row mb-2 align-items-center" key={index}>
            <div className="col-md-6"  style={{marginBottom:"10"}}>
              <select
                className="form-select"
                value={subject.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                required
               
              >
                <option value="">Select Subject</option>
                {subjectsList.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Enter Mark"
                value={subject.mark}
                onChange={(e) => handleChange(index, "mark", e.target.value)}
                required
              />
            </div>
            {deleteBtn && subjects.length > 1 && (
              <div className="col-md-2 text-end">
                <i
                  className="fas fa-trash-alt text-danger"
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  title="Delete"
                  onClick={() => handleDelete(index)} // optional
                ></i>
              </div>
            )}

            <div className="col-md-2">
              {index === subjects.length - 1 && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={addSubjectField}
                >
                  Add Another
                </button>
              )}
            </div>
          </div>
        ))}

        <button type="submit" className="btn btn-success mt-3" style={{marginTop: "10"}}>
          Add Subjects
        </button>
      </form>
    </div>
  );
}
