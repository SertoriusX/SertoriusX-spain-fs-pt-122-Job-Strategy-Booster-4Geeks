import React, { useState, createContext } from 'react';

// Create and export the context here
export const UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const saveToken = (newToken, newUser) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser)
    };

    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme;


        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null)

    };

    return (
        <UserContext.Provider value={{ token, saveToken, logOut, user, theme, toggleTheme }}>
            {children}
        </UserContext.Provider>
    );
}
