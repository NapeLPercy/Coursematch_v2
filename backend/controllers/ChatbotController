const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");

exports.sendMessage = async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      "http://localhost:5005/webhooks/rest/webhook",
      {
        sender: "user1",
        message: userMessage,
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
