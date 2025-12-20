import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const advancedMatching = async (req, res) => {
  try {
    const profile = req.body.profile;
    const courses = req.body.courses;

    // Validate input
    if (!profile || !courses || !Array.isArray(courses)) {
      return res.status(400).json({ 
        error: "Invalid input: profile and courses array required" 
      });
    }

    // Call n8n webhook
    const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, {
      profile,
      qualifiedCourses: courses,
    });

    // Safely extract courses with fallback
    const recommendedCourses = 
      n8nResponse?.data?.output?.[0]?.content?.[0]?.text?.courses || [];

    // Validate response
    if (!Array.isArray(recommendedCourses)) {
      return res.status(500).json({ 
        error: "Invalid response format from matching service" 
      });
    }

    // Send clean response
    res.json({
      success: true,
      courses: recommendedCourses
    });

  } catch (error) {
    console.error("Advanced matching error:", error);
    
    res.status(500).json({ 
      success: false,
      error: "Failed to process course recommendations",
      message: error.message 
    });
  }
};
