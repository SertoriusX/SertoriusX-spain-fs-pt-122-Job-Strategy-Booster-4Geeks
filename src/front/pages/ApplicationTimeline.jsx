import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function ListadoAplicaciones() {
    const containerRef = useRef(null);

    const [position, setPosition] = useState("");

    const [events, setEvents] = useState([]);
    const [newDate, setNewDate] = useState("");
    const [newText, setNewText] = useState("");

    useEffect(() => {
        if (!containerRef.current) return;

        const timeline = generateTimeline();

        mermaid.initialize({ startOnLoad: false });

        mermaid.render("timelineGraph", timeline).then(({ svg }) => {
            containerRef.current.innerHTML = svg;
        });
    }, [position, events]);

    const addEvent = () => {
        if (!newDate || !newText) return;
        setEvents([...events, { date: newDate, text: newText }]);
        setNewDate("");
        setNewText("");
    };

    const generateTimeline = () => {
        let text = "timeline\n";
        text += `    title ${position}\n`;
        events.forEach((e) => {
            text += `    ${e.date} : ${e.text}\n`;
        });
        return text;
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Listado de Aplicaciones</h2>

            {/* Solo el cargo */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Cargo / Puesto"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                />
            </div>

            {/* Eventos */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Fecha (DD/MM)"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <button onClick={addEvent}>Agregar</button>
            </div>

            {/* Gráfico */}
            <div ref={containerRef}></div>
        </div>
    );
}
