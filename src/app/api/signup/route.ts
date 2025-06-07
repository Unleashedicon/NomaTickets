import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import  { prisma }  from "@/lib/db"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, role } = body;

    // 1. Basic validation
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 2. Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role,
        password: hashedPassword, // ✅ Store hashed password
      },
    });

    return NextResponse.json({ user: newUser });
  }catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Signup error:", error.message);
  } else {
    console.error("Signup error:", error);
  }

  return NextResponse.json({ error: "Server error" }, { status: 500 });
}

}
