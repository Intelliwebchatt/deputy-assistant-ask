const axios = require('axios');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' } });
    }
    const { user_message } = JSON.parse(event.body);
    if (!user_message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'User message is required' } });
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Use GOOGLE_API_KEY environment variable
    if (!GOOGLE_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing Google API key' } });
    }

    const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`; // Gemini Pro endpoint

    const response = await axios.post(
      API_ENDPOINT,
      {
        contents: [
          {
            parts: [{ text: user_message }] // Gemini request format for text input
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text; // Extract text from Gemini response

    if (generatedText) {
      return { statusCode: 200, body: JSON.stringify({ answer: generatedText }) };
    } else {
      return { statusCode: 200, body: JSON.stringify({ answer: "No response from Gemini Pro." }) };
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error communicating with Gemini API', details: error.message })
    };
  }
};
