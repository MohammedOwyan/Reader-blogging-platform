export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const userId = formData.get("userId");
        const file = formData.get("profilePicture") as File;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "Invalid or missing image file" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const dirPath = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(dirPath)) {
            await mkdir(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, file.name);
        const buffer = Buffer.from(await file.arrayBuffer());

        await writeFile(filePath, buffer);
        const imageUrl = `/uploads/${file.name}`;

        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: { ProfilePictureUrl: imageUrl },
        });

        return NextResponse.json({ message: "Profile picture updated successfully", updatedUser });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update profile picture", details: error instanceof Error ? error.message : JSON.stringify(error) },
            { status: 500 }
        );
    }
}
