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
    faUser,
    faFileLines
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../hooks/UserContextProvier.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {

    const { token, logOut } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();
        navigate('/register');
    };

    return (
        <div className="side_bar">
            <div className="header">
                <div className="logo"></div>
                <p>Trakeando</p>
            </div>

            <div className="nav_bar">
                <h4>Menu</h4>
                <div className="nav_bar_buttons">
                    {token ? (
                        <>


                            <NavBarButton icon={faHouse} label="Home" to="/" />
                            <NavBarButton icon={faClipboardList} label="Postulaciones" to="/Jobs" />
                            <NavBarButton icon={faBookBookmark} label="Curriculums" to="/Curriculum" />
                            <NavBarButton icon={faHandshake} label="Entrevista" to="/Interview" />
                            <NavBarButton icon={faFileLines} label="Formulario" to="/formulario" />
                            <NavBarButton icon={faClipboardList} label="PostulacionesDetail" to="/jobId" />
                        </>
                    ) : null}
                </div>
            </div>

            <div className="general">
                <h4>General</h4>
                <div className="tools_buttons">
                    {token ? (
                        <>
                            <NavBarButton icon={faGear} label={"Ajustes"} />
                            <NavBarButton icon={faCircleQuestion} label={"Ayuda"} />
                            <NavBarButton icon={faUser} label="Perfil" to="/perfil" />

                            <button className="btn btn-secondary mt-2" onClick={handleLogout}> Logout</button>

                        </>
                    ) : (
                        <>
                            <NavBarButton icon={faClipboardList} label="Login" to="/register" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
