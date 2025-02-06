import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import "./Gemini.css"; 

const Gemini = () => {
  // const [setResponse] = useState("");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const fetchData = async () => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
      const result = await model.generateContent(input);
      const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  
      // Add user's input to chat history
      setChatHistory((prevChat) => [...prevChat, { role: "user", text: input }]);
      setInput(""); 
  
      // Initialize AI response with empty text
      let displayedText = "";
      setChatHistory((prevChat) => [...prevChat, { role: "ai", text: displayedText }]);
  
      // Simulate AI typing effect
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < text.length) {
          displayedText += text[index]; // Add one character at a time
          setChatHistory((prevChat) => {
            const updatedChat = [...prevChat];
            updatedChat[updatedChat.length - 1] = { role: "ai", text: displayedText };
            return updatedChat;
          });
          index++;
        } else {
          clearInterval(typingInterval); // Stop once done
        }
      }, 50); // Adjust delay for faster/slower typing effect
  
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatHistory((prevChat) => [...prevChat, { role: "ai", text: "Error fetching response." }]);
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
