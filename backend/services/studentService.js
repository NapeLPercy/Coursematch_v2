const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const studentModel = require("../models/Student");
const subjectModel = require("../models/Subject");
const { addUserProfile } = require("./userService");
const { updateAccountRole, getEmail } = require("./accountService");
const { parseComparison } = require("../utils/parseComparison");

const { getDashboardAiData } = require("../models/StudentDashboard");
const { sendEmail } = require("./sendEmailService");

/* 1 Add user generic data
2 Add student specifc data
3 Patch Role in that account table */
async function addStudentProfile(userId, profileData) {
  const conn = await new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) return reject(err);
      resolve(connection);
    });
  });

  try {
    await conn.promise().beginTransaction();

    const user = await addUserProfile(conn, profileData);

    const studentId = uuidv4();

    const studentData = extractStudentSpecifData(profileData);
    studentData.id = studentId;

    await studentModel.createProfile(conn, {
      userId,
      ...studentData,
    });

    await updateAccountRole(conn, {
      userId: userId,
      role: studentData.role,
    });

    await conn.promise().commit();
    //send welcome email
    const { email } = await getEmail(userId);

    await sendEmail({
      to: email,
      subject: "Welcome to CourseMatch!",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
      
      <h1 style="color: #1e3a8a; margin-bottom: 8px;">
        Welcome to CourseMatch! 🎓
      </h1>

      <p>
        We're here to help you make a more confident decision about your FUTURE.
        Start by adding your subjects and completing your profile, then discover
        courses that actually fit you.
      </p>

      <div style="margin: 28px 0; padding: 20px; border-left: 4px solid #1e3a8a; background: #f5f7ff;">
        <h2 style="color: #1e3a8a; margin-top: 0;">
          🤖 AI Course Recommendations
        </h2>
        <p style="margin-bottom: 0;">
          CourseMatch looks at your <strong>subjects, marks and personality to find courses
          that suit you.</strong>. Instead of searching through hundreds of qualifications,
          see which courses are a strong match for you.
        </p>
      </div>

      <div style="margin: 28px 0; padding: 20px; border-left: 4px solid #1e3a8a; background: #f5f7ff;">
        <h2 style="color: #1e3a8a; margin-top: 0;">
          🔎 Course Deep Dive
        </h2>
        <p style="margin-bottom: 0;">
          Found a course you're interested in? Explore it in more detail and
          understand what you'll study, where it can lead, and why it may be a
          good fit for you.
        </p>
      </div>

      <div style="margin: 28px 0; padding: 20px; border-left: 4px solid #1e3a8a; background: #f5f7ff;">
        <h2 style="color: #1e3a8a; margin-top: 0;"> 
         ⚖️ Compare Courses Side by Side 
        </h2> 
        <p style="margin-bottom: 0;">
         Compare two courses and see how they differ in areas like
         <strong>career opportunities, subjects, requirements and 
         your personal fit</strong>. CourseMatch helps you understand
         the differences so you can make a more informed choice. </p>
      </div>

      <p>
        <strong>Your next step:</strong> add your subjects and complete your
        profile to unlock your personalised course matches.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a
          href="https://www.coursematchapp.co.za/login"
          style="display: inline-block; background: #1e3a8a; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 6px; font-weight: bold;"
        >
          Get Started →
        </a>
      </div>

      <p style="font-size: 13px; color: #6b7280;">
        Welcome to CourseMatch — let's find where your subjects and strengths
        can take you.
      </p>

    </div>
  `,
    });

    return { userId: userId, studentId };
  } catch (error) {
    await conn.promise().rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// factory function to return student data
function extractStudentSpecifData({ grade, age, role }) {
  return { grade, age, role };
}

//insert complete student data
async function addStudentCompleteProfile(userId, profile) {
  const results = await studentModel.personalityProfileExist(userId);
  if (results.dreamJob) return { personalityProfileExist: true };
  await studentModel.updateStudentProfile(userId, profile);
}

//get complete student profile
async function getStudentProfile(userId) {
  return await studentModel.getStudentProfileByUserId(userId);
}

//get basic student profile
async function getStudentBasicProfile(userId) {
  return await studentModel.getStudentBasicProfileByUserId(userId);
}

async function getStudentCompleteProfile(userId) {
  return await studentModel.getStudentProfileByUserId(userId);
}

//patch endorsement after subjects insertion
async function insertStudentEndorsement(endorsement, userId) {
  await studentModel.insertStudentEndorsement(endorsement, userId);
}

async function getStudentId(userId) {
  return await studentModel.getStudentId(userId);
}

//user tries to view courses they were matched to
async function getMatchedCourses(userId) {
  return await studentModel.getMyMatchedCourses(userId);
}

//student dashboard

async function computeStudentDashboard(userId, studentId) {
  const subjects = await subjectModel.getSubjectsByStudentIdForUser(studentId);
  const basicProfile = await getStudentBasicProfile(userId);
  const activity = await getDashboardAiData(userId);

  const recommendation = activity.recommendation || null;
  const deepDive = activity.deepDive || null;
  const comparison = parseComparison(activity.comparison);

  return {
    subjects,
    profile: basicProfile,
    activity: {
      recommendation,
      deepDive,
      comparison,
    },
    flags: {
      hasSubjects: !!subjects?.length,
      hasProfile: !!basicProfile?.dreamJob,
      hasRecommendation: !!recommendation,
      hasDeepDive: !!deepDive,
      hasComparison: !!comparison,
    },
  };
}

module.exports = {
  addStudentProfile,
  addStudentCompleteProfile,
  getStudentProfile,
  insertStudentEndorsement,
  getStudentBasicProfile,
  getStudentCompleteProfile,
  getStudentId,
  getMatchedCourses,
  computeStudentDashboard,
};
