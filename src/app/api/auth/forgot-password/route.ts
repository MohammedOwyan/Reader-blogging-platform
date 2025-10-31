import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "@/lib/mailer";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;

    // Ensure sendResetEmail does not fail silently
    await sendResetEmail(email, resetLink).catch((error) => {
      console.error("Email sending error:", error);
      throw new Error("Failed to send reset email");
    });

    return NextResponse.json({ message: "Reset link sent" });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
