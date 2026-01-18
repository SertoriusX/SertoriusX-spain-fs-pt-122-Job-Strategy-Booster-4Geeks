import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, Plus, Save, X, Trash2, Pencil } from "lucide-react";
import { usePerfilData } from "../hooks/usePerfilData";
import "../styles/PerfilUsuario.css";
import mermaid from "mermaid";

function MermaidChart({ chart }) {
    const ref = useRef(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: "default"
        });
        if (ref.current) {
            mermaid.contentLoaded();
        }
    }, [chart]);

    return (
        <div ref={ref} className="mermaid">
            {chart}
        </div>
    );
}

export default function PerfilUsuario() {
    const { profileData, handleInputChange } = usePerfilData();

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showAgendaModal, setShowAgendaModal] = useState(false);
    const [showApplications, setShowApplications] = useState(false);
    const [editingInterviewIndex, setEditingInterviewIndex] = useState(null);
    const [editingPortals, setEditingPortals] = useState(false);

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showTimelineEditor, setShowTimelineEditor] = useState(false);
    const [timelineApp, setTimelineApp] = useState(null);
    const [showTimelineViewer, setShowTimelineViewer] = useState(false);
    const [timelineViewerApp, setTimelineViewerApp] = useState(null);

    const [newInterview, setNewInterview] = useState({
        company: "",
        position: "",
        date: "",
        time: "",
        contact: "",
        address: "",
        notes: ""
    });

    const [newPortal, setNewPortal] = useState({ name: "", url: "" });

    const [newApplication, setNewApplication] = useState({
        company: "",
        position: "",
        status: "",
        timeline: []
    });

    const [newTimelineItem, setNewTimelineItem] = useState({
        date: "",
        event: ""
    });

    const handleSkillsChange = (value) => {
        const skillsArray = value.split(",").map(s => s.trim()).filter(s => s);
        handleInputChange("skills", skillsArray);
    };

    const handleImageUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const addInterview = () => {
        const fullDate = `${newInterview.date} ${newInterview.time}`;
        const interview = { ...newInterview, date: fullDate };
        handleInputChange("upcomingInterviews", [...profileData.upcomingInterviews, interview]);
        setNewInterview({ company: "", position: "", date: "", time: "", contact: "", address: "", notes: "" });
    };

    const updateInterview = () => {
        const fullDate = `${newInterview.date} ${newInterview.time}`;
        const updated = [...profileData.upcomingInterviews];
        updated[editingInterviewIndex] = { ...newInterview, date: fullDate };
        handleInputChange("upcomingInterviews", updated);
        setEditingInterviewIndex(null);
        setNewInterview({ company: "", position: "", date: "", time: "", contact: "", address: "", notes: "" });
    };

    const addPortal = () => {
        if (newPortal.name.trim() && newPortal.url.trim()) {
            handleInputChange("jobPortals", [...profileData.jobPortals, newPortal]);
            setNewPortal({ name: "", url: "" });
        }
    };

    const removePortal = (index) => {
        handleInputChange("jobPortals", profileData.jobPortals.filter((_, i) => i !== index));
    };

    const generateTimeline = (timeline) => {
        if (!timeline || timeline.length === 0) return "timeline\n    title Proceso de Aplicación\n";
        let output = "timeline\n    title Proceso de Aplicación\n";
        timeline.forEach(item => {
            output += `    ${item.date} : ${item.event}\n`;
        });
        return output;
    };

    const addApplication = () => {
        if (!newApplication.company || !newApplication.position) return;
        const appWithTimeline = {
            ...newApplication,
            timeline: newApplication.timeline.length ? newApplication.timeline : []
        };
        handleInputChange("applications", [...profileData.applications, appWithTimeline]);
        setNewApplication({ company: "", position: "", status: "", timeline: [] });
    };

    const removeApplication = (index) => {
        handleInputChange("applications", profileData.applications.filter((_, i) => i !== index));
        setSelectedApplication(null);
    };

    return (
        <div className="perfil-container">
            <div className="profile-header-banner">
                <div className="banner-circle banner-circle-1"></div>
                <div className="banner-circle banner-circle-2"></div>
                <div className="banner-circle banner-circle-3"></div>
                <div className="banner-circle banner-circle-4"></div>
            </div>
            <div className="perfil-layout">
                <div className="perfil-sidebar">
                    <div className="profile-card">
                        <div className="avatar-wrapper">
                            <div className="avatar">
                                <img
                                    src={
                                        avatarPreview ||
                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%2366D9EF' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='80' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='system-ui'%3E👩‍💻%3C/text%3E%3C/svg%3E"
                                    }
                                    alt="Avatar"
                                    className="avatar-image"
                                />
                            </div>

                            <label htmlFor="avatar-upload" className="avatar-edit-icon">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </label>

                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files[0])}
                                className="avatar-input-hidden"
                            />
                        </div>

                        <h2 className="name">{profileData.name}</h2>
                        <p className="job-title">{profileData.title}</p>

                        {!isEditingProfile && (
                            <button onClick={() => setIsEditingProfile(true)} className="edit-profile-button">
                                <Pencil size={16} />
                            </button>
                        )}

                        {isEditingProfile && (
                            <div className="profile-edit-card">
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="input-field"
                                    placeholder="Nombre"
                                />
                                <input
                                    type="text"
                                    value={profileData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    className="input-field"
                                    placeholder="Profesión"
                                />
                                <div className="edit-actions">
                                    <button onClick={() => setIsEditingProfile(false)} className="cancel-button">
                                        <X size={16} />
                                    </button>
                                    <button onClick={() => setIsEditingProfile(false)} className="confirm-button">
                                        <Save size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="section">
                        <h3 className="section-title">Skills</h3>
                        <input
                            type="text"
                            value={profileData.skills.join(", ")}
                            onChange={(e) => handleSkillsChange(e.target.value)}
                            className="input-field"
                            placeholder="Separadas por comas"
                        />
                        <div className="skills-grid">
                            {profileData.skills.map((skill, index) => (
                                <span key={index} className="skill-badge">{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h3 className="section-title">Páginas de búsqueda</h3>
                            <button onClick={() => setEditingPortals(!editingPortals)} className="edit-profile-button">
                                <Pencil size={16} />
                            </button>
                        </div>

                        <div className="portals-list">
                            {profileData.jobPortals.map((portal, index) => (
                                <div key={index} className="portal-item-container">
                                    <a
                                        href={portal.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="portal-link-active"
                                    >
                                        <span>{portal.name}</span>
                                        <ExternalLink size={14} />
                                    </a>
                                    {editingPortals && (
                                        <button
                                            className="remove-portal-button"
                                            onClick={() => removePortal(index)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {editingPortals && (
                            <div className="add-portal">
                                <div className="add-portal-row">
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Nombre"
                                        value={newPortal.name}
                                        onChange={(e) => setNewPortal({ ...newPortal, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="URL"
                                        value={newPortal.url}
                                        onChange={(e) => setNewPortal({ ...newPortal, url: e.target.value })}
                                    />
                                </div>
                                <button className="add-portal-button" onClick={addPortal}>
                                    <Plus size={14} /> Añadir portal
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="perfil-main-content">

                    <div className="perfil-header">
                        <h1 className="page-title">Panel Profesional</h1>
                        <div className="action-buttons">
                            <button className="agenda-button" onClick={() => setShowAgendaModal(true)}>
                                Agenda de entrevistas
                            </button>
                            <button className="apps-button" onClick={() => setShowApplications(true)}>
                                Listado de aplicaciones
                            </button>
                        </div>
                    </div>

                    <div className="interviews-today">
                        <h2>Entrevistas programadas</h2>
                        {profileData.upcomingInterviews.length === 0 && (
                            <p>No tienes entrevistas programadas.</p>
                        )}
                        {profileData.upcomingInterviews.map((interview, index) => (
                            <div key={index} className="interview-item">
                                <div className="interview-info">
                                    <h3>{interview.company}</h3>
                                    <p>{interview.position}</p>
                                    <p>{interview.date.split(" ")[0]}</p>
                                    <p>{interview.time || interview.date.split(" ")[1]}</p>
                                    <p>{interview.address}</p>
                                </div>

                                <button
                                    className="edit-interview-button"
                                    onClick={() => {
                                        const [datePart, timePart] = interview.date.split(" ");
                                        setNewInterview({
                                            company: interview.company,
                                            position: interview.position,
                                            date: datePart || "",
                                            time: timePart || "",
                                            contact: interview.contact,
                                            address: interview.address,
                                            notes: interview.notes
                                        });
                                        setEditingInterviewIndex(index);
                                        setShowAgendaModal(true);
                                    }}
                                >
                                    <Pencil size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {showApplications && (
                        <div className="applications-section">
                            <div className="applications-header">
                                <h2>Mis Aplicaciones</h2>
                                <button className="close-apps" onClick={() => setShowApplications(false)}>✕</button>
                            </div>

                            <div className="applications-list">
                                {profileData.applications.map((app, index) => (
                                    <div
                                        key={index}
                                        className="application-row"
                                        onClick={() => {
                                            setTimelineViewerApp(app);
                                            setShowTimelineViewer(true);
                                        }}
                                    >
                                        <span>{app.company}</span>
                                        <span>{app.position}</span>
                                        <span>{app.status}</span>
                                        <button
                                            className="edit-interview-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTimelineApp(app);
                                                setShowTimelineEditor(true);
                                            }}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="remove-application-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeApplication(index);
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="add-application">
                                <div className="add-application-row">
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Empresa"
                                        value={newApplication.company}
                                        onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Posición"
                                        value={newApplication.position}
                                        onChange={(e) => setNewApplication({ ...newApplication, position: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Estado"
                                        value={newApplication.status}
                                        onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
                                    />
                                </div>
                                <button className="add-application-button" onClick={addApplication}>
                                    <Plus size={14} /> Añadir aplicación
                                </button>
                            </div>
                        </div>
                    )}

                    {showAgendaModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Agendar entrevista</h2>

                                <input
                                    type="text"
                                    placeholder="Empresa"
                                    className="input-field"
                                    value={newInterview.company}
                                    onChange={(e) => setNewInterview({ ...newInterview, company: e.target.value })}
                                />

                                <input
                                    type="text"
                                    placeholder="Posición"
                                    className="input-field"
                                    value={newInterview.position}
                                    onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                                />

                                <div className="modal-row">
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={newInterview.date}
                                        onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                                    />
                                    <input
                                        type="time"
                                        className="input-field"
                                        value={newInterview.time}
                                        onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Contacto"
                                    className="input-field"
                                    value={newInterview.contact}
                                    onChange={(e) => setNewInterview({ ...newInterview, contact: e.target.value })}
                                />

                                <input
                                    type="text"
                                    placeholder="Dirección"
                                    className="input-field"
                                    value={newInterview.address}
                                    onChange={(e) => setNewInterview({ ...newInterview, address: e.target.value })}
                                />

                                <textarea
                                    placeholder="Notas"
                                    className="textarea-field"
                                    value={newInterview.notes}
                                    onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                                />

                                <div className="modal-actions">
                                    <button
                                        className="cancel-button"
                                        onClick={() => {
                                            setShowAgendaModal(false);
                                            setEditingInterviewIndex(null);
                                            setNewInterview({ company: "", position: "", date: "", time: "", contact: "", address: "", notes: "" });
                                        }}
                                    >
                                        <X size={16} />
                                    </button>

                                    <button
                                        className="confirm-button"
                                        onClick={() => {
                                            if (editingInterviewIndex !== null) {
                                                updateInterview();
                                            } else {
                                                addInterview();
                                            }
                                            setShowAgendaModal(false);
                                        }}
                                    >
                                        <Save size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showTimelineEditor && timelineApp && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Editar Timeline</h2>

                                <div className="timeline-form">
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Fecha (ej: 03/01)"
                                        value={newTimelineItem.date}
                                        onChange={(e) => setNewTimelineItem({ ...newTimelineItem, date: e.target.value })}
                                    />

                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Evento (ej: apliqué)"
                                        value={newTimelineItem.event}
                                        onChange={(e) => setNewTimelineItem({ ...newTimelineItem, event: e.target.value })}
                                    />

                                    <button
                                        className="add-application-button"
                                        onClick={() => {
                                            if (!newTimelineItem.date || !newTimelineItem.event) return;

                                            const updated = [...(timelineApp.timeline || []), newTimelineItem];

                                            const updatedApps = profileData.applications.map(app =>
                                                app.company === timelineApp.company &&
                                                    app.position === timelineApp.position
                                                    ? { ...app, timeline: updated }
                                                    : app
                                            );

                                            handleInputChange("applications", updatedApps);

                                            setTimelineApp({ ...timelineApp, timeline: updated });
                                            setNewTimelineItem({ date: "", event: "" });
                                        }}
                                    >
                                        Añadir etapa
                                    </button>
                                </div>

                                <div className="timeline-list">
                                    {(timelineApp.timeline || []).map((item, index) => (
                                        <div key={index} className="timeline-row">
                                            <span>{item.date}</span>
                                            <span>{item.event}</span>
                                            <button
                                                className="remove-application-button"
                                                onClick={() => {
                                                    const updated = (timelineApp.timeline || []).filter((_, i) => i !== index);

                                                    const updatedApps = profileData.applications.map(app =>
                                                        app.company === timelineApp.company &&
                                                            app.position === timelineApp.position
                                                            ? { ...app, timeline: updated }
                                                            : app
                                                    );

                                                    handleInputChange("applications", updatedApps);
                                                    setTimelineApp({ ...timelineApp, timeline: updated });
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-actions">
                                    <button className="cancel-button" onClick={() => setShowTimelineEditor(false)}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showTimelineViewer && timelineViewerApp && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>Timeline de {timelineViewerApp.company}</h3>
                                    <button className="close-apps" onClick={() => setShowTimelineViewer(false)}>✕</button>
                                </div>
                                <MermaidChart chart={generateTimeline(timelineViewerApp.timeline)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
