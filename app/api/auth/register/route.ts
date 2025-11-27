import { query } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import cookie from "cookie";

export async function GET() {
  return new Response("Register API is live", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
    }

    // Check existing user
    const existing = await query<{ id: number; email: string }>(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Insert user
    const result = await query<{ id: number; name: string; email: string }>(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashed]
    );

    const user = result[0];
    const token = generateToken(user.id);

    return new Response(JSON.stringify({ user }), {
      status: 201,
      headers: {
        "Set-Cookie": cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        }),
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
