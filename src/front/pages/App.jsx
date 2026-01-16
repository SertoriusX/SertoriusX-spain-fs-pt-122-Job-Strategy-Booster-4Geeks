import React, { useContext } from 'react'
import Sidebar from './SideBar'
import { Outlet } from 'react-router-dom'
import "../styles/app.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../hooks/UserContextProvier.jsx";


export default function App() {
    const { token, user } = useContext(UserContext);
    return (

        <div className="main_container">
            <Sidebar />
            <div className="display_component">


                <div className="home_display">
                    {token && user && (<>
                        <div className="header_bar">
                            <FontAwesomeIcon className="notification_icon" icon={faBell} />

                            <div className="user_data">
                                <div className="user_personal_information">
                                    <h3>Hello, {user.username}</h3>
                                    <p>{user.email}</p>
                                </div>

                                <div className="user_picture"></div>
                            </div>
                        </div>
                    </>)}


                    <Outlet />
                </div>

            </div>
        </div>
    )
}
