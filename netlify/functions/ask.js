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
      model: 'gpt-4o-mini', // Use the gpt-4o-mini model
      messages: [{ role: 'user', content: question }],
      max_tokens: 150 // Adjust as needed
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2' // Include the beta HTTP header
      }
    });

    if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
      return {
        statusCode: 200,
        body: JSON.stringify({ answer: response.data.choices[0].message.content })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ answer: "No response from the model." })
      };
    }
  } catch (error) {
    console.error('Error during API call:', error);
    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request:", error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred while processing your request." })
    };
  }
};
