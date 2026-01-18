import React, { useState, createContext } from 'react';

// Create and export the context here
export const UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const saveToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

 const logOut = () => {
    localStorage.removeItem("token");
    setToken(null);
};

    return (
        <UserContext.Provider value={{ token, saveToken, logOut }}>
            {children}
        </UserContext.Provider>
    );
}
