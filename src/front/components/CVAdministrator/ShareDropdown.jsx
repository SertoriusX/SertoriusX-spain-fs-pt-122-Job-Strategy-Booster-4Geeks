import React, { useState } from "react";
import { Share2, Mail, FileDown } from "lucide-react";
import PortalDropdown from "./PortalDropdown";
import { pdf } from "@react-pdf/renderer";
import CVPDFDocument from "./CVPDFDocument";

const ShareDropdown = ({ cv }) => {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const [isGenerating, setIsGenerating] = useState(false);

    const toggle = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
        setOpen(prev => !prev);
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(`CV - ${cv?.datos?.nombre || 'Curriculum Vitae'}`);
        const body = encodeURIComponent(`Hola,\n\nTe comparto mi CV.\n\nSaludos,\n${cv?.datos?.nombre || ''}`);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
        setOpen(false);
    };

    const handleDownloadPDF = async () => {
        if (isGenerating) return;

        setIsGenerating(true);

        try {
            console.log("=== DEBUG PDF ===");
            console.log("CV completo:", cv);
            console.log("CV.datos:", cv.datos);
            console.log("Tiene foto?", cv?.datos?.foto ? "SÍ" : "NO");
            if (cv?.datos?.foto) {
                console.log("Foto inicia con:", cv.datos.foto.substring(0, 50));
                console.log("Longitud foto:", cv.datos.foto.length);
            }

            const blob = await pdf(<CVPDFDocument formData={cv.datos} />).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const fileName = cv?.datos?.nombre
                ? `CV_${cv.datos.nombre.replace(/\s+/g, '_')}.pdf`
                : `${cv?.datos?.titulo || "CV"}.pdf`;

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 100);

            setOpen(false);
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert(`Error al generar el PDF: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="share-dropdown">
            <button
                type="button"
                className="btn-cv-action btn-secondary share-trigger"
                onClick={toggle}
                title="Compartir CV"
            >
                <Share2 size={18} />
            </button>

            <PortalDropdown open={open} position={pos}>
                <div className="share-menu open">
                    <button className="share-item" onClick={handleEmail}>
                        <Mail size={16} />
                        <span>Enviar por correo</span>
                    </button>

                    <button
                        className="share-item"
                        onClick={handleDownloadPDF}
                        disabled={isGenerating}
                    >
                        <FileDown size={16} />
                        <span>{isGenerating ? "Generando PDF..." : "Descargar PDF"}</span>
                    </button>
                </div>
            </PortalDropdown>
        </div>
    );
};

export default ShareDropdown;