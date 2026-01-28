import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../hooks/UserContextProvier";
import "../styles/Interview.css";

function Interview() {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const chatEndRef = useRef(null);
    const { token } = useContext(UserContext);

    // Helper function to convert URLs in text into clickable links
    function linkify(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) =>
            urlRegex.test(part) ? (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                    {part}
                </a>
            ) : (
                part
            )
        );
    }

    const sendMessage = async () => {
        if (!message.trim()) return;

        if (!token) {
            setChat((prev) => [
                ...prev,
                { sender: "bot", text: "🔐 You must login first." },
            ]);
            return;
        }

        setChat((prev) => [...prev, { sender: "user", text: message }]);
        setLoading(true);

        try {
            const res = await axios.post(
                `${backendUrl}/chat`,
                { message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const botReply = res.data.response;
            setChat((prev) => [...prev, { sender: "bot", text: botReply }]);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);

            if (error.response?.status === 401) {
                setChat((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        text: "🔐 Session expired. Please login again.",
                    },
                ]);
            } else {
                setChat((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        text: "❌ Server error. Try again later.",
                    },
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="interview-page">
            <div className="chat-card">
                <h1 className="chat-title">🤖 Robot de entrevista</h1>

                <div className="chat-window">
                    {chat.length === 0 && (
                        <p className="empty-text">Empezar a escribir 👇</p>
                    )}

                    {chat.map((entry, idx) => {
                        const isUser = entry.sender === "user";
                        return (
                            <div
                                key={idx}
                                className={`message-row ${isUser ? "user" : "bot"}`}
                            >
                                <div
                                    className={`message-bubble ${isUser ? "user" : "bot"}`}
                                >
                                    {isUser ? entry.text : linkify(entry.text)}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder="Escribe tu mensaje..."
                    className="chat-input"
                />

                <button
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                    className="send-btn"
                >
                    {loading ? "Envío..." : "Enviar"}
                </button>
            </div>
        </div>
    );
}

export default Interview;
