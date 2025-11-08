import jwt from "jsonwebtoken";
import { UserMemory } from "../models/User.memory.js";

export const requireAuthMemory = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserMemory.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    // Don't include password in req.user
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
