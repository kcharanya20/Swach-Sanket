import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserMemory } from "../models/User.memory.js";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

const signToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

export const register = async (req, res, next) => {
  try {
    const body = authSchema.parse(req.body);
    
    const user = await UserMemory.create(body);
    const token = signToken(user.id);
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: "Email already registered" });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = authSchema.pick({ email: true, password: true }).parse(req.body);
    
    const user = await UserMemory.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = signToken(user.id);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    next(error);
  }
};

// Debug endpoint to see all users (remove in production)
export const getAllUsers = (req, res) => {
  const users = UserMemory.getAll().map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  }));
  res.json({ users });
};

// Seed users endpoint
export const seedUsers = async (req, res) => {
  try {
    await UserMemory.seed();
    res.json({ message: "Users seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
