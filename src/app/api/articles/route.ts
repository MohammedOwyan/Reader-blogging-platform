import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Import your Prisma instance
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id; // معرف المستخدم الحالي

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") || "forYou"; // 'forYou' or 'user'
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;


    const whereCondition =
      userId && type === "user" ? { authorId: Number(userId) } : {};

    const articles = await prisma.article.findMany({
      where: whereCondition,
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json(articles || "NO USER");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
