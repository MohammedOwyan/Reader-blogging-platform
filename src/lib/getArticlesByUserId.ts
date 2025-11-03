import prisma from "./db";

export async function getArticlesByUserId(userId: number) {
  try {
    const articles = await prisma.article.findMany({
      where: { authorId: userId },


      orderBy: { createdAt: "desc" },
    });
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
