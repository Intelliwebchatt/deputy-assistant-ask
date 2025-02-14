const axios = require('axios');

exports.handler = async function(event, context) {
  const { question } = JSON.parse(event.body);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key is not set in environment variables.' })
    };
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: question,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: response.data.choices[0].text.trim() })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error communicating with OpenAI API.' })
    };
  }
};
