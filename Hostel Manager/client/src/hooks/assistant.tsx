import axios from "axios";
import React, { useState } from "react";

const ChatBot: React.FC = () => {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const student = JSON.parse(localStorage.getItem('User'))?.student_details.email;
  const admin = JSON.parse(localStorage.getItem('adminCreds'))?.Email;
  
  const handleSend = async () => {
    if (!input.trim()) return;
  
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input; 
    setInput("");
    setLoading(true);
  
    try {
      const data = {
        email: student ? student : admin,
        question: userMessage,
        isAdmin: admin ? true : false,
      };
  
      const response = await axios.post(`${baseURL}/chat/assistant`, data);
  
      if (response.status === 201 || response.status === 200) {
        console.log("Chating", response.data);
  
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response.data.response },
        ]);

      } else {
        console.log("error", response);
      }
    } catch (error) {
      console.error("Chatting error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed left-4 bottom-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-2xl rounded-lg flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span className="font-semibold">Chat Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end ml-auto"
                    : "bg-gray-200 self-start mr-auto"
                }`}
              >
                {msg.text || 'Error in response'}
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">Bot is typing...</div>}
          </div>

          <div className="p-2 border-t flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
