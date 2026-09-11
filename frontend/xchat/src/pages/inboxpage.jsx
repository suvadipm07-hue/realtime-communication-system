import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./inboxpage.css";

const API_URL = "https://realtime-communication-system.onrender.com";

function InboxPage() {
  const { chatId, userId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("access_token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // GET CONTACT INFORMATION
  // ==========================================

  useEffect(() => {
    const fetchContact = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `${API_URL}/users/search/${userId}`,
          authConfig
        );

        setContact(response.data);
      } catch (err) {
        console.error("Error fetching contact:", err);
      }
    };

    fetchContact();
  }, [userId]);

  // ==========================================
  // GET MESSAGES WHEN CHAT CHANGES
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const fetchMessages = async () => {
      if (!chatId) return;

      try {
        setLoading(true);
        setError("");

        // Clear the previous chat's messages
        setMessages([]);

        const response = await axios.get(
          `${API_URL}/messages/${chatId}`,
          authConfig
        );

        if (!cancelled) {
          setMessages(response.data);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);

        if (!cancelled) {
          setError("Unable to load messages");
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [chatId]);

  // ==========================================
  // WEBSOCKET CONNECTION
  // ==========================================

  useEffect(() => {
    if (!chatId) return;

    // Close the previous chat's WebSocket
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    const socket = new WebSocket(
  `wss://realtime-communication-system.onrender.com/ws/messages/${chatId}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to chat:", chatId);
    };

    socket.onmessage = (event) => {
      try {
        const incomingMessage = JSON.parse(event.data);

        setMessages((previousMessages) => {
          // Prevent duplicate messages
          const alreadyExists = previousMessages.some(
            (msg) =>
              msg.message_id === incomingMessage.message_id
          );

          if (alreadyExists) {
            return previousMessages;
          }

          return [...previousMessages, incomingMessage];
        });
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("Disconnected from chat:", chatId);
    };

    // Close this connection when another chat is opened
    return () => {
      socket.close();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [chatId]);

  // ==========================================
  // AUTO-SCROLL
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageText.trim();

    if (!text || !chatId) return;

    try {
      await axios.post(
        `${API_URL}/messages/${chatId}`,
        {
          message: text,
        },
        authConfig
      );

      setMessageText("");

      // Do not append the message here.
      // The backend broadcasts it through WebSocket.
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Message could not be sent");
    }
  };

  // ==========================================
  // CLEAR CHAT
  // ==========================================

  const clearChat = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all messages from this chat?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/messages/${chatId}/clear`,
        authConfig
      );

      // Clear messages from the current screen
      setMessages([]);

      alert("Chat cleared successfully");
    } catch (err) {
      console.error("Error clearing chat:", err);

      const detail =
        err.response?.data?.detail ||
        "Unable to clear chat";

      alert(detail);
    }
  };

  // ==========================================
  // ENTER KEY HANDLER
  // ==========================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  };

  // ==========================================
  // BACK TO CHAT LIST
  // ==========================================

  const goBack = () => {
    navigate("/chat");
  };

  return (
    <div className="inbox-page">

      {/* HEADER */}
      <header className="inbox-header">

        <button
          className="back-button"
          onClick={goBack}
        >
          ← Back
        </button>

        <div className="contact-info">
          <h2>{contact?.name || userId}</h2>
          <p>{contact?.user_id || userId}</p>
        </div>

        {/* CLEAR CHAT BUTTON */}
        <button
          className="clear-chat-button"
          onClick={clearChat}
        >
          Clear Chat
        </button>

      </header>

      {/* MESSAGE AREA */}
      <main className="message-area">

        {loading && (
          <p className="status-message">
            Loading messages...
          </p>
        )}

        {!loading && error && (
          <p className="status-message error-message">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          messages.length === 0 && (
            <p className="status-message">
              No messages yet. Start the conversation.
            </p>
          )}

        {!loading &&
          messages.map((msg) => {

            const isMyMessage =
              msg.sender_id !== userId;

            return (
              <div
                key={msg.message_id}
                className={`message ${
                  isMyMessage
                    ? "my-message"
                    : "their-message"
                }`}
              >
                <p>{msg.message}</p>

                {msg.created_at && (
                  <small>
                    {new Date(
                      msg.created_at
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                )}
              </div>
            );
          })}

        <div ref={messagesEndRef} />

      </main>

      {/* MESSAGE INPUT */}
      <form
        className="message-input-area"
        onSubmit={sendMessage}
      >
        <textarea
          value={messageText}
          onChange={(event) =>
            setMessageText(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows="1"
        />

        <button
          type="submit"
          disabled={!messageText.trim()}
        >
          Send
        </button>
      </form>

    </div>
  );
}

export default InboxPage;