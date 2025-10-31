import prisma from '@/lib/db' 

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                ProfilePictureUrl: true,
                bio:true,
                job:true
            }
        });

        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}