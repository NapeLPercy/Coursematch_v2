const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

const StudentModel = require("../models/Student");
const SubjectModel = require("../models/Subject");
const SubjectSanitizer = require("../services/SubjectSanitizer");
const MatrixEndorsement = require("../services/MatrixEndorsement");

//Add subjects (async/await version)
exports.addSubjects = async (req, res) => {
  try {
    const { subjects, userId } = req.body;
    const studentId = uuidv4();

    if (!subjects || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    console.log("These are student subjects",subjects);

    const sanitizedSubjects = new SubjectSanitizer(subjects).sanitize();

    let endorsement = new MatrixEndorsement(sanitizedSubjects).determine();

    //Insert student
    await StudentModel.createStudent(studentId, endorsement, userId);

    //Prepare subject values
    const subjectValues = subjects.map((s) => [
      uuidv4(),
      s.name,
      s.mark,
      s.endorsementSubject,
      studentId,
    ]);

    //Insert all subjects
    await SubjectModel.insertSubjects(subjectValues);

    console.log("Abut to return data");
    console.log("Abut to return data aps subjects", sanitizedSubjects);
    console.log("Abut to return data all subjects", subjects);

    return res.status(201).json({
      success: true,
      message: "Subjects added successfully",
      endorsementSubjects: sanitizedSubjects,
    });
  } catch (error) {
    console.error("Add subjects error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding subjects",
    });
  }
};

// =======================================
// Get subjects for a student (async)
// =======================================
exports.getSubjects = async (req, res) => {
  console.log("About to get the data ");
  try {
    const { studentId } = req.params;

    const subjects = await SubjectModel.getSubjectsByStudentId(studentId);

    console.log("Subjects", subjects);
    return res.status(200).json({
      subjects:subjects,
      success:true,
      message:"Subjects successfuly fecthed!",
    });


  } catch (error) {
    console.error("Get subjects error:", error);
    return res.status(500).json({
      message: "Error fetching subjects",
      success:false,
    });
  }
};
