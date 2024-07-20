import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedMode = localStorage.getItem("isDarkMode");
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
    document.body.classList.add("dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  async function generateAnswer(e) {
    e.preventDefault();
    setIsGenerating(true);
    setAnswer("Generating your answer...");

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        { contents: [{ parts: [{ text: question }] }] },
        { params: { key: "AIzaSyC5Ri3JtmwRssc4eFJg5ATVTp0Vs_Xh8ao" } }
      );

      const newAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(newAnswer);
      setHistory(prevHistory => [...prevHistory, { question, answer: newAnswer }]);
      setQuestion("");
    } catch (error) {
      console.error(error);
      setAnswer("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleHistoryClick(item) {
    setQuestion(item.question);
    setAnswer(item.answer);
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className={`w-full md:w-1/4 p-4 md:p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b md:border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">History</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 rounded cursor-pointer transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => handleHistoryClick(item)}
            >
              <p className="font-semibold">{item.question}</p>
              <p className="text-sm mt-1 truncate">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow flex flex-col p-4 md:p-6 font-sans">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-400">
            NightOwl AI
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1 md:px-4 md:py-2 rounded-full transition-colors duration-200 ${
              isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-indigo-600 text-white'
            }`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div className={`flex-grow overflow-y-auto mb-4 p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <ReactMarkdown className="prose max-w-none dark:prose-invert">
            {answer}
          </ReactMarkdown>
          {isGenerating && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-pulse flex space-x-4">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={generateAnswer} className="flex">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question here"
            className={`flex-grow p-3 text-lg border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
            }`}
          />
          <button
            type="submit"
            disabled={isGenerating}
            className={`px-6 py-3 text-lg text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isGenerating ? "..." : "Ask"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;