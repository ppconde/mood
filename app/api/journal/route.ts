import { analyze } from "@/utils/ai";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Create a new journal entry and analyses it with the AI
 */
export const POST = async () => {
    const user = await getUserByClerkId();
    const entry = await prisma.journalEntry.create({
        data: {
            userId: user.id,
            content: "Write about your day!",
        },
    });

    const analysis = await analyze(entry.content);

    // Create the AI analysis
    await prisma.analysis.create({
        data: {
            userId: user.id,
            entryId: entry.id,
            ...analysis,
        },
    });

    revalidatePath("/journal");

    return NextResponse.json({ data: entry });
}