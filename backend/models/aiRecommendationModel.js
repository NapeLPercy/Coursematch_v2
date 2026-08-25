const db = require("../config/db");

module.exports = {
  // Insert multiple recommendations
  createRecommendations: async (conn, recommendations) => {
    const sql = `
      INSERT INTO ai_course_recommendations 
      (id, user_id, university_abbrev, course_code, fit_score, reason)
      VALUES ?
    `;

    const values = recommendations.map((r) => [
      r.id,
      r.userId,
      r.universityAbbrev,
      r.courseCode,
      r.fitScore,
      r.reason,
    ]);

    return new Promise((resolve, reject) => {
      conn.query(sql, [values], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Check if recommendations exist
  recommendationsExist: async (userId, universityAbbrev) => {
    const sql = `
      SELECT 1 
      FROM ai_course_recommendations
      WHERE user_id = ? AND university_abbrev = ?
      LIMIT 1
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [userId, universityAbbrev], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0);
      });
    });
  },
  // Fetch recommendations WITH university abbreviation
  getRecommendations: async (userId, universityAbbrev) => {
    const sql = `
      SELECT 
        r.course_code AS qualificationCode,
        q.name AS qualificationName,
        r.fit_score AS fitScore,
        r.reason
      FROM ai_course_recommendations r
      JOIN qualification q 
        ON r.course_code = q.code
      WHERE r.user_id = ? 
        AND r.university_abbrev = ?
      ORDER BY r.fit_score DESC
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [userId, universityAbbrev], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  // Fetch all ai recommendations
  getAllAiRecommendedCourses: async (userId) => {
    const sql = `
  SELECT 
    r.course_code AS qualificationCode,
    q.name AS qualificationName,
    r.fit_score AS fitScore,
    r.reason,

    u.name AS university

  FROM ai_course_recommendations r

  JOIN qualification q
    ON r.course_code = q.code

  JOIN faculty f
    ON f.faculty_id = q.faculty_id

  JOIN university u
    ON u.abbreaviation = f.University_Abbreviation

  WHERE r.user_id = ?
  ORDER BY r.fit_score DESC
`;

    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
};
