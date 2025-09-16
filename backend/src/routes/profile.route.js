import express from "express";
import { getProfile, updateProfile, uploadProfilePicture } from "../controllers/profile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get user profile
router.get("/", protectRoute, getProfile);

// Update user profile
router.put("/", protectRoute, updateProfile);

// Upload profile picture
router.put("/picture", protectRoute, uploadProfilePicture);

export default router;
