import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { userId, bio, jobTitle } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updateData: { bio?: string; jobTitle?: string } = {};

        if (bio !== undefined) updateData.bio = bio;
        if (jobTitle !== undefined) updateData.jobTitle = jobTitle;

        if (Object.keys(updateData).length > 0) {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
            });

            return NextResponse.json({ message: "Profile updated successfully", updatedUser });
        }

        return NextResponse.json({ message: "No changes made" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update profile", details: error instanceof Error ? error.message : JSON.stringify(error) },
            { status: 500 }
        );
    }
}
