const dotenv = require("dotenv");
dotenv.config();
//add initial profile
const {
  addStudentProfile,
  getStudentProfile,
  getStudentBasicProfile,
  addStudentCompleteProfile,
  getMatchedCourses,
} = require("../services/studentService");
const { generateToken } = require("../services/accountService");

const { getMyAICourseRecommendations } = require("../services/studentService");
//get complete personal profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const profile = await getStudentProfile(userId);

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching profile" });
  }
};

//get  personal basic profile
exports.getBasicProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const basicProfile = await getStudentBasicProfile(userId);

    return res.status(200).json({
      success: true,
      profile: basicProfile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching profile" });
  }
};

/*Add the remaining profile(missing data), info vital for personalized matching*/
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = req.body.profileData;

    if (!profile) {
      return res
        .status(400)
        .json({ sucess: false, message: "Profile data is required" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const results = await addStudentCompleteProfile(userId, profile);

    if (results?.personalityProfileExist) {
      return res.status(409).json({
        success: true,
        message: "You already added your personality profile",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
    });
  } catch (error) {
    console.error("Save profile error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error saving profile" });
  }
};

// Student add basic profile info
exports.createBasicProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { studentData } = req.body;

    if (!studentData) {
      return res
        .status(400)
        .json({ success: false, message: "Student Profile data is required" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const result = await addStudentProfile(userId, studentData);

    const role = "STUDENT";
    const account = { role, user_id: userId };

    const token = generateToken(account);

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      user: { userId: result.userId, studentId: result.studentId, token, role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//get my matched courses

// Get all qualifications and thier faculty
exports.getMyMatchedQualifications = async (req, res) => {
  try {
    const { userId, role } = req;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const matchedQualifications = await getMatchedCourses(userId);

    return res.status(200).json({
      matchedData: matchedQualifications,
      success: true,
      message: "Matched Qualifications successfuly fetched!",
    });
  } catch (error) {
    console.error("Get qualifications error:", error);
    return res.status(500).json({
      message: "Error fetching qualifications",
      success: false,
    });
  }
};

//get my Ai course recommendations
exports.getMyAICourseRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
console.log("we are here 1");
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    console.log("we are here 2");
    const results = await getMyAICourseRecommendations(userId);

    return res.status(200).json({
      success: true,
      recommendedCourses: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching ai recommended courses",
    });
  }
};
