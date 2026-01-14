import {
  ref,
  push,
  onValue,
  serverTimestamp,
  set,
  onDisconnect,
  off,
} from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "./ChatWindow.css";

export default function ChatWindow({ room }) {
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // 🔹 Listen for messages + typing
  useEffect(() => {
    if (!room || !user) return;

    const messagesRef = ref(db, `messages/${room._id}`);
    const typingRef = ref(db, `typing/${room._id}`);

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMessages([]);
        return;
      }
      setMessages(Object.values(data));
    });

    onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setIsTyping(false);
        return;
      }

      const typingUsers = Object.keys(data).filter(
        (id) => id !== user._id && data[id]?.isTyping
      );

      setIsTyping(typingUsers.length > 0);
    });

    return () => {
      off(messagesRef);
      off(typingRef);
    };
  }, [room, user]);

  // 🔹 Update typing status
  const handleTyping = (value) => {
    if (!room || !user) return;

    const typingUserRef = ref(db, `typing/${room._id}/${user._id}`);

    set(typingUserRef, {
      isTyping: value,
      timestamp: serverTimestamp(),
    });

    onDisconnect(typingUserRef).set({
      isTyping: false,
      timestamp: serverTimestamp(),
    });
  };

  // 🔹 Send message
  const handleSend = async () => {
    if (!message.trim()) return;

    const messagesRef = ref(db, `messages/${room._id}`);

    await push(messagesRef, {
      content: message,
      senderId: user._id,
      timestamp: serverTimestamp(),
    });

    setMessage("");
    handleTyping(false);
  };

  if (!room) return null;

  return (
    <div id="chat-window" className="chat-window">
      {/* ===== MESSAGES ===== */}
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${
              msg.senderId === user._id ? "you" : "other"
            }`}
          >
            <span className="message-text">{msg.content}</span>
          </div>
        ))}
      </div>

      {/* ===== TYPING INDICATOR ===== */}
      {isTyping && (
        <div id="typing-indicator" className="typing-indicator">
          Typing...
        </div>
      )}

      {/* ===== INPUT BOX ===== */}
      <div className="message-box">
        <input
          id="message-input"
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping(e.target.value.length > 0);
          }}
          onBlur={() => handleTyping(false)}
        />

        <button id="send-button" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
}
