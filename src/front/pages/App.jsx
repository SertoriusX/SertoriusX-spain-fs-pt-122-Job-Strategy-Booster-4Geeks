import React, { useContext } from 'react'
import Sidebar from './SideBar'
import { Outlet } from 'react-router-dom'
import "../styles/app.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../hooks/UserContextProvier.jsx";
import Registration from './RegisterPage.jsx';


export default function App() {
    const { token, user } = useContext(UserContext);
    return (
        <div className="main_container">
            {token && user && (<>
                <Sidebar />
                <div className="display_component">
                    <Outlet />
                </div>
            </>)}
            <Registration />
        </div>
    )
}
