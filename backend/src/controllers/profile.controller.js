import User from "../models/User.js";

export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getting profile:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { fullName, bio, nativeLang, learningLang, location, profilePic } = req.body;

    // Validate required fields
    if (!fullName?.trim()) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const updateData = {
      fullName: fullName.trim(),
      bio: bio?.trim() || "",
      nativeLang: nativeLang || "",
      learningLang: learningLang || "",
      location: location?.trim() || "",
      profilePic: profilePic || "",
      isOnboarded: true
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error in updating profile:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function uploadProfilePicture(req, res) {
  try {
    const userId = req.user.id;
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture URL is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Profile picture updated successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error in uploading profile picture:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
}
