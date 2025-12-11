//"http://localhost:5005/webhooks/rest/webhook",

const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/ChatbotController");




router.post("/sendMessage", chatbotController.sendMessage);

module.exports = router;
