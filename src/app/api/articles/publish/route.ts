export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import prisma from "@/lib/db";

export async function PUT(req: Request) {
  try {
    if (!req.body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }

    const body = await req.json();
    const { id, summary, tags, image, fileName } = body;

    if (!id || !summary || !tags || !image || !fileName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const articleId = Number(id);
    if (isNaN(articleId)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
    }

    const formattedTags = Array.isArray(tags) ? tags : tags.split(",");

    const existingArticle = await prisma.article.findUnique({ where: { id: articleId } });
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const dirPath = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(dirPath, fileName);

    if (!fs.existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }

    await writeFile(filePath, buffer);

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        summary,
        tags: { set: formattedTags },
        thumbnail: `/uploads/${fileName}`,
      },
    });

    return NextResponse.json({ message: "Article published successfully", updatedArticle });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update article", details: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}
