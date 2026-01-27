import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function Interview() {
    const [chat, setChat] = useState([]); // { sender: "user" | "bot", text }
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const chatEndRef = useRef(null);

    const sendMessage = async () => {
        if (!message.trim()) return;

        setChat((prev) => [...prev, { sender: "user", text: message }]);
        setLoading(true);

        try {
            const res = await axios.post(`${backendUrl}/chat`, { message });
            const botReply = res.data.response;

            setChat((prev) => [...prev, { sender: "bot", text: botReply }]);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            setChat((prev) => [
                ...prev,
                { sender: "bot", text: "Error: no pude conectar con el servidor." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Scroll chat to bottom on new messages
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div
            style={{
                maxWidth: 600,
                margin: "40px auto",
                padding: 20,
                fontFamily:
                    "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#333",
            }}
        >
            <h1 style={{ textAlign: "center", marginBottom: 24 }}>🤖 Chatbot AI</h1>

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    height: 400,
                    overflowY: "auto",
                    padding: 16,
                    backgroundColor: "#fefefe",
                    boxShadow:
                        "0 4px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {chat.length === 0 && (
                    <p
                        style={{
                            color: "#999",
                            textAlign: "center",
                            marginTop: "40%",
                        }}
                    >
                        Empieza escribiendo un mensaje abajo 👇
                    </p>
                )}

                {chat.map((entry, idx) => {
                    const isUser = entry.sender === "user";
                    return (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: isUser ? "flex-end" : "flex-start",
                                marginBottom: 12,
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "75%",
                                    backgroundColor: isUser ? "#0078d4" : "#e5e5ea",
                                    color: isUser ? "white" : "#333",
                                    padding: "12px 16px",
                                    borderRadius: 20,
                                    borderTopRightRadius: isUser ? 0 : 20,
                                    borderTopLeftRadius: isUser ? 20 : 0,
                                    fontSize: 15,
                                    lineHeight: 1.4,
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {entry.text}
                            </div>
                        </div>
                    );
                })}

                {/* This empty div helps auto-scroll to bottom */}
                <div ref={chatEndRef} />
            </div>

            <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Escribe tu mensaje aquí..."
                style={{
                    width: "100%",
                    padding: 12,
                    fontSize: 16,
                    marginTop: 16,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    resize: "none",
                    boxSizing: "border-box",
                    fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    color: "#333",
                    outline: "none",
                }}
            />

            <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "14px 0",
                    fontSize: 16,
                    backgroundColor: loading || !message.trim() ? "#ccc" : "#0078d4",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: loading || !message.trim() ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    transition: "background-color 0.2s ease",
                }}
            >
                {loading ? "Enviando..." : "Enviar"}
            </button>
        </div>
    );
}

export default Interview;