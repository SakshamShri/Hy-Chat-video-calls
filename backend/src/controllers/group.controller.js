import Group from "../models/Group.js";
import User from "../models/User.js";

// Get all groups where user is a member
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const groups = await Group.find({
      members: userId,
      isActive: true
    })
    .populate('members', 'fullName profilePic')
    .populate('admin', 'fullName profilePic')
    .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getUserGroups:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const adminId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }

    // Validate members exist
    if (members && members.length > 0) {
      const validMembers = await User.find({ _id: { $in: members } });
      if (validMembers.length !== members.length) {
        return res.status(400).json({ error: "Some members not found" });
      }
    }

    // Create group with admin as first member
    const groupMembers = [adminId, ...(members || [])];
    // Remove duplicates
    const uniqueMembers = [...new Set(groupMembers.map(id => id.toString()))];

    const newGroup = new Group({
      name: name.trim(),
      description: description?.trim() || "",
      admin: adminId,
      members: uniqueMembers
    });

    await newGroup.save();
    
    // Populate the response
    const populatedGroup = await Group.findById(newGroup._id)
      .populate('members', 'fullName profilePic')
      .populate('admin', 'fullName profilePic');

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Error in createGroup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add member to group
export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only admin can add members" });
    }

    // Check if member exists
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already a member
    if (group.members.includes(memberId)) {
      return res.status(400).json({ error: "User is already a member" });
    }

    group.members.push(memberId);
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'fullName profilePic')
      .populate('admin', 'fullName profilePic');

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error in addMemberToGroup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove member from group
export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only admin can remove members" });
    }

    // Can't remove admin
    if (group.admin.toString() === memberId.toString()) {
      return res.status(400).json({ error: "Cannot remove admin from group" });
    }

    // Check if member is in group
    if (!group.members.includes(memberId)) {
      return res.status(400).json({ error: "User is not a member" });
    }

    group.members = group.members.filter(id => id.toString() !== memberId.toString());
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'fullName profilePic')
      .populate('admin', 'fullName profilePic');

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error in removeMemberFromGroup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only admin can delete group" });
    }

    // Soft delete by setting isActive to false
    group.isActive = false;
    await group.save();

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGroup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update group details
export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only admin can update group" });
    }

    if (name) group.name = name.trim();
    if (description !== undefined) group.description = description.trim();

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'fullName profilePic')
      .populate('admin', 'fullName profilePic');

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error in updateGroup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
