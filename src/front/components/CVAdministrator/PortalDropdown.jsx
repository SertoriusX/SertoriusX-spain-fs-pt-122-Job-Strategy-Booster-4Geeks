import ReactDOM from "react-dom";

export default function PortalDropdown({ children, open, position }) {
    if (!open) return null;

    return ReactDOM.createPortal(
        <div
            style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                zIndex: 9999
            }}
        >
            {children}
        </div>,
        document.body
    );
}
