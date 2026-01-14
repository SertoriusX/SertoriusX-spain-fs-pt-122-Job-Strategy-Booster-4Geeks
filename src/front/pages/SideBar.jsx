import NavBarButton from "../components/NavBarButton";
import "../styles/navbar.css";

import {
    faHouse,
    faClipboardList,
    faBookBookmark,
    faHandshake,
    faGear,
    faCircleQuestion,
    faRightFromBracket,
    faUserPlus,
    faRightToBracket,
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
                    <NavBarButton icon={faClipboardList} label="Postulaciones" to="/Jobs" />
                    <NavBarButton icon={faBookBookmark} label="Curriculums" to="/Curriculum" />
                    <NavBarButton icon={faHandshake} label="Entrevista" to="/Interview" />
                </div>
            </div>

            <div className="general">
                <h4>General</h4>
                <div className="tools_buttons">
                    <NavBarButton icon={faGear} label={"Ajustes"} />
                    <NavBarButton icon={faCircleQuestion} label={"Ayuda"} />
                    <NavBarButton icon={faUserPlus} label={"Register"} to="/register" />
                    <NavBarButton icon={faRightToBracket} label={"Login"} to="/login" />
                    <NavBarButton icon={faRightFromBracket} label={"Salir"} />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
