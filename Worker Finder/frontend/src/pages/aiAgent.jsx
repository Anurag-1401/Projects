import { useState, useRef, useEffect } from "react";
import { useAgentActions } from '../services/useAIActions';
import {supabase} from "../supabase/supabaseClient";

const AIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I’m Worker Finder AI 🤖\nI can help you find workers instantly.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { executeAction, parseFallback } = useAgentActions();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

 const processResponse = (data) => {
  const errors = [];

  data.actions.forEach((action) => {
    // 🔥 If service-based recommendation → convert to SEARCH
    if (action.action === "SHOW_RECOMMENDATIONS" && action.service) {
      executeAction({
        action: "SEARCH_WORKERS",
        service: action.service,
      });
      return;
    }

    // ❌ Prevent unwanted navigation
    if (
      action.action !== "CHAT" &&
      action.action !== "SHOW_RECOMMENDATIONS" &&
      action.action !== "SEARCH_WORKERS"
    ) {
      const err = executeAction(action);
      if (err) errors.push(err);
    }
  });

  return {
    message: data.message,
    actions: data.actions || [],
  };
};

  // 🚀 SEND MESSAGE
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // 🔥 SUPABASE EDGE FUNCTION CALL
      const { data, error } = await supabase.functions.invoke("ai-agentIII", {
        body: {
          message: trimmed,
          conversationHistory,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const result = processResponse(data);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: result.message,   // ✅ text
        actions: result.actions,   // 🔥 IMPORTANT (for worker cards)
      },
    ]);
    } catch (err) {
      console.warn("AI failed → fallback", err);

      const fallback = parseFallback(trimmed);
     const result = processResponse(fallback);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: result.message,
        actions: result.actions,
      },
    ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <div
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 99999,              // 🔥 VERY IMPORTANT
          pointerEvents: "auto",
        }}
      >
          <button
          onClick={() => setIsOpen(!isOpen)}
            style={{
            background: "black",
            borderRadius: "50%",
            width: 65,
            height: 65,
            border: "2px solid white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)",
            opacity: 1,
            transform: "none",
          }}
        >
          <span
            style={{
              fontSize: isOpen ? "28px" : "32px",   // 🔥 bigger icons
              color: "white",                      // 🔥 ensure visibility
              lineHeight: 1,
            }}
          >
            {isOpen ? "✕" : "💬"}
          </span>
        </button>
      </div>

      {/* CHAT UI */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 350,
            marginBottom: 20,
            background: "white",
            color: "black",
            border: "1px solid black",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            zIndex: 99999,
            opacity: 1,
            transform: "none",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "black",
              color: "white",
              padding: 10,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            Worker Finder AI
          </div>

          {/* MESSAGES */}
          <div style={{ height: 300, overflowY: "auto", padding: 10 }}>
            {messages.map((msg) => (
  <div
    key={msg.id}
    style={{
      textAlign: msg.role === "user" ? "right" : "left",
      marginBottom: 10,
    }}
  >
    {/* TEXT MESSAGE */}
    <div
      style={{
        padding: 8,
        borderRadius: 10,
        background: msg.role === "user" ? "black" : "#eee",
        color: msg.role === "user" ? "white" : "black",
        display: "inline-block",
        marginBottom: 5,
      }}
    >
      {msg.content}
    </div>

    {/* 🔥 WORKER CARDS */}
    {msg.actions &&
  msg.actions.map((action, i) => {

    if (action.action === "SHOW_RECOMMENDATIONS") {

      // 🔥 CASE 1: Workers available → show cards
      if (Array.isArray(action.workers) && action.workers.length > 0) {
        return (
          <div key={i}>
            {action.workers.map((w) => (
              <div
                key={w.id}
                onClick={() =>
                  executeAction({
                    action: "NAVIGATE",
                    path: `/worker/${w.id}`,
                  })
                }
                style={{
                  border: "1px solid black",
                  padding: 10,
                  marginTop: 5,
                  borderRadius: 8,
                  cursor: "pointer",
                  background: "white",
                }}
              >
                <strong>{w.name}</strong>
                <p>⭐ {w.rating}</p>
                <p>Jobs: {w.jobs_done}</p>
                <p>{w.distance} km away</p>
              </div>
            ))}
          </div>
        );
      }

      // 🔥 CASE 2: Service only → loading state
      if (action.service) {
        return (
          <p key={i}>
            Fetching best {action.service}s for you... ⏳
          </p>
        );
      }

      // 🔥 CASE 3: No data
      return <p key={i}>No workers found 😕</p>;
    }

    return null;
  })}
  </div>
))}

            {isLoading && <p>Thinking...</p>}

            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: "flex",
             borderTop: "1px solid black", 
             borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              overflow: "hidden",
              boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
             }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for workers..."
              style={{
                flex: 1,
                padding: 12,
                border: "none",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              onClick={handleSend}
              style={{
                background: "black",
                color: "white",
                border: "none",
                padding: "0 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAgent;