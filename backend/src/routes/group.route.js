import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserGroups,
  createGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroup,
  updateGroup
} from "../controllers/group.controller.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

// Get user's groups
router.get("/", getUserGroups);

// Create new group
router.post("/", createGroup);

// Update group details
router.put("/:groupId", updateGroup);

// Delete group
router.delete("/:groupId", deleteGroup);

// Add member to group
router.post("/:groupId/members", addMemberToGroup);

// Remove member from group
router.delete("/:groupId/members", removeMemberFromGroup);

export default router;
