import { useState } from "react";
import { getAssistantReply } from "../utils/storage";

function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Hi, I am CampusMate Assistant. Ask me anything about study prep, placement prep, project assistant, learning path, progress tracking, or what you should do next.",
    },
  ]);

  const quickPrompts = [
    "What is CampusMate AI?",
    "What should I do next?",
    "Explain learning path",
    "How does progress tracking work?",
  ];

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const userMessage = {
      sender: "user",
      text: trimmedMessage,
    };

    const assistantReply = {
      sender: "assistant",
      text: getAssistantReply(trimmedMessage),
    };

    setMessages((prev) => [...prev, userMessage, assistantReply]);
    setMessage("");
  };

  const handleQuickPrompt = (prompt) => {
    const userMessage = {
      sender: "user",
      text: prompt,
    };

    const assistantReply = {
      sender: "assistant",
      text: getAssistantReply(prompt),
    };

    setMessages((prev) => [...prev, userMessage, assistantReply]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showQuickPrompts = messages.length <= 1;

  return (
    <>
      <button
        className="floating-assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Open CampusMate Assistant"
      >
        🤖
      </button>

      {isOpen && (
        <div className="floating-assistant-panel">
          <div className="floating-assistant-header">
            <div>
              <div className="floating-assistant-title">CampusMate Assistant</div>
              <div className="floating-assistant-subtitle">
                Instant help inside your dashboard
              </div>
            </div>

            <button
              className="floating-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="floating-chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`chat-row ${
                  item.sender === "user" ? "chat-row-user" : "chat-row-assistant"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    item.sender === "user"
                      ? "chat-bubble-user"
                      : "chat-bubble-assistant"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {showQuickPrompts && (
            <div className="floating-quick-prompts">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="quick-prompt-chip"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="floating-assistant-body">
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="d-flex gap-2">
              <button className="custom-btn btn-blue" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AssistantWidget;