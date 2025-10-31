import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // تأكد أن لديك ملف authOptions

export async function getUserIdFromSession() {
    const session = await getServerSession(authOptions);
    return session?.user?.id || null;
}