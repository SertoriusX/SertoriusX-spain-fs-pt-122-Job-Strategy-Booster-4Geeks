import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chart }) {
    const ref = useRef(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: "default"
        });

        if (ref.current) {
            mermaid.contentLoaded();
        }
    }, [chart]);

    return (
        <div ref={ref} className="mermaid">
            {chart}
        </div>
    );
}
