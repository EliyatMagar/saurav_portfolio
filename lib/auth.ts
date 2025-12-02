// lib/auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Change from bcrypt to bcryptjs

const SECRET = process.env.JWT_SECRET || "secret123";

// Hash password
export const hashPassword = async (password: string) => {
  if (!password) throw new Error("Password is required");
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password with safety checks
export const comparePassword = async (password: string, hash: string) => {
  if (!password || !hash) {
    throw new Error("Password and hash arguments required");
  }
  return bcrypt.compare(password, hash);
};

// Generate JWT - use string for userId
export const generateToken = (userId: string | number) => {
  return jwt.sign({ userId: String(userId) }, SECRET, { expiresIn: "7d" });
};

// Verify JWT
export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as { userId: string };
};

// Get userId from request cookies (for App Router)
export const getUserIdFromReq = async (req: Request) => {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  const token = cookies.token;
  if (!token) return null;
  
  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
};