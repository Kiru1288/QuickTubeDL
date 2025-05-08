import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleDownload = async () => {
    if (!url) {
      setStatus("Please enter a URL.");
      return;
    }

    setStatus("Downloading...");

    try {
      const response = await fetch("http://localhost:8000/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
const downloadUrl = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = downloadUrl;

const disposition = response.headers.get("Content-Disposition");
const match = disposition && disposition.match(/filename="(.+)"/);
a.download = match ? match[1] : "video.mp4"; 

document.body.appendChild(a);
a.click();
a.remove();


      setStatus("Download complete.");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl font-bold mb-6">YouTube MP4 Downloader</h1>

      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />

      <button
        onClick={handleDownload}
        className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center"
      >
        Download
      </button>

      <p className="mt-4 text-sm text-gray-300">{status}</p>
    </div>
  );
}

export default App;
