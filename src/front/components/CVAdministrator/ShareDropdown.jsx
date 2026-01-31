import React, { useState } from "react";
import { Share2, Mail, Link2, FileDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import PortalDropdown from "./PortalDropdown";

const ShareDropdown = ({ cv }) => {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const cvUrl = `${window.location.origin}/cv/${cv.id}`;

    const toggle = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
        setOpen(prev => !prev);
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(`Te comparto mi CV: ${cv.nombre}`);
        const body = encodeURIComponent(`Hola,\n\nTe comparto mi CV:\n${cvUrl}\n\nUn saludo.`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        setOpen(false);
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`Te comparto mi CV: ${cvUrl}`);
        window.open(`https://wa.me/?text=${text}`, "_blank");
        setOpen(false);
    };
    const handleDownloadPDF = async () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const pdfurl = `${backendUrl}/cv/${cv.id}/pdf`;
        const token = localStorage.getItem("token");

        const response = await fetch(pdfurl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        setOpen(false);
    };


    return (
        <div className="share-dropdown">
            <button
                type="button"
                className="btn-cv-action btn-secondary share-trigger"
                onClick={toggle}
            >
                <Share2 size={18} />
            </button>

            <PortalDropdown open={open} position={pos}>
                <div className="share-menu open">
                    <button className="share-item" onClick={handleEmail}>
                        <Mail size={16} />
                        <span>Correo electrónico</span>
                    </button>
                    <button className="share-item" onClick={handleWhatsApp}>
                        <FaWhatsapp size={16} />
                        <span>WhatsApp</span>
                    </button>
                    <button className="share-item" onClick={handleDownloadPDF}>
                        <FileDown size={16} />
                        <span>Descargar PDF</span>
                    </button>
                </div>
            </PortalDropdown>
        </div>
    );
};

export default ShareDropdown;
