const axios = require('axios');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }
    const { user_message } = JSON.parse(event.body);
    if (!user_message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'User message is required' }) };
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

    if (!OPENAI_API_KEY || !ASSISTANT_ID) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing API key or Assistant ID' }) };
    }

    const API_URL = 'https://api.openai.com/v1/threads'; // Correct base URL for Assistants API

    // Create a Thread
    const threadResponse = await axios.post(
      API_URL,
      {}, // Empty body for thread creation
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json', 'OpenAI-Beta': 'assistants=v2' } } // Include beta header
    );
    const threadId = threadResponse.data.id;
    if (!threadId) {
      throw new Error("Failed to retrieve thread ID");
    }

    const MESSAGES_API_URL = `https://api.openai.com/v1/threads/${threadId}/messages`; // URL for messages in a thread

    // Create a Message in the Thread
    await axios.post(
      MESSAGES_API_URL,
      { role: 'user', content: user_message },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json', 'OpenAI-Beta': 'assistants=v2' } } // Include beta header
    );

    const RUNS_API_URL = `https://api.openai.com/v1/threads/${threadId}/runs`; // URL for runs in a thread

    // Create a Run
    const runResponse = await axios.post(
      RUNS_API_URL,
      { assistant_id: ASSISTANT_ID }, // Removed model: "gpt-4o-mini" - Assistant's model should be configured in OpenAI
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json', 'OpenAI-Beta': 'assistants=v2' } } // Include beta header
    );


    return { statusCode: 200, body: JSON.stringify(runResponse.data) };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
};
