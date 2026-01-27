import { useState, useEffect } from "react";

function MenuButttons({ options, onFilterChange }) {
    const [active, setActive] = useState(options[0]);

    useEffect(() => {
        if (onFilterChange) onFilterChange(active);
    }, [active, onFilterChange]);

    return (
        <div className="menu_options">
            {options.map(option => (
                <button
                    key={option}
                    className={active === option ? "active" : ""}
                    onClick={() => setActive(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

export default MenuButttons;
