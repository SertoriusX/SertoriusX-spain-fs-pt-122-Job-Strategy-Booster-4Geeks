import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../hooks/UserContextProvier.jsx";
import Sidebar from "./Sidebar.jsx";
import CVPreview from "./CVPreview.jsx";
import CVEditor from "./CVEditor.jsx";
import { createEmptyCV, cloneCV } from "./utils/cvHelpers.js";
import "../../styles/CVAdministrator.css";


const CVAdministrator = () => {
    const { token } = useContext(UserContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [cvList, setCvList] = useState([]);
    const [selectedCVId, setSelectedCVId] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (token) loadCVList();
    }, [token]);

    const loadCVList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/cv`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success && Array.isArray(data.cvs)) {
                setCvList(data.cvs);

                if (data.cvs.length > 0) {
                    setSelectedCVId(data.cvs[0].id);
                    setFormData(data.cvs[0]);
                }
            }
        } catch (err) {
            console.error("Error al cargar CVs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const selectCV = (id) => {
        const cv = cvList.find((c) => c.id === id);
        if (cv) {
            setSelectedCVId(id);
            setFormData(cv);
            setIsEditing(false);
        }
    };

    const updateCurrentCV = (field, value) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);

        setCvList((prev) =>
            prev.map((cv) => (cv.id === selectedCVId ? updated : cv))
        );
    };

    const createNewCV = () => {
        const nuevo = createEmptyCV();
        setCvList((prev) => [...prev, nuevo]);
        setSelectedCVId(nuevo.id);
        setFormData(nuevo);
        setIsEditing(true);
    };

    const saveCV = async () => {
        setSaving(true);

        try {
            if (!selectedCVId) {
                const res = await fetch(`${backendUrl}/api/cv`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                if (data.success) {
                    setCvList((prev) => [...prev, data.cv]);
                    setSelectedCVId(data.cv.id);
                    setFormData(data.cv.datos);
                    setIsEditing(false);
                }

                setSaving(false);
                return;
            }

            const res = await fetch(`${backendUrl}/api/cv/${selectedCVId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setCvList((prev) =>
                    prev.map((cv) => (cv.id === selectedCVId ? data.cv : cv))
                );
                setFormData(data.cv.datos);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Error al guardar CV:", err);
        } finally {
            setSaving(false);
        }
    };


    const deleteCV = async () => {
        if (!confirm("¿Seguro que deseas eliminar este CV?")) return;

        try {
            await fetch(`${backendUrl}/api/cv/${selectedCVId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedList = cvList.filter((cv) => cv.id !== selectedCVId);
            setCvList(updatedList);

            if (updatedList.length > 0) {
                setSelectedCVId(updatedList[0].id);
                setFormData(updatedList[0]);
            } else {
                setSelectedCVId(null);
                setFormData(null);
            }
        } catch (err) {
            console.error("Error al eliminar CV:", err);
        }
    };

    const cloneSelectedCV = () => {
        const original = cvList.find((cv) => cv.id === selectedCVId);
        if (!original) return;

        const copia = cloneCV(original);

        setCvList((prev) => [...prev, copia]);
        setSelectedCVId(copia.id);
        setFormData(copia);
        setIsEditing(true);
    };

    return (
        <div className="cv-layout">

            <div className="cv-bar-horizontal">
                {cvList.map((cv) => (
                    <div key={cv.id} className="cv-card">
                        <div className="cv-title">{cv.datos.titulo || "CV sin título"}</div>
                        <div className="cv-actions">
                            <button onClick={() => handleEdit(cv.id)}>🖉</button>
                            <button onClick={() => handleAddFrom(cv.id)}>📄</button>
                            <button onClick={() => handleDelete(cv.id)}>🗑️</button>
                        </div>
                    </div>
                ))}

                <button className="cv-new-button" onClick={handleCreateNewCV}>
                    + Nuevo CV
                </button>
            </div>

            <main className="cv-main">
                {isLoading ? (
                    <p>Cargando...</p>
                ) : isEditing ? (
                    <CVEditor
                        formData={formData}
                        updateCurrentCV={updateCurrentCV}
                        setIsEditing={setIsEditing}
                        saveCV={saveCV}
                        saving={saving}
                    />
                ) : formData ? (
                    <CVPreview
                        formData={formData}
                        setIsEditing={setIsEditing}
                        deleteCV={deleteCV}
                        cloneCV={cloneSelectedCV}
                    />
                ) : (
                    <p>No hay CV seleccionado</p>
                )}
            </main>
        </div>
    )
};

export default CVAdministrator;
