import axios from "axios";
import React, { useState,useEffect,useRef } from "react";

const ChatBot: React.FC = () => {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [warning, setWarning] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("User") || "null");
  const adminData = JSON.parse(localStorage.getItem("adminCreds") || "null");

  const student = userData?.student_details?.email;
  const admin = adminData?.Email;

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSend = async () => {
    if (loading) return;

    if (input.length > 100) {
      setWarning("⚠️ Message too long");
      return;
    }

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

      console.log("data",data)
      console.log("student",student)
      console.log("admin",admin)
  
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
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try again later." },
      ]);
      console.error("Chatting error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (isOpen && messages.length === 0) {
    setMessages([
      {
        sender: "bot",
        text: admin
          ? "Hello Admin 👨‍💼 👋\nHow can I assist you?"
          : "Hello Student 🎓 👋\nHow can I help you?",
      },
    ]);
  }
}, [isOpen,admin,messages.length]);
  

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
            {loading && (
              <div className="text-xs text-gray-400 italic">
                🤖 Assistant is typing...
              </div>
            )}
              <div ref={chatEndRef}></div>
          </div>

          <div className="flex flex-wrap gap-1 mx-2 my-1">
          {["My room", "My payments", "My complaints"].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-xs bg-gray-200 px-2 py-1 rounded"
            >
              {q}
            </button>
          ))}
        </div>

          <div className="p-2 border-t flex items-center space-x-2">
           <div className="relative flex items-center">
             <input
               type="text"
               value={input}
               onChange={(e) => {
                 const value = e.target.value;
                
                 if (value.length <= 100) {
                   setInput(value);
                   setWarning("");
                 } else {
                   setWarning("⚠️ Maximum 100 characters allowed");
                 }
               }}
               className="w-full border rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               placeholder="Type a message..."
               onKeyDown={(e) => {
                 if (e.key === "Enter" && !loading) handleSend();
               }}
             />
          
             {/* Character Counter INSIDE input */}
             <span className="absolute right-3 text-[10px] text-gray-400">
               {input.length}/100
             </span>
           </div>
             
           {/* Warning BELOW input */}
           {warning && (
             <div className="text-xs text-red-500 mt-1">
               {warning}
             </div>
           )}
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
