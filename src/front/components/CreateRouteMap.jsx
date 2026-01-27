import { useState } from "react";
import '../styles/stepper.css'
import { useNavigate } from "react-router-dom";

const WORK_STAGES = [
    { value: "initial_contact", label: "Toma de contacto inicial" },
    { value: "hr_interview", label: "Entrevista RH" },
    { value: "technical_test", label: "Prueba técnica" },
    { value: "technical_interview", label: "Entrevista técnica" },
    { value: "onsite_technical_test", label: "Prueba técnica presencial" },
    { value: "practical_test", label: "Prueba práctica" },
    { value: "evaluation", label: "Evaluación" },
    { value: "results_review", label: "Revisión de resultados" },
    { value: "final_interview", label: "Entrevista final" },
    { value: "internal_validation", label: "Validación interna" },
    { value: "offer", label: "Oferta" },
    { value: "decision", label: "Decisión" },
    { value: "process_closure", label: "Cierre del proceso" }
];

const Stepper = () => {
    const [stageData, setStageData] = useState(WORK_STAGES[0].value)
    const [stages, setStages] = useState([])
    const navigate = useNavigate()

    const handleAddStage = () => {
        setStages(prev => [...prev, stageData]);
        setStageData(WORK_STAGES[0].value);
        console.log(stages)
    }

    return (
        <div className="stages_container">
            <div className="header">
                <h2>Tu proceso</h2>
            </div>
            <div className="selector_container">
                <select
                    value={stageData}
                    onChange={(e) => setStageData(prev => (e.target.value))}
                >
                    {WORK_STAGES.map(stage => (
                        <option key={stage.value} value={stage.value}>
                            {stage.label}
                        </option>
                    ))}
                </select>

                <button onClick={handleAddStage} className="add_stage_btn" >
                    Añadir etapa
                </button>
            </div>
            <div className="stepper">
                {stages.length === 0 ? (
                    <h4>No tienes un proceso creado</h4>
                ) : (
                    stages.map((stage, index) => {
                        const isLast = index === stages.length - 1;
                        const label = WORK_STAGES.find(s => s.value === stage).label;

                        return (
                            <div key={`${stage}-${index}`} className={`stage ${!isLast ? "connected" : ""}`}>
                                <div className="step">{index + 1}</div>
                                <p>{label}</p>
                            </div>
                        );
                    })
                )}
            </div>

            <footer className="options_buttons">
                <button onClick={() => navigate(-1)} className="discard_btn">Descartar</button>
                <button className="save_btn">Guardar</button>
            </footer>
        </div>
    );
};

export default Stepper;