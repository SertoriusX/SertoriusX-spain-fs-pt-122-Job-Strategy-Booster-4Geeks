import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContextProvier";
import axios from "axios";

export const ProfileHook = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { token, updateProfile } = useContext(UserContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        bio: "",
        img_profile: null,
        skill: [],
    });

    useEffect(() => {
        if (!token) return;
        axios
            .get(`${backendUrl}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setProfile(res.data))
            .catch((err) => console.error(err));
    }, [token, backendUrl]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const val = inputValue.trim();
            if (val && !form.skill.includes(val)) {
                setForm((prev) => ({ ...prev, skill: [...prev.skill, val] }));
            }
            setInputValue("");
        }
    };

    const removeTag = (indexToRemove) => {
        setForm((prev) => ({
            ...prev,
            skill: prev.skill.filter((_, i) => i !== indexToRemove),
        }));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (key === "skill") formData.append("skill", JSON.stringify(value));
            else if (value !== null) formData.append(key, value);
        });
        try {
            const res = await axios.post(`${backendUrl}/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(res.data);
            setForm({
                first_name: "",
                last_name: "",
                bio: "",
                img_profile: null,
                skill: [],
            });

            updateProfile(res.data)

        } catch (err) {
            console.error(err);
        }
    };

    const parseSkills = (str) => {
        try {
            return JSON.parse(str);
        } catch {
            return typeof str === "string" ? str.split(",").map((s) => s.trim()) : [];
        }
    };


    return { setInputValue, navigate, profile, form, inputValue, handleChange, handleKeyDown, removeTag, handleSend, parseSkills }

}