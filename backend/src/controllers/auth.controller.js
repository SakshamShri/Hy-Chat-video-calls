import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(password.length < 4) {
        return res.status(400).json({ message: "Password must be at least 4 characters long" });
    }
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)){
        return res.status(400).json({ message: "Invalid email format" });
    }
    if(await User.findOne({email})){
        return res.status(400).json({ message: "Email already in use" });
    }
    const idx = Math.floor(Math.random() * 100)+ 1;
    const randoAvatar = `https://avatar.iran.liara.run/public/100/${idx}.png`;


    const newUser = await User.create({ fullName, email, password, profilePic: randoAvatar });

    try{
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created/updated for ${newUser.fullName}`);
    } catch (error) {
        console.error("Error creating/updating Stream user:", error)
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await user.matchPassword(password);
    if(!isPasswordCorrect){
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ message: "Login successful", user });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res, next){
  try{
    const userId = req.user._id;

    const { bio, fullName, nativeLang, learningLang, location } = req.body;

    if(!fullName || !bio || !nativeLang || !learningLang || !location){
        return res.status(400).json({ message: "All fields are required",
          missingFields: [
            !fullName && "fullName",
            !bio && "bio",
            !nativeLang && "nativeLang",
            !learningLang && "learningLang",
            !location && "location",
          ].filter(Boolean)
        })
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, {
        ...req.body, isOnboarded: true
    }, { new: true });

    if(!updatedUser){
        return res.status(404).json({ message: "User not found" });
    }

    //todo: update stream user profile
    try{
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated for ${updatedUser.fullName}`);
    } catch (streamError) {
        console.error("Error updating Stream user:", streamError.message)
    }

    res.status(200).json({ message: "Onboarding successful", updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    if(error.name === "ValidationError"){
        const missingFields = Object.keys(error.errors);
        return res.status(400).json({ message: "Validation error",
          missingFields: missingFields
        });
    }

  }
}
