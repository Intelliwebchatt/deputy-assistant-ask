 const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const { question } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!apiKey || !assistantId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key or Assistant ID is not set in environment variables.' })
      };
    }

    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: question,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: response.data.choices[0].text.trim() })
    };
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error communicating with OpenAI API.', details: error.message })
    };
  }
};
