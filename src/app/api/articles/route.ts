import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Read query parameters
    const userIdParam = searchParams.get("id");
    const type = searchParams.get("type") || "forYou"; // 'forYou' or 'user'
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    // Set the condition based on type and userId
    const whereCondition =
      userIdParam && type === "user" ? { authorId: Number(userIdParam) } : {};

    // Fetch articles
    const articles = await prisma.article.findMany({
      where: whereCondition,
      skip: offset,
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            job: true,
            ProfilePictureUrl: true,
          },
        },
      },
    });

    // Handle empty results
    if (!articles || articles.length === 0) {
      return NextResponse.json([]);
    }

    // Return articles
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
