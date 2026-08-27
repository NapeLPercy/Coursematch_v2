const db = require("../config/db");

module.exports = {
  getUser: async (userId) => {
    const sql = `SELECT id from user WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  addUser: async (conn, userId) => {
    const sql = `INSERT INTO user (id) VALUES (?)`;

    return new Promise((resolve, reject) => {
      conn.query(sql, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  //update profile to add remaining info during onboarding(WELCOME FORM)
  updateUserProfile: async (conn, { userId, fullName, age, gender }) => {
    const sql = "UPDATE user SET full_name=?, age=?, gender=? WHERE id=?";

    return new Promise((resolve, reject) => {
      conn.query(sql, [fullName, age, gender, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};
