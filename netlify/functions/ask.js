import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Securely stored in Netlify
});

export async function handler(event) {
    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        // Create a thread
        const thread = await openai.beta.threads.create();

        // Send user message to the assistant
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userMessage,
        });

        // Start a run for the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: "vs_67ad93c884b481919ad3942b9d837d54", // Your Assistant ID
        });

        // Wait for the assistant to process the request
        let runStatus;
        do {
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            if (runStatus.status === "completed") break;
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Poll every 2 seconds
        } while (runStatus.status !== "completed");

        // Retrieve the assistant’s response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data.find((msg) => msg.role === "assistant");

        return {
            statusCode: 200,
            body: JSON.stringify({ response: lastMessage?.content[0]?.text?.value || "No response" }),
        };
    } catch (error) {
        console.error("Error in OpenAI API call:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while processing your request." }),
        };
    }
}

 
