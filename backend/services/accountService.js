const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const accountModel = require("../models/Account");
const { addUser } = require("./userService");
const { createVerificationToken } = require("./emailVerificationService");
const { sendEmail } = require("./sendEmailService");

//update a user role during onboarding
async function updateAccountRole(conn, data) {
  const res = await accountModel.updateAccountRole(conn, data);
  return res;
}

async function updateLastLogin(userId) {
  await accountModel.updateLastLogin(userId);
}

//checks if email is registered
async function checkAccount(email) {
  return await accountModel.checkAccountByEmail(email);
}

/* 1 Insert into user table(to create user_id)
2 Hash password
3 Register an email*/
async function addAccount(email, password) {
  const conn = await new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) return reject(err);
      resolve(connection);
    });
  });

  try {
    await conn.promise().beginTransaction();

    const userId = await addUser(conn);

    const hashedPassword = await bcrypt.hash(password, 10);

    const accountId = uuidv4();
    await accountModel.addAccount(conn, {
      email,
      hashedPassword,
      accountId,
      ...userId,
    });
    const results = await createVerificationToken(conn, accountId);
    //send email to user
    await sendEmail({
      to: email,
      subject: "Verify your account",
      html: `
    <h1>Welcome!</h1>
    <p>Please verify your email by clicking the link below.</p>
    <a href="${results?.link}">
      Verify Email
    </a>
  `,
    });

    await conn.promise().commit();
    return { userId };
  } catch (error) {
    await conn.promise().rollback();
    throw error;
  } finally {
    conn.release();
  }
}

//Login user
async function login(email) {
  return await accountModel.login(email);
}

//Comapares submitted password vs saved db password
async function validatePassword(enteredPassword, savedPassword) {
  return await bcrypt.compare(enteredPassword, savedPassword);
}

///generate a jwt
function generateToken(account) {
  if (!account.role) account.role = "GUEST";
  return jwt.sign(
    {
      userId: account.user_id,
      role: account.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
}

//admin fetch all accounts
const getAdminAccounts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const accounts = await accountModel.getAllAccounts();

      //filter accounts used for testing
     const newAccounts = accounts.filter((acc) => {
        return ![
          "lmankoe105@gmail.com",
          "lpercy515@gmail.com",
          "lol@gmail.com",
          "rinah@gmail.com",
        ].includes(acc.email);
      });

      const enriched = await Promise.all(
        newAccounts.map(async (acc) => {
          //check profile
          const profile = await accountModel.getStudentProfileByUserId(
            acc.user_id,
          );
          const hasProfile = !!(profile && profile.dream_job);

          //check subjects
          let hasSubjects = false;
          if (profile) {
            hasSubjects = await accountModel.checkSubjectsExistByStudentId(
              profile.id,
            );
          }

          //check ai features usage
          let hasRecomendations = false;
          let hasComparisons = false;
          let hasDeepDives = false;
          if (hasProfile) {
            hasRecomendations = await accountModel.checkAiRecommendationsExist(
              acc.user_id,
            );
            hasComparisons = await accountModel.checkCourseComparisonExist(
              acc.user_id,
            );
            hasDeepDives = await accountModel.checkCourseDeepDiveExist(
              acc.user_id,
            );
          }

          return {
            ...acc,
            hasProfile: hasProfile,
            hasSubjects: hasSubjects,
            hasComparisons: hasComparisons,
            hasRecomendations: hasRecomendations,
            hasDeepDives: hasDeepDives,
          };
        }),
      );

      resolve(enriched);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  updateAccountRole,
  checkAccount,
  addAccount,
  login,
  validatePassword,
  generateToken,
  getAdminAccounts,
  updateLastLogin,
};
