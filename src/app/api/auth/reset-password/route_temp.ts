import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    const { token, password } = await req.json();
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: Number(decoded.userId) },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }
}
