import { OpenAI } from '@langchain/openai';
import z from 'zod';
import { PromptTemplate } from '@langchain/core/prompts';
import { Document } from '@langchain/core/documents';
import { loadQARefineChain } from 'langchain/chains';
import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { StructuredOutputParser } from 'langchain/output_parsers';


const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        subject: z
            .string()
            .describe('The subject of the journal entry.'),
        mood: z
            .string()
            .describe('The mood of the person who wrote the journal entry.'),
        summary: z
            .string()
            .describe('A quick summary of the entire entry.'),
        negative: z
            .boolean()
            .describe('Is the journal entry negative? (i.e. does it contain negative emotions?).'),
        color: z
            .string()
            .describe('An hexadecimal color code that represents the mood of the entry. Example #101fe for blue representing happiness.'),
        sentimentScore: z
            .number()
            .describe(
                'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
            ),
    })
);

const getPrompt = async (content) => {
    const format_instructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
        template:
            'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
        inputVariables: ['entry'],
        partialVariables: { format_instructions },
    })

    return await prompt.format({
        entry: content,
    });
};

export const analyze = async (content: string) => {
    const prompt = await getPrompt(content);
    const model = new OpenAI({
        temperature: 0,
        modelName: 'gpt-3.5-turbo',
    });

    const result = await model.invoke(prompt);

    try {
        const parsed = parser.parse(result);
        return parsed;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const qa = async (question, entries) => {
    const docs = entries.map((entry) => {
        return new Document({
            pageContent: entry.content,
            metadata: {
                id: entry.id,
                createdAt: entry.createdAt,
            },
        })
    });

    const model = new OpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: 0,
    });

    const chain = loadQARefineChain(model);
    const embeddings = new OpenAIEmbeddings();
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
    const relevantDocs = await store.similaritySearch(question);
    const res = await chain.invoke({
        question,
        input_documents: relevantDocs,
    });

    return res.output_text;
}