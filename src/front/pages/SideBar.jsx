import NavBarButton from "../components/NavBarButton";
import "../styles/layout.css";

import { Link } from 'react-router-dom';

import {
    faHouse,
    faClipboardList,
    faBookBookmark,
    faHandshake,
    faGear,
    faCircleQuestion,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";


function Sidebar() {
    return (
        <div className="side_bar">
            <div className="header">
                <div className="logo"></div>
                <p>Trakeando</p>
            </div>

            <div className="nav_bar">
                <h4>Menu</h4>
                <div className="nav_bar_buttons">
                    <NavBarButton icon={faHouse} label="Home" to="/" />
                    <NavBarButton icon={faClipboardList} label="Postulaciones" to="/register" />
                    <NavBarButton icon={faBookBookmark} label="Curriculums" />
                    <NavBarButton icon={faHandshake} label="Entrevista" />
                </div>
            </div>

            <div className="general">
                <h4>General</h4>
                <div className="tools_buttons">
                    <NavBarButton icon={faGear} label={"Ajustes"} />
                    <NavBarButton icon={faCircleQuestion} label={"Ayuda"} />
                    <NavBarButton icon={faRightFromBracket} label={"Salir"} />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
