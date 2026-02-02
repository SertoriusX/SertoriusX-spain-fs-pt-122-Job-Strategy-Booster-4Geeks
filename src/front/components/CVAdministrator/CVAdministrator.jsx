import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../hooks/UserContextProvier.jsx";
import { useOutletContext } from "react-router-dom";
import CVPreview from "./CVPreview.jsx";
import CVEditor from "./CVEditor.jsx";
import ModalAgregarCV from "./ModalAgregarCV.jsx";
import ShareDropdown from "./ShareDropdown";
import { createEmptyCV } from "./utils/cvHelpers.js";
import { Pencil, Trash2 } from "lucide-react";
import "../../styles/CVAdministrator.css";

const CVAdministrator = () => {
    const { token } = useContext(UserContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [cvList, setCvList] = useState([]);
    const [selectedCVId, setSelectedCVId] = useState(null);
    const [formData, setFormData] = useState(null);
    const { isEditing, setIsEditing } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAgregarModal, setShowAgregarModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const cvRef = useRef();

    const normalizeCV = (datos) => ({
        ...datos,
        experiencia: datos.experiencia || [],
        educacion: datos.educacion || [],
        habilidades: datos.habilidades || [],
        idiomas: datos.idiomas || []
    });

    const loadCVList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${backendUrl}/cv`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.success && Array.isArray(data.cvs)) {
                const normalizados = data.cvs.map((cv) => ({
                    id: cv.id,
                    datos: normalizeCV(cv.datos)
                }));

                setCvList(normalizados);

                if (normalizados.length > 0) {
                    setSelectedCVId(normalizados[0].id);
                    setFormData(normalizados[0].datos);
                } else {
                    setSelectedCVId(null);
                    setFormData(null);
                }

                return normalizados;
            }
        } catch (err) {
            console.error("Error al cargar CVs:", err);
        } finally {
            setIsLoading(false);
        }

        return [];
    };

    useEffect(() => {
        if (token) loadCVList();
    }, [token]);

    const selectCV = (id) => {
        const cv = cvList.find((c) => c.id === id);
        if (cv) {
            setSelectedCVId(id);
            setFormData(normalizeCV(cv.datos));
            setIsEditing(false);
        }
    };

    const updateCurrentCV = (field, value) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);

        setCvList((prev) =>
            prev.map((cv) =>
                cv.id === selectedCVId ? { ...cv, datos: updated } : cv
            )
        );
    };

    const handleSaveAs = async (cvData) => {
        setSaving(true);

        const nuevoCV = {
            ...cvData,
            id: null,
            created_at: new Date().toISOString()
        };

        const res = await fetch(`${backendUrl}/cv`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoCV)
        });

        const data = await res.json();

        if (data.success) {
            const nuevo = {
                id: data.cv.id,
                datos: normalizeCV(data.cv.datos)
            };

            setCvList((prev) => [...prev, nuevo]);
            setSelectedCVId(nuevo.id);
            setFormData(nuevo.datos);
            setIsEditing(false);
        }

        setSaving(false);
    };

    const handleSave = async (cvData) => {
        setSaving(true);

        if (!selectedCVId) {
            return handleSaveAs(cvData);
        }

        const res = await fetch(`${backendUrl}/cv/${selectedCVId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(cvData)
        });

        const data = await res.json();

        if (data.success) {
            const actualizado = {
                id: data.cv.id,
                datos: normalizeCV(data.cv.datos)
            };

            setCvList((prev) =>
                prev.map((cv) =>
                    cv.id === actualizado.id ? actualizado : cv
                )
            );

            setFormData(actualizado.datos);
            setIsEditing(false);
        }

        setSaving(false);
    };

    const createNewCV = () => {
        const nuevo = createEmptyCV();
        setSelectedCVId(null);
        setFormData(normalizeCV(nuevo.datos));
        setIsEditing(true);
    };

    const deleteCV = async (cvId) => {
        if (!confirm("¿Seguro que deseas eliminar este CV?")) return;

        try {
            const res = await fetch(`${backendUrl}/cv/${cvId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                alert("No se pudo eliminar el CV");
                return;
            }

            const actualizada = await loadCVList();

            if (actualizada.length > 0) {
                setSelectedCVId(actualizada[0].id);
                setFormData(actualizada[0].datos);
            } else {
                setSelectedCVId(null);
                setFormData(null);
            }
        } catch (err) {
            console.error("Error al eliminar CV:", err);
        }
    };

    const handleView = (id) => {
        selectCV(id);
        setIsEditing(false);
    };

    const handleEdit = (id) => {
        selectCV(id);
        setIsEditing(true);
    };

    const handleSelectForAdd = (id) => {
        const original = cvList.find((cv) => cv.id === id);
        if (!original) return;

        const copia = normalizeCV(original.datos);
        copia.titulo = "";

        setFormData(copia);
        setSelectedCVId(null);
        setIsEditing(true);
        setShowAgregarModal(false);
    };

    const handleExportPDF = async (id) => {
        const cv = cvList.find((c) => c.id === id);
        if (!cv) return;

        setSelectedCVId(id);
        setFormData(normalizeCV(cv.datos));
        setIsEditing(false);
        setIsOpen(true);

        await new Promise((resolve) => setTimeout(resolve, 500));

        window.print();

        setTimeout(() => setIsOpen(false), 1000);
    };

    return (
        <div className="cv-admin-container">
            {showAgregarModal && (
                <ModalAgregarCV
                    cvList={cvList}
                    onClose={() => setShowAgregarModal(false)}
                />
            )}

            <div className="cv-topbar">
                <div className="cv-topbar-title">Administrador de CVs</div>

                <div className="cv-topbar-actions">
                    <button onClick={createNewCV}>+ Nuevo CV</button>
                </div>
            </div>

            {!isEditing && !isOpen && (
                <table className="cv-table">
                    <thead>
                        <tr>
                            <th>Descripcion CV</th>
                            <th style={{ width: "160px" }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cvList.map((cv) => (
                            <tr key={cv.id}>
                                <td>{cv.datos.titulo || "Sin título"}</td>

                                <td>
                                    <div className="cv-actions-row">
                                        <button
                                            type="button"
                                            className="btn-cv-action btn-secondary"
                                            onClick={() => handleEdit(cv.id)}
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-cv-action btn-danger"
                                            onClick={() => deleteCV(cv.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <ShareDropdown cv={cv} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <main className="cv-main">
                {isLoading ? (
                    <p>Cargando...</p>
                ) : isEditing ? (
                    <CVEditor
                        formData={formData}
                        updateCurrentCV={updateCurrentCV}
                        setIsEditing={setIsEditing}
                        saving={saving}
                        onSave={handleSave}
                        onSaveAs={handleSaveAs}
                    />
                ) : formData ? (
                    <div
                        className="cv-pdf-container"
                        style={{ display: isOpen ? "block" : "none" }}
                    >
                        <CVPreview formData={formData} />
                    </div>
                ) : (
                    <p>No hay CV seleccionado</p>
                )}
            </main>
        </div>
    );
};

export default CVAdministrator;
