import express from "express"
import {signup, login, logout, onboard} from "../controllers/auth.controller.js"
import { protectRoute} from "../middleware/auth.middleware.js"
import { generateStreamToken } from "../lib/stream.js"
const router = express.Router()

router.post("/signup",signup);

router.post("/login",login);    

router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

//user is logged in if token is valid
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ message: "User is logged in", user: req.user });
});

// Stream token endpoint for video calls
router.get("/stream-token", protectRoute, (req, res) => {
    try {
        const token = generateStreamToken(req.user._id);
        res.status(200).json({ 
            token: token,
            message: "Stream token generated successfully" 
        });
    } catch (error) {
        console.error("Error generating stream token:", error);
        res.status(500).json({ 
            error: "Failed to generate stream token",
            message: error.message 
        });
    }
});

export default router;