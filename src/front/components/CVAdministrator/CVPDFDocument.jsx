import React from "react";
import { Document, Page, Text, Image, StyleSheet, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: "#333"
    },
    headerSection: {
        backgroundColor: "#1e3a8a",
        paddingTop: 40,
        paddingBottom: 30,
        paddingHorizontal: 50
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center"
    },
    photoContainer: {
        marginRight: 25
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        objectFit: "cover",
        border: "4px solid white"
    },
    headerInfo: {
        flex: 1
    },
    name: {
        fontSize: 28,
        fontFamily: "Helvetica-Bold",
        color: "white",
        marginBottom: 8
    },
    contactRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
        marginBottom: 4
    },
    contactText: {
        fontSize: 10,
        color: "#e0e7ff"
    },
    separator: {
        color: "#93c5fd",
        marginHorizontal: 8
    },
    contentSection: {
        paddingHorizontal: 50,
        paddingVertical: 30
    },
    section: {
        marginBottom: 25
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Helvetica-Bold",
        color: "#1e3a8a",
        marginBottom: 12,
        paddingBottom: 6,
        borderBottom: "2px solid #3b82f6"
    },
    sectionContent: {
        fontSize: 10,
        lineHeight: 1.6,
        color: "#4b5563",
        textAlign: "justify"
    },
    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },
    skillBadge: {
        backgroundColor: "#eff6ff",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        border: "1px solid #3b82f6"
    },
    skillText: {
        fontSize: 9,
        color: "#1e3a8a",
        fontFamily: "Helvetica-Bold"
    },
    entryContainer: {
        marginBottom: 15
    },
    entryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4
    },
    entryTitle: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#1f2937"
    },
    entryDate: {
        fontSize: 9,
        color: "#6b7280",
        fontStyle: "italic"
    },
    entrySubtitle: {
        fontSize: 10,
        color: "#3b82f6",
        marginBottom: 6
    },
    entryDescription: {
        fontSize: 9,
        color: "#4b5563",
        lineHeight: 1.5,
        textAlign: "justify"
    },
    listItem: {
        flexDirection: "row",
        marginBottom: 6
    },
    bullet: {
        width: 6,
        height: 6,
        backgroundColor: "#3b82f6",
        borderRadius: 3,
        marginRight: 10,
        marginTop: 4
    },
    listText: {
        flex: 1,
        fontSize: 10,
        color: "#4b5563"
    }
});

const CVPDFDocument = ({ formData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerSection}>
                    <View style={styles.headerContent}>
                        {formData.foto && (
                            <View style={styles.photoContainer}>
                                <Image src={formData.foto} style={styles.photo} />
                            </View>
                        )}
                        <View style={styles.headerInfo}>
                            <Text style={styles.name}>
                                {formData.nombre || "Nombre Completo"}
                            </Text>
                            <View style={styles.contactRow}>
                                {formData.email && (
                                    <View style={styles.contactItem}>
                                        <Text style={styles.contactText}>{formData.email}</Text>
                                    </View>
                                )}
                                {formData.email && formData.telefono && (
                                    <Text style={styles.separator}>|</Text>
                                )}
                                {formData.telefono && (
                                    <View style={styles.contactItem}>
                                        <Text style={styles.contactText}>{formData.telefono}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.contactRow}>
                                {formData.ubicacion && (
                                    <View style={styles.contactItem}>
                                        <Text style={styles.contactText}>{formData.ubicacion}</Text>
                                    </View>
                                )}
                                {formData.ubicacion && formData.linkedin && (
                                    <Text style={styles.separator}>|</Text>
                                )}
                                {formData.linkedin && (
                                    <View style={styles.contactItem}>
                                        <Text style={styles.contactText}>{formData.linkedin}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.contentSection}>
                    {formData.resumen && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Resumen Profesional</Text>
                            <Text style={styles.sectionContent}>{formData.resumen}</Text>
                        </View>
                    )}

                    {Array.isArray(formData.experiencia) && formData.experiencia.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
                            {formData.experiencia.map((exp, idx) => (
                                <View style={styles.entryContainer} key={idx}>
                                    <View style={styles.entryHeader}>
                                        <Text style={styles.entryTitle}>{exp.puesto || "Puesto"}</Text>
                                        <Text style={styles.entryDate}>
                                            {exp.fechaInicio || ""} - {exp.fechaFin || "Presente"}
                                        </Text>
                                    </View>
                                    <Text style={styles.entrySubtitle}>
                                        {exp.empresa || "Empresa"} {exp.ubicacion ? `• ${exp.ubicacion}` : ""}
                                    </Text>
                                    {exp.descripcion && (
                                        <Text style={styles.entryDescription}>{exp.descripcion}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {Array.isArray(formData.educacion) && formData.educacion.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Estudios</Text>
                            {formData.educacion.map((edu, idx) => (
                                <View style={styles.entryContainer} key={idx}>
                                    <View style={styles.entryHeader}>
                                        <Text style={styles.entryTitle}>{edu.titulo || "Título"}</Text>
                                        <Text style={styles.entryDate}>
                                            {edu.fechaInicio || ""} - {edu.fechaFin || ""}
                                        </Text>
                                    </View>
                                    <Text style={styles.entrySubtitle}>
                                        {edu.institucion || "Institución"}
                                    </Text>
                                    {edu.descripcion && (
                                        <Text style={styles.entryDescription}>{edu.descripcion}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {Array.isArray(formData.habilidades) && formData.habilidades.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Habilidades</Text>
                            <View style={styles.skillsContainer}>
                                {formData.habilidades.map((skill, idx) => (
                                    <View style={styles.skillBadge} key={idx}>
                                        <Text style={styles.skillText}>{skill}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {Array.isArray(formData.idiomas) && formData.idiomas.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Idiomas</Text>
                            {formData.idiomas.map((idioma, idx) => (
                                <View style={styles.listItem} key={idx}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.listText}>
                                        {idioma.idioma || ""} - {idioma.nivel || ""}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {Array.isArray(formData.certificaciones) && formData.certificaciones.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Certificaciones</Text>
                            {formData.certificaciones.map((cert, idx) => (
                                <View style={styles.listItem} key={idx}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.listText}>
                                        {cert.nombre || ""} {cert.emisor ? `- ${cert.emisor}` : ""} {cert.fecha ? `(${cert.fecha})` : ""}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default CVPDFDocument;
