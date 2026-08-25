const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const studentDashboardController = require("../controllers/studentDashboardController");
const authenticate = require("../middleware/AuthenticationMiddleware");
const authorize = require("../middleware/AuthorizationMiddleware");
const attachProfileId = require("../middleware/profileMiddleware");

router.post(
  "/profile/basic",
  authenticate,
  studentController.createBasicProfile,
);

router.get(
  "/profile/basic",
  authenticate,
  authorize("STUDENT"),
  studentController.getBasicProfile,
);

router.patch(
  "/profile",
  authenticate,
  authorize("STUDENT"),
  studentController.completeProfile,
);

router.get(
  "/profile",
  authenticate,
  authorize("STUDENT"),
  studentController.getProfile,
);

router.get(
  "/matched",
  authenticate,
  authorize("STUDENT"),
  studentController.getMyMatchedQualifications,
);

router.get(
  "/dashboard",
  authenticate,
  authorize("STUDENT"),
  attachProfileId,
  studentDashboardController.computeStudentDashboard,
);

router.get(
  "/courses/ai-recommended",
  authenticate,
  authorize("STUDENT"),
  studentController.getMyAICourseRecommendations,
);

module.exports = router;
