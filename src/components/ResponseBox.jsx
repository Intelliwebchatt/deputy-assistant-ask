import React from 'react';

function ResponseBox({ response, loading }) {
  return (
    <div className="w-full max-w-md mt-4 p-4 border border-gray-300 rounded bg-white">
      {loading ? (
        <p>Waiting for a response...</p>
      ) : (
        <p>{response || 'No response yet.'}</p>
      )}
    </div>
  );
}

export default ResponseBox;
