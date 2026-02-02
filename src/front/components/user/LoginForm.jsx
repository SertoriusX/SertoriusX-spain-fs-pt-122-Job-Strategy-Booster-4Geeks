import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import { UserContext } from "../../hooks/UserContextProvier";

function LoginForm({ changeForm }) {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const { saveToken } = useContext(UserContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        setError(null);
        setSuccess(null);
    };

    const sendLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const delay = new Promise((resolve) => setTimeout(resolve, 3000));

        try {
            const res = await axios.post(`${backendUrl}/login`, {
                username: form.username,
                password: form.password,
            });
            const [response] = await Promise.all([res, delay]);

            saveToken(response.data.access_token, response.data.user);
            setSuccess("Login successful!");
            setError(null);
            setForm({
                username: "",
                password: "",
            });
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Something went wrong with your login");
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <div className="form_container">
                    <form className="login" onSubmit={sendLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <input className="log_in_btn" type="submit" value="Iniciar sesión" />
                    </form>

                    {success && <p style={{ color: "green" }}>{success}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <p>
                        ¿Aún no tienes una cuenta?{" "}
                        <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={changeForm}
                        >
                            Crear cuenta
                        </span>
                    </p>
                </div>
            )}
        </>
    );
}

export default LoginForm;
