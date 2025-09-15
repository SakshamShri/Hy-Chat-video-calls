import jwt from "jsonwebtoken"
import User from "../models/User.js"

export async function protectRoute(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ message: "Unauthorized NO-token provided" });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded || !decoded.id){
            return res.status(401).json({ message: "Unauthorized invalid token" });
        }
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({ message: "Unauthorized user not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default protectRoute
