import { useEffect, useState } from "react";
import '../styles/stepper.css'
import { useNavigate } from "react-router-dom";
import useGetAuthorizationHeader from "../hooks/useGetAuthorizationHeader";
import { createNewRoute, getRoutes } from '../Fetch/routeMapFecth'
import { faL } from "@fortawesome/free-solid-svg-icons";

export const WORK_STAGES = [
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

const Stepper = ({ stages, id, setStages }) => {
    const authorizationHeader = useGetAuthorizationHeader()
    const [stageData, setStageData] = useState(WORK_STAGES[0].value)
    const navigate = useNavigate()
    const [hoverIndex, setHorverIndex] = useState(false)

    const handleAddStage = () => {
        setStages(prev => [...prev, stageData]);
        setStageData(WORK_STAGES[0].value);
        console.log(stages)
    }

    const handleSubmit = async (e) => {
        if (stages.length === 0) {
            console.warn("No hay stages para enviar");
            return;
        }

        const stagesList = await createNewRoute(stages, id, authorizationHeader);
        console.log('Nuevo mapa creado', stagesList);
        navigate(-1)
    }


    return (
        <div className="stages_container">
            <div className="header">
                <h3>Tu proceso</h3>
                <div className="options_buttons">
                    <button onClick={() => navigate(-1)} className="discard_btn">Descartar</button>
                    <button onClick={handleSubmit} className="save_btn">Guardar</button>
                </div>
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
                        const stageValue = stage.stage_name || stage;
                        const foundStage = WORK_STAGES.find(s => s.value === stageValue);
                        const label = foundStage ? foundStage.label : stageValue;
                        return (
                            <div key={`${stage.stage_name}-${index}`} className={`stage ${!isLast ? "connected" : ""}`}>
                                <div onMouseEnter={() => setHorverIndex(index)} onMouseLeave={() => setHorverIndex(null)} className={`step ${hoverIndex === index ? 'hovered' : ''}`}>{hoverIndex === index ? 'X' : index + 1}</div>
                                <p>{label}</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Stepper

/* date_completed_stage
: 
null
id
: 
33
stage_completed
: 
false
stage_name
: 
"initial_contact" */