// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    // Get token from Authorization header or cookie
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || 
                  req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = verifyToken(token); // now returns { userId }

    const users = await query<any>(
      "SELECT id, name, email FROM users WHERE id=$1",
      [decoded.userId] // use userId from your JWT
    );

    if (users.length === 0) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: users[0] }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
