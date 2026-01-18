import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function NavBarButton({ icon, label, to, onClick }) {
    return (
        <Link
            to={to}
            className="nav_bar_button"
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault(); // Prevent default instant navigation
                    onClick();
                }
            }}
        >
            <FontAwesomeIcon className="icon" icon={icon} />
            <span>{label}</span>
        </Link>
    );
}

export default NavBarButton;
