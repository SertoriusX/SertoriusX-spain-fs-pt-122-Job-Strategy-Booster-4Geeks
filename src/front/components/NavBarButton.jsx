import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function NavBarButton({ icon, label, to }) {
    if (to) {
        return (
            <Link to={to} className="nav_bar_button no-underline flex items-center gap-2">
                {icon && <FontAwesomeIcon className="icon" icon={icon} />}
                <span>{label}</span>
            </Link>
        );
    }
    return (
        <button type="button" className="nav_bar_button">
            <FontAwesomeIcon className="icon" icon={icon} />
            <span>{label}</span>
        </button>
    );
}
export default NavBarButton;
