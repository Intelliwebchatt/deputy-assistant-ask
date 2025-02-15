const axios = require('axios');

exports.handler = async (event) => {
    try {
        // Ensure only POST requests are allowed
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Method Not Allowed' })
            };
        }

        // Parse user input from the request body
        const { user_message } = JSON.parse(event.body);
        if (!user_message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'User message is required' })
            };
        }

        // Load API key and Assistant ID from environment variables
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
        if (!OPENAI_API_KEY || !ASSISTANT_ID) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing API key or Assistant ID' })
            };
        }

        // OpenAI API endpoint for Assistant v2 beta
        const API_URL = 'https://api.openai.com/v2/beta/threads';

        // Step 1: Create a thread
        const threadResponse = await axios.post(
            API_URL,
            {},
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
        );

        const threadId = threadResponse.data.id;

        // Step 2: Add user message to thread
        await axios.post(
            `${API_URL}/${threadId}/messages`,
            { role: 'user', content: user_message },
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
        );

        // Step 3: Run Assistant on the thread
        const runResponse = await axios.post(
            `${API_URL}/${threadId}/runs`,
            { assistant_id: ASSISTANT_ID },
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
        );

        // Return the response from OpenAI
        return {
            statusCode: 200,
            body: JSON.stringify(runResponse.data)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
        };
    }
};
