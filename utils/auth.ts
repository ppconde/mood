import { auth } from "@clerk/nextjs";
import { prisma } from "./db";

export const getUserByClerkId = async () => {
    const { userId } = await auth();
    console.log('userId: ', userId);
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            clerkId: userId as string,
        },
    });

    return user;
};