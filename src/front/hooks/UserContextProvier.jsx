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

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null)

    };

    return (
        <UserContext.Provider value={{ token, saveToken, logOut, user }}>
            {children}
        </UserContext.Provider>
    );
}
