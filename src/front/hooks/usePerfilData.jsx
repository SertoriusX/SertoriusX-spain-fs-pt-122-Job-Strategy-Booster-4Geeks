import { useState } from "react";

export const usePerfilData = () => {
    const [profileData, setProfileData] = useState({
        name: "Yovanna",
        title: "Product & UX Strategist",
        skills: ["React", "Tailwind", "UX", "Product Design"],
        jobPortals: [
            { name: "LinkedIn", url: "https://www.linkedin.com" },
            { name: "InfoJobs", url: "https://www.infojobs.net" }
        ],
        upcomingInterviews: [],
        applications: [
            {
                company: "Microsoft",
                position: "Frontend Developer",
                status: "En proceso",
                timeline: [
                    { date: "03/01", event: "apliqué" },
                    { date: "05/01", event: "me llamaron" },
                    { date: "07/01", event: "entrevista" },
                    { date: "10/01", event: "prueba técnica" }
                ]
            },
            {
                company: "Google",
                position: "UX Engineer",
                status: "Entrevista técnica",
                timeline: [
                    { date: "02/01", event: "apliqué" },
                    { date: "06/01", event: "me llamaron" },
                    { date: "09/01", event: "entrevista" }
                ]
            }
        ]
    });

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return {
        profileData,
        handleInputChange
    };
};
