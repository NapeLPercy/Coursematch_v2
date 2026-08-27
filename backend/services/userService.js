const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const userModel = require("../models/User");

// Persist generic user data such as fullname, gender
async function addUserProfile(conn, profileData) {
  const userId = profileData.userId;
  const genericData = getUserGenericData(profileData);

  const result = await userModel.updateUserProfile(conn, {
    userId,
    ...genericData,
  });

  return { result };
}

//extract user generic data from data collected from each role's welcome form
function getUserGenericData({ fullName, age, gender }) {
  if (!age) age = null;
  return { fullName, age, gender };
}

// add user data
async function addUser(conn) {
  const userId = uuidv4();
  await userModel.addUser(conn, userId);
  return { userId };
}

module.exports = { addUserProfile, addUser };
