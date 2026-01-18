import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import axios from "axios";

function SignupForm({ changeForm }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        isAccepted: false,
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setError(null);
        setSuccess(null);
    };

    const sendRegister = async (e) => {
        e.preventDefault();

        // Basic validation
        if (form.password !== form.confirmPassword) {
            setError("Your passwords do not match");
            return;
        }

        if (!form.isAccepted) {
            setError("You must accept the terms");
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/register`, {
                username: form.username,
                email: form.email,
                password: form.password,
            });

            setSuccess(response.data.message)
            setError(null);

            setForm({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                isAccepted: false,
            });
        } catch (err) {
            console.error(err);
            setError("Something went wrong with your registration");
            setSuccess(null);
        }
    };

    return (
        <div className="form_container">
            <form className="register" onSubmit={sendRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={form.email}
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        name="isAccepted"
                        checked={form.isAccepted}
                        onChange={handleChange}
                    />{" "}
                    Accept terms and conditions
                </label>

                <input className="create_account" type="submit" value="Register" />
            </form>

            <button className="signup_btn" onClick={() => alert("Google signup flow")}>
                Sign up with <FontAwesomeIcon icon={faGoogle} />
            </button>

            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>
                Already have an account?{" "}
                <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={changeForm}
                >
                    Log in here
                </span>
            </p>
        </div>
    );
}

export default SignupForm;
