const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const { question } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key is not set in environment variables.' })
      };
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo', // Ensure the model is compatible with the endpoint
      messages: [{ role: 'user', content: question }],
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2' // Include the beta HTTP header
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: response.data.choices[0].message.content.trim() })
    };
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error communicating with OpenAI API.', details: error.message })
    };
  }
};
