import React from "react";
import { FileText, Plus, Trash2, Pencil } from "lucide-react";

const Sidebar = ({
    cvList,
    selectedCVId,
    selectCV,
    createNewCV,
    deleteCV,
    setIsEditing,
    isEditing
}) => {
    if (isEditing) return null;

    const selectedCV = cvList.find((cv) => cv.id === selectedCVId);

    return (
        <aside className="cv-sidebar">
            <div className="cv-sidebar-header">
                <h2 className="cv-sidebar-title">Mis CVs</h2>

                <button className="btn btn-primary btn-full" onClick={createNewCV}>
                    <Plus size={18} /> Nuevo CV
                </button>
            </div>

            <div className="cv-sidebar-list">
                {cvList.length === 0 && (
                    <p className="cv-sidebar-empty">No tienes CVs creados</p>
                )}

                {cvList.map((cv) => (
                    <div
                        key={cv.id}
                        className={`cv-sidebar-item ${cv.id === selectedCVId ? "active" : ""}`}
                        onClick={() => selectCV(cv.id)}
                    >
                        <FileText size={18} />
                        <span>{cv.nombre || "CV sin título"}</span>
                    </div>
                ))}
            </div>

            {selectedCV && (
                <div className="cv-sidebar-actions">
                    <button
                        className="btn btn-secondary btn-full"
                        onClick={() => setIsEditing(true)}
                    >
                        <Pencil size={16} /> Editar
                    </button>

                    <button
                        className="btn btn-danger btn-full"
                        onClick={() => deleteCV(selectedCV.id)}
                    >
                        <Trash2 size={16} /> Eliminar
                    </button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
