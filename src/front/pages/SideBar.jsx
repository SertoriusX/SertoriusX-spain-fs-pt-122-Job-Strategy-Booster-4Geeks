import React, { useState, useContext } from "react";
import NavBarButton from "../components/navbar/NavBarButton.jsx";
import "../styles/navbar.css";

import {
    faHouse,
    faClipboardList,
    faBookBookmark,
    faHandshake,
    faGear,
    faCircleQuestion,
    faFileLines,
    faInfoCircle
} from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "../hooks/UserContextProvier.jsx";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

function Sidebar() {


    const [loading, setLoading] = useState(false);
    const { logOut } = useContext(UserContext);
    const navigate = useNavigate();

    const handleNavigation = (to) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(to);
        }, 1500);
    };

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            logOut();
            setLoading(false);
            navigate("/register");
        }, 1500);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="side_bar">
            <div className="header">
                <div className="logo"></div>
                <p>Trakeando</p>
            </div>

            <div className="nav_bar">
                <h4>Menu</h4>
                <div className="nav_bar_buttons">
                    <NavBarButton
                        icon={faHouse}
                        label="Home"
                        to="/"
                        onClick={() => handleNavigation("/")}
                    />



                    <NavBarButton
                        icon={faClipboardList}
                        label="Postulaciones"
                        to="/Jobs"
                        onClick={() => handleNavigation("/Jobs")}
                    />
                    <NavBarButton
                        icon={faBookBookmark}
                        label="Curriculums"
                        to="/Curriculum"
                        onClick={() => handleNavigation("/Curriculum")}
                    />
                    <NavBarButton
                        icon={faHandshake}
                        label="Entrevista"
                        to="/Interview"
                        onClick={() => handleNavigation("/Interview")}
                    />

                </div>
            </div>

            <div className="general">
                <h4>General</h4>
                <div className="tools_buttons">
                    <NavBarButton
                        icon={faInfoCircle}
                        label="About"
                        to="/about"
                        onClick={() => handleNavigation("/about")}
                    />
                    <NavBarButton
                        icon={faGear}
                        label={"Ajustes"}
                        to="/settings"
                        onClick={() => handleNavigation("/settings")}
                    />
                    <NavBarButton
                        icon={faCircleQuestion}
                        label={"Ayuda"}
                        to="/help"
                        onClick={() => handleNavigation("/help")}
                    />
                    <button className="btn btn-secondary mt-2" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
