import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './SideBar';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "../styles/app.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../hooks/UserContextProvier.jsx";
import Registration from './RegisterPage.jsx';
import LoadingScreen from "../components/LoadingScreen";
import { translatePage as translatePageFunc } from "../hooks/usePageTranslate.js";
import NavBarButton from '../components/navbar/NavBarButton.jsx';
import "../styles/navbar.css";
import {
    faSun, faMoon
} from "@fortawesome/free-solid-svg-icons";
import { ProfileHook } from '../hooks/ProfileHook.jsx';
import ProfileRead from '../components/ProfileComponents/ProfileRead.jsx';
export default function App() {
    const { token, user, theme, toggleTheme, profile } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("en");
    const [isEditing, setIsEditing] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [open, setOpen] = useState(false);
    const { profile: prof, handleChange, inputValue, setInputValue, handleKeyDown, removeTag, handleSend, parseSkills, form } = ProfileHook()

    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "bg,es,de",
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                },
                "google_translate_element"
            );
        };

        const script = document.createElement("script");
        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            delete window.googleTranslateElementInit;
        };
    }, []);
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        translatePageFunc(lang);
    };

    if (!token) {
        return <Registration />;
    }

    if (loading) {
        return <LoadingScreen />;
    }
    const handleNavigation = (to) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(to);
        }, 1500);
    };
    return (
        <div className="main_container" id="google_translate_element">
            <div className="display_component">
                <Sidebar
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />

                <div className="main_content">
                    <div className="header_bar">
                        <div className="user_data">
                            {/*
                        <FontAwesomeIcon
                            className="notification_icon"
                            icon={faBell}
                            onClick={() => setOpen(!open)}
                        />
                        */}

                            {/*
{open && (
    <div className="notification-dropdown">
        <h5 onClick={() => {
            handleNavigation("/status-entrevista");
            setOpen(!open)
        }}>
            Entrevista
        </h5>
        <h5>New message received</h5>
        <h5>Profile updated</h5>
    </div>
)}
*/}
                            <NavBarButton
                                icon={theme === "dark" ? faSun : faMoon}
                                className="theme_btn"
                                onClick={toggleTheme}
                            />
                            <select
                                value={language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                style={{ marginLeft: "10px", padding: "5px" }}
                            >
                                <option value="en">EN</option>
                                <option value="es">ES</option>
                                <option value="bg">BG</option>
                                <option value="de">DE</option>
                            </select>

                            <div className="user_personal_information" style={{ marginLeft: "10px" }}>
                                <p>Hello, {profile ? (<>{profile?.first_name} {profile?.last_name}</>) : (<><h5>You dont have yet profile</h5></>)}</p>
                                <p>{user?.email}</p>
                            </div>
                            {!open ? (<div className="" onClick={() => setOpen(true)}>
                                {profile ? (<img className='user_picture '
                                    src={profile?.img_profile ? `${backendUrl}/uploads/${profile.img_profile}` : '/img/default-profile.png'}
                                    alt={profile?.first_name || "profile"}
                                    onError={e => { e.target.onerror = null; e.target.src = '/img/default-profile.png'; }}
                                />) : (<Link to="/perfil">
                                    <div className="user_picture"></div>
                                </Link>)}
                            </div>) : (<div className="" onClick={() => setOpen(true)}>
                                {profile ? (<img className='user_picture '
                                    src={profile?.img_profile ? `${backendUrl}/uploads/${profile.img_profile}` : '/img/default-profile.png'}
                                    alt={profile?.first_name || "profile"}
                                    onError={e => { e.target.onerror = null; e.target.src = '/img/default-profile.png'; }}
                                />) : (<Link to="/perfil">
                                    <div className="user_picture"></div>
                                </Link>)}
                            </div>)}

                            {open ? (<><ProfileRead
                                profile={prof} parseSkills={parseSkills} navigate={navigate}

                                setOpen={setOpen}
                            /></>) : (<></>)}
                        </div>
                    </div>
                    <Outlet context={{ isEditing, setIsEditing }} />

                </div>
            </div>
        </div>
    );
}
