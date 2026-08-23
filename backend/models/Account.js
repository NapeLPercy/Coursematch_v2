const db = require("../config/db");

module.exports = {
  //Patch a user role, used during onboarding
  updateAccountRole: async (conn = db, { userId, role }) => {
    const sql = `UPDATE account SET role = ? WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
      conn.query(sql, [role, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  updateAccountStatus: async (accountId, status) => {
    const sql = `UPDATE account SET status = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [status, accountId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  updatePassword: async (accountId, newPassword) => {
    const sql = `UPDATE account SET  password = ? WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, [newPassword, accountId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  updateLastLogin: async (userId) => {
    const sql = `UPDATE user SET last_login = NOW() WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  //Checks whether or not an email is registered
  checkAccountByEmail: async (email) => {
    const sql = `SELECT id FROM account WHERE email = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, [email], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  //Login user
  login: async (email) => {
    const sql = `SELECT id,role,user_id, email,status, password FROM account WHERE email = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, [email], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Add user account, email uniqueness already confirmed
  addAccount: async (conn, { accountId, email, hashedPassword, userId }) => {
    const sql = `INSERT INTO account (id, email, password, user_id) VALUES (?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      conn.query(
        sql,
        [accountId, email, hashedPassword, userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });
  },

  //password reset

  // Insert token (data comes from service)
  createResetToken: async (data) => {
    const sql = `
      INSERT INTO password_reset_token 
      (id, account_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `;

    const values = [data.id, data.account_id, data.token_hash, data.expires_at];

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Get token by hash
  getByTokenHash: async (token_hash) => {
    const sql = `
      SELECT * 
      FROM password_reset_token 
      WHERE token_hash = ?
      LIMIT 1
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [token_hash], (err, result) => {
        if (err) return reject(err);
        resolve(result[0] || null);
      });
    });
  },

  // Delete token by hash
  deleteByTokenHash: async (token_hash) => {
    const sql = `
      DELETE FROM password_reset_token 
      WHERE token_hash = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [token_hash], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Delete tokens by account (optional, for cleanup or overwrite)
  deleteByAccountId: async (account_id) => {
    const sql = `
      DELETE FROM password_reset_token 
      WHERE account_id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [account_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  //admin views all account(3 bellow methods)
  getAllAccounts: async () => {
    const sql = `
    SELECT
    a.id,
    a.user_id,
    a.created_at,
    a.email,
    a.role,
    a.status,
    u.last_login
FROM account a
INNER JOIN user u
    ON a.user_id = u.id
WHERE a.role = 'STUDENT' OR a.role IS NULL`;

    return new Promise((resolve, reject) => {
      db.query(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  getStudentProfileByUserId: async (userId) => {
    const sql = `
    SELECT id, dream_job
    FROM student_profile
    WHERE user_id = ?
    LIMIT 1
  `;

    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0] || null);
      });
    });
  },
  checkSubjectsExistByStudentId: async (studentId) => {
    const sql = `
    SELECT 1
    FROM subject
    WHERE student_id = ?
    LIMIT 1
  `;

    return new Promise((resolve, reject) => {
      db.query(sql, [studentId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0);
      });
    });
  },

  //check if ai recommendations exists
  checkAiRecommendationsExist: async (userId) => {
    const sql = `
    SELECT 1
    FROM ai_course_recommendations
    WHERE user_id = ?
    LIMIT 1
  `;

    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0);
      });
    });
  },
  //check if course comparisons exists
  checkCourseComparisonExist: async (userId) => {
    const sql = `
    SELECT 1
    FROM ai_course_comparisons
    WHERE user_id = ?
    LIMIT 1
  `;
    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0);
      });
    });
  },

  //check if deep dive exists
  checkCourseDeepDiveExist: async (userId) => {
    const sql = `
    SELECT 1
    FROM ai_course_deep_dives
    WHERE user_id = ?
    LIMIT 1
  `;

    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0);
      });
    });
  },
};
