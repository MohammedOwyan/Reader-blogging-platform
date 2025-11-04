export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { image, fileName } = await req.json();
    if (!image || !fileName) {
      return NextResponse.json(
        { error: "Missing image or file name" },
        { status: 400 }
      );
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const dirPath = path.join(process.cwd(), "public", "thumbnails");
    const filePath = path.join(dirPath, fileName);

    if (!fs.existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }

    await writeFile(filePath, buffer);

    return NextResponse.json({
      message: "Thumbnail uploaded successfully",
      filePath,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload", details: error },
      { status: 500 }
    );
  }
}
