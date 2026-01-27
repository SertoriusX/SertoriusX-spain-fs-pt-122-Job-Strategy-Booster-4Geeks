import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [profile, setProfile] = useState(() => {
        const savedProfile = localStorage.getItem("profile");
        return savedProfile && savedProfile !== "undefined" ? JSON.parse(savedProfile) : null;
    });

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (token && !profile) {
            axios.get(`${backendUrl}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => {
                    setProfile(response.data);
                    localStorage.setItem("profile", JSON.stringify(response.data));
                })
                .catch(error => {
                    console.error("Error loading profile:", error);
                    setProfile(null);
                });
        }
    }, [token]);

    const updateProfile = (newProfileData) => {
        setProfile(newProfileData);
        localStorage.setItem("profile", JSON.stringify(newProfileData));
    };

    const saveToken = (newToken, newUser, newProfile) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("profile", JSON.stringify(newProfile));
        setToken(newToken);
        setUser(newUser);
        setProfile(newProfile);
    };

    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme;
        return "light";
    };

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("profile");
        setToken(null);
        setUser(null);
        setProfile(null);
    };

    return (
        <UserContext.Provider
            value={{ token, saveToken, logOut, user, theme, toggleTheme, profile, updateProfile }}
        >
            {children}
        </UserContext.Provider>
    );
}
