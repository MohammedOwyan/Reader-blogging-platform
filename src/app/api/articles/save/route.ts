import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { title, content, userId } = await req.json();

    console.log("the user is", userId, "::", content, "::", title);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const article = await prisma.article.create({
      data: {
        content,
        title,
        thumbnail: "",
        summary: "",
        author: {
          connect: { id: Number(userId) },
        },
      },
    });

    return NextResponse.json({
      article,
      message: "Article published successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
