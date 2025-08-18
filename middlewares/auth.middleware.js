// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";

export default async function authorize(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const bearerMatch = auth.match(/^Bearer\s+(.+)$/i);
    const token = bearerMatch?.[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    const payload = jwt.verify(token, JWT_SECRET); 
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
    next(err);
  }
}
