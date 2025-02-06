import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import "./Gemini.css"; 

const Gemini = () => {
  const [setResponse] = useState("");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const fetchData = async () => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(input);
      const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        
      // Update chat history
      setChatHistory([...chatHistory, { role: "user", text: input }, { role: "ai", text }]);
      setInput(""); 
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Error fetching response.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      fetchData();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
         Your AI Frined
      </header>

      <div className="chat-box">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`message ${chat.role}`}>
            <div className="message-bubble">{chat.text}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          placeholder="Ask AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Gemini;
