import React, { useState } from 'react';
import axios from 'axios';
import InputBox from './components/InputBox';
import ResponseBox from './components/ResponseBox';

function App() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (question) => {
    setLoading(true);
    try {
      const res = await axios.post('/.netlify/functions/ask', { question });
      setResponse(res.data.answer);
    } catch (error) {
      setResponse('Error: Unable to get a response from the AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Ask the AI</h1>
      <InputBox onAsk={handleAsk} />
      <ResponseBox response={response} loading={loading} />
    </div>
  );
}

export default App;
