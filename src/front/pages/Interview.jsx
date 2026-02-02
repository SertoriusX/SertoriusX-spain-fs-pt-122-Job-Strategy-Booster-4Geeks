import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../hooks/UserContextProvier";
import "../styles/Interview.css";

function Interview() {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const chatEndRef = useRef(null);
    const { token } = useContext(UserContext);

    function renderTextWithLineBreaks(text) {
        return text.split("\n").map((line, i) => (
            <React.Fragment key={i}>
                {line}
                {i !== text.split("\n").length - 1 && <br />}
            </React.Fragment>
        ));
    }

    function renderTextWithLineBreaksAndLinks(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        return text.split("\n").map((line, i) => {
            const parts = line.split(urlRegex);
            return (
                <React.Fragment key={i}>
                    {parts.map((part, idx) =>
                        urlRegex.test(part) ? (
                            <a
                                key={idx}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {part}
                            </a>
                        ) : (
                            part
                        )
                    )}
                    {i !== text.split("\n").length - 1 && <br />}
                </React.Fragment>
            );
        });
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

            const { response, options } = res.data;

            setChat((prev) => [
                ...prev,
                { sender: "bot", text: response, options: options || [] },
            ]);
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

    const handleOptionClick = (value) => {
        setMessage(value);
        sendMessage();
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
                                <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
                                    <div className="message-text">
                                        {isUser
                                            ? renderTextWithLineBreaks(entry.text)
                                            : renderTextWithLineBreaksAndLinks(entry.text)}
                                    </div>

                                    {!isUser && entry.options && entry.options.length > 0 && (
                                        <div className="options-row">
                                            {entry.options.map((option, i) => (
                                                <button
                                                    key={i}
                                                    className="option-button"
                                                    onClick={() => handleOptionClick(option.value)}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="message-time">
                                        {new Date().toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
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
