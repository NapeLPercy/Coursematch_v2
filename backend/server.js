const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const subjectsRoutes = require("./routes/subjectRoutes");
const uniRoutes = require("./routes/uniRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/university", uniRoutes);
app.use("/api/chat", chatbotRoutes);

//app.use('/auth', require('./routes/auth'));
//app.use('/student', require('./routes/student'));
//app.use('/courses', require('./routes/courses'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
