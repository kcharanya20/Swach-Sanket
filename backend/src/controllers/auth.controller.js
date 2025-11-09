// import jwt from "jsonwebtoken";
// import { z } from "zod";
// import { User } from "../models/User.js";

// const authSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   name: z.string().optional()
// });

// const signToken = (userId) =>
//   jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// export const register = async (req, res, next) => {
//   try {
//     const body = authSchema.parse(req.body);
//     const existing = await User.findOne({ email: body.email });
//     if (existing) return res.status(409).json({ message: "Email already registered" });

//     const user = await User.create(body);
//     const token = signToken(user._id);
//     res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
//   } catch (e) {
//     next(e);
//   }
// };

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = authSchema.pick({ email: true, password: true }).parse(req.body);
//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const token = signToken(user._id);
//     res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
//   } catch (e) {
//     next(e);
//   }
// };



import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1, "Name is required"),
  role: z.enum(['zilla_panchayat', 'mrf_operator', 'mrf_driver'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const signToken = (userId, role) =>
  jwt.sign(
    { sub: userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

export const register = async (req, res, next) => {
  try {
    const body = authSchema.parse(req.body);
    
    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create(body);
    const token = signToken(user._id, user.role);
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role
      } 
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: e.errors 
      });
    }
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }
    
    const token = signToken(user._id, user.role);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role
      } 
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: e.errors 
      });
    }
    next(e);
  }
};

// Get current user info
export const getCurrentUser = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
};