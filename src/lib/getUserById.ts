import prisma from "@/lib/db";
import { User } from "@prisma/client";

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
