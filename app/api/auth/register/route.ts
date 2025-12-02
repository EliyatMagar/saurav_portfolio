// app/api/auth/register/route.ts - Safe version
import { query } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import cookie from "cookie";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    console.log("Registration attempt:", { name, email, passwordLength: password?.length });

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields required" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check existing user
    const existing = await query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ error: "Email already exists" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Insert user
    const result = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashed]
    );

    console.log("Registration result structure:", {
      isArray: Array.isArray(result),
      firstItemType: typeof result[0],
      firstItemIsArray: Array.isArray(result[0]),
      firstItem: result[0]
    });

    // Handle the response safely
    let user;
    const rawData = result[0];
    
    if (Array.isArray(rawData)) {
      // Handle array format: [id, name, email]
      user = {
        id: rawData[0],
        name: rawData[1],
        email: rawData[2]
      };
    } else if (rawData && typeof rawData === 'object') {
      // Handle object format: {id: ..., name: ..., email: ...}
      user = rawData;
    } else {
      throw new Error(`Unexpected data format: ${typeof rawData}`);
    }

    const token = generateToken(user.id);

    return new Response(
      JSON.stringify({ 
        message: "Registration successful",
        user 
      }), 
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
            sameSite: "strict"
          }),
        },
      }
    );
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}