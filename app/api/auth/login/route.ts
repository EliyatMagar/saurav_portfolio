// app/api/auth/login/route.ts
import { query } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  return new Response("Login API is live", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const users = await query<{ id: number; name: string; email: string; password: string }>(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }), 
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = users[0];
    
    // Debug logging
    console.log("Login attempt:", { email, userId: user.id, hasPassword: !!user.password });
    
    if (!user.password) {
      return new Response(
        JSON.stringify({ error: "User account setup incomplete" }), 
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Compare password with try-catch
    let isValid = false;
    try {
      isValid = await comparePassword(password, user.password);
    } catch (error: any) {
      console.error("Password comparison error:", error.message);
      return new Response(
        JSON.stringify({ error: "Authentication error" }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }), 
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = generateToken(user.id);

    // Create response
    const response = new Response(
      JSON.stringify({ 
        message: "Login successful", 
        user: { id: user.id, name: user.name, email: user.email } 
      }), 
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );

    // Set cookie - Using Next.js 13+ way
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; ${
        process.env.NODE_ENV === "production" ? "Secure; SameSite=Strict" : ""
      }`
    );

    return response;

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}