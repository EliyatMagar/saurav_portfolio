import { query } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import cookie from "cookie";

export async function GET() {
  return new Response("Login API is live", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
    }

    const users = await query<{ id: number; name: string; email: string; password: string }>(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const user = users[0];
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const token = generateToken(user.id);

    return new Response(JSON.stringify({ user: { id: user.id, name: user.name, email: user.email } }), {
      status: 200,
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
    console.error("LOGIN ERROR:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
