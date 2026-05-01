import jwt from "jsonwebtoken";

export const ownerRoute = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Un-Authorized, No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.OWNER_SECRET);

      if (decoded.role !== "owner") {
        return res.status(403).json({ success: false, message: "Access denied, Not an owner" });
      }

      req.owner = decoded;
      next();

    } catch (error) {
      return res.status(401).json({ success: false, message: "Un-Authorized, Invalid token" });
    }

  } catch (error) {
    console.error("Owner middleware error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};