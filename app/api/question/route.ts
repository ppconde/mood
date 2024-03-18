import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { qa } from "@/utils/ai";
import { NextResponse } from "next/server";

/**
 * Answer a question about the user's journal entries using the AI
 * @param request
 */
export const POST = async (request) => {
    const { question } = await request.json();
    const user = await getUserByClerkId();
    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
        },
    });

    const answer = await qa(question, entries);
    return NextResponse.json({ data: answer });
}
