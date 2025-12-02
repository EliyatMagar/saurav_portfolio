// scripts/debug-user.ts
import { query } from "@/lib/db";

async function debugUser() {
  const email = "aryalsaurav@gmail.com";
  
  console.log(`Debugging user: ${email}`);
  
  try {
    const users = await query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    console.log(`Found ${users.length} user(s):`);
    
    if (users.length > 0) {
      const user = users[0];
      console.log("User details:");
      console.log("- ID:", user.id);
      console.log("- Email:", user.email);
      console.log("- Name:", user.name);
      console.log("- Password:", user.password);
      console.log("- Password exists:", !!user.password);
      console.log("- Password type:", typeof user.password);
      console.log("- All columns:", Object.keys(user));
    } else {
      console.log("No user found with this email");
    }
    
  } catch (error) {
    console.error("Error debugging user:", error);
  }
}

debugUser();