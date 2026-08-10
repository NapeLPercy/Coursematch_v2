const db = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();
const {
  checkAccount,
  addAccount,
  login,
  generateToken,
  validatePassword,
  getAdminAccounts,
  updateAccountRole,
  updateLastLogin,
} = require("../services/accountService");
const {
  requestPasswordReset,
  resetPassword,
} = require("../services/passwordResetService");

const { verifyEmail } = require("../services/emailVerificationService");

/* 1 Check if account exist
2 register email */
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const results = await checkAccount(email);

    if (results.length > 0) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const createAccountResults = await addAccount(email, password);

    return res.status(201).json({
      success: true,
      message: "Successfuly registered",
      link: createAccountResults?.link,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 1 Check if account exist
2 Validate password
3 Generate token */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const results = await login(email);

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const account = results[0];
    if (account?.status === "PENDING") {
      return res.status(403).json({
        success: false,
        status: "PENDING",
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await validatePassword(password, account.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(account);

    await updateLastLogin(account.user_id);

    const userData = {
      userId: account.user_id,
      role: account.role,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// 1 Send reset link
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const result = await requestPasswordReset(email);

    // Always success
    return res.status(200).json({
      success: true,
      message: result.message,
      link: result?.link,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 2 Reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: "Token and new password are required",
    });
  }

  try {
    const result = await resetPassword(token, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 2 verify account
exports.verifyAccount = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  try {
    const result = await verifyEmail(token);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAdminAccounts = async (req, res) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

        const result = await getAdminAccounts();

    return res.status(200).json({
      result,
      success: true,
      message: "Accounts successfully fetched",
    });
  } catch (err) {
    console.error("Admin accounts error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//admin add user
exports.adminAddAccount = async (req, res) => {
  const { email, role } = req.body;
  const { userId } = req;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  try {
    const results = await checkAccount(email);

    if (results.length > 0) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const password = "Rosina^*20"; //will generate a random password and then send it to user

    const result = await addAccount(email, password);

    if (result.userId) {
      await updateAccountRole(undefined, { userId: result.userId, role });
    }

    return res
      .status(201)
      .json({ success: true, message: "Successfuly registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
