import React, { useState, useEffect } from "react";
import "../styles/register.css";

import LoadingScreen from "../components/LoadingScreen";
import LoginForm from "../components/user/LoginForm";
import SignupForm from "../components/user/SignupForm"
function Registration() {
    const [loading, setLoading] = useState(true);
    const [formType, setFormType] = useState("login");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const changeForm = () => {
        setLoading(true);
        setTimeout(() => {
            setFormType(prev => (prev === "login" ? "signup" : "login"));
            setLoading(false);
        }, 1500);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="container">
            <div className="log_in_page">
                <div className="registration_form">
                    <div className="header">
                        <div className="logo"></div>
                        <section className="details">
                            <h1>Trackeando</h1>
                            <p>Manten al dia tus candidaturas</p>
                        </section>
                    </div>

                    {formType === "login" ? (
                        <LoginForm changeForm={changeForm} />
                    ) : (
                        <SignupForm changeForm={changeForm} />
                    )}
                </div>

                <div className="img"></div>
            </div>
        </div>
    );
}

export default Registration;
