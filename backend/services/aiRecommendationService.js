const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const aiRecommendationModel = require("../models/aiRecommendationModel");
const AiFitService = require("./aiRecommendationsBuilder");

/* 1 Checks if AI recommendations already exist for this university
2 Fetch if the exist
3 Create and insert into DB if the don't exist
*/
async function getOrCreateRecommendations({
  userId,
  universityAbbrev,
  studentProfile,
  subjects,
  qualifiedCourses,
}) {
  const exists = await aiRecommendationModel.recommendationsExist(
    userId,
    universityAbbrev,
  );

  if (exists) {
    return await aiRecommendationModel.getRecommendations(
      userId,
      universityAbbrev,
    );
  }

  const aiResults = await AiFitService.scoreAndExplainFit({
    studentProfile,
    subjects,
    courses: qualifiedCourses,
  });

  if (!aiResults || aiResults.length === 0) {
    return [];
  }

  const recommendations = aiResults.map((r) => ({
    id: uuidv4(),
    userId,
    universityAbbrev,
    courseCode: r.qualificationCode,
    fitScore: r.fitScore,
    reason: r.reason,
  }));

  const conn = await new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) return reject(err);
      resolve(connection);
    });
  });

  try {
    await conn.promise().beginTransaction();

    await aiRecommendationModel.createRecommendations(conn, recommendations);

    await conn.promise().commit();
  } catch (error) {
    await conn.promise().rollback();
    throw error;
  } finally {
    conn.release();
  }

  return await aiRecommendationModel.getRecommendations(
    userId,
    universityAbbrev,
  );
}

//get all my ai recommeded courses
const getAllAiRecommendedCourses = async (userId) => {
  return await aiRecommendationModel.getAllAiRecommendedCourses(userId);
};
module.exports = { getOrCreateRecommendations, getAllAiRecommendedCourses };
