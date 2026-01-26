import React from "react";
import { Edit2, Trash2, FileText, Copy } from "lucide-react";

const CVPreview = ({ formData, setIsEditing, deleteCV, cloneCV }) => {
    const downloadPDF = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        const doc = printWindow.document;

        doc.write("<html><head><title>CV</title></head><body>");
        doc.write(`<h1>${formData.nombre}</h1>`);
        doc.write(`<p>${formData.email}</p>`);
        doc.write(`<p>${formData.telefono}</p>`);
        doc.write(`<p>${formData.ubicacion}</p>`);
        doc.write("</body></html>");
        doc.close();

        setTimeout(() => printWindow.print(), 300);
    };

    return (
        <div className="cv-preview-container">
            <div className="cv-preview-header">
                <h2 className="cv-preview-title">
                    <FileText size={22} /> {formData.nombre || "CV sin título"}
                </h2>

                <div className="cv-preview-actions">
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        <Edit2 size={18} />
                    </button>

                    <button className="btn btn-secondary" onClick={cloneCV}>
                        <Copy size={18} />
                    </button>

                    <button className="btn btn-danger" onClick={deleteCV}>
                        <Trash2 size={18} />
                    </button>

                    <button className="btn btn-secondary" onClick={downloadPDF}>
                        PDF
                    </button>
                </div>
            </div>

            <div className="cv-preview-content">
                <h3>Información Personal</h3>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Teléfono:</strong> {formData.telefono}</p>
                <p><strong>Ubicación:</strong> {formData.ubicacion}</p>

                {formData.resumen && (
                    <>
                        <h3>Resumen Profesional</h3>
                        <p>{formData.resumen}</p>
                    </>
                )}

                {formData.experiencia?.length > 0 && (
                    <>
                        <h3>Experiencia Laboral</h3>
                        {formData.experiencia.map((exp, i) => (
                            <div key={i} className="cv-preview-block">
                                <p><strong>{exp.puesto}</strong> — {exp.empresa}</p>
                                <p>{exp.periodo}</p>
                                <p>{exp.descripcion}</p>
                            </div>
                        ))}
                    </>
                )}

                {formData.educacion?.length > 0 && (
                    <>
                        <h3>Educación</h3>
                        {formData.educacion.map((edu, i) => (
                            <div key={i} className="cv-preview-block">
                                <p><strong>{edu.titulo}</strong></p>
                                <p>{edu.institucion}</p>
                                <p>{edu.periodo}</p>
                            </div>
                        ))}
                    </>
                )}

                {(formData.habilidades?.length > 0 || formData.idiomas?.length > 0) && (
                    <>
                        <h3>Habilidades e Idiomas</h3>

                        {formData.habilidades?.length > 0 && (
                            <p><strong>Habilidades:</strong> {formData.habilidades.join(", ")}</p>
                        )}

                        {formData.idiomas?.length > 0 && (
                            <p><strong>Idiomas:</strong> {formData.idiomas.join(", ")}</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CVPreview;
