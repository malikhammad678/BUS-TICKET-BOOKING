import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectedRoute = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, message: "Un-Authorized, No token provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id).select("-password")

            if (!user) {
                return res.status(401).json({ success: false, message: "Un-Authorized, User not found" });
            }

            if (user.isBlocked) {
                return res.status(403).json({ success: false, message: "Your account has been blocked" });
            }

            req.user = user
            next()

        } catch (error) {
            return res.status(401).json({ success: false, message: "Un-Authorized, Invalid token" });
        }

    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}