import React, { useState } from 'react';

function InputBox({ onAsk }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onAsk(question);
      setQuestion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Ask
      </button>
    </form>
  );
}

export default InputBox;
