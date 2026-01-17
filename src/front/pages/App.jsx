import React, { useContext } from 'react'
import Sidebar from './SideBar'
import { Link, Outlet } from 'react-router-dom'
import "../styles/app.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../hooks/UserContextProvier.jsx";
import Registration from './RegisterPage.jsx';

export default function App() {
    const { token, user } = useContext(UserContext);
    const { theme, toggleTheme } = useContext(UserContext);


    if (!token) {
        return <Registration />
    }

    return (
        <div className="main_container">
            <div className="display_component">
                <Sidebar />
                <div className="main_content">
                    <header className="header_bar">
                        <div className="user_data">
                            <FontAwesomeIcon className="notification_icon" icon={faBell} />
                            <button onClick={toggleTheme}>
                                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
                            </button>
                            <div className="user_personal_information">
                                <h3>Hello, {user.username}</h3>
                                <p>{user.email}</p>
                            </div>
                            <Link to="/perfil" >
                                <div className="user_picture"></div>
                            </Link>
                        </div>
                    </header>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
