import React from "react";

const ModalAgregarCV = ({ cvList, onSelect, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h2 className="modal-title">Seleccionar CV para copiar datos</h2>

                <ul className="modal-cv-list">
                    {cvList.map((cv) => (
                        <li
                            key={cv.id}
                            className="modal-cv-item"
                            onClick={() => onSelect(cv.id)}
                        >
                            <span>{cv.datos.titulo || "Sin título"}</span>
                            <span className="modal-date">
                                {cv.created_at ? new Date(cv.created_at).toLocaleDateString() : ""}
                            </span>
                        </li>
                    ))}
                </ul>

                <button className="modal-close-btn" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ModalAgregarCV;
