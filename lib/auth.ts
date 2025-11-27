// lib/auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextApiRequest } from "next";

const SECRET = process.env.JWT_SECRET || "secret123";

// Hash password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

// Generate JWT
export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
};

// Verify JWT
export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as { userId: number };
};

// Get userId from request cookies
export const getUserIdFromReq = (req: NextApiRequest) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));
  const token = cookies.token;
  if (!token) return null;
  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
};
