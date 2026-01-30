import { useEffect, useState } from "react";
import '../styles/stepper.css'
import { useNavigate } from "react-router-dom";
import useGetAuthorizationHeader from "../hooks/useGetAuthorizationHeader";
import { createNewRoute, removeStep } from '../Fetch/routeMapFecth'


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
    const navigate = useNavigate()
    const [stageData, setStageData] = useState(WORK_STAGES[0].value)
    const [hoverIndex, setHorverIndex] = useState(false)

    const handleAddStage = () => {
        const newStage = {
            date_completed_stage: null,
            stage_completed: false,
            stage_name: stageData
        };

        setStages(prev => [...prev, newStage]);
        setStageData(WORK_STAGES[0].value);
    }


    const handleSubmit = async () => {
        if (stages.length === 0) return;

        const stagesToSend = stages.map(({ stage_name, stage_completed, date_completed_stage }) => ({
            stage_name,
            stage_completed,
            date_completed_stage: stage_completed
                ? new Date().toISOString().split('T')[0] : null
        }));

        const data = await createNewRoute(stagesToSend, id, authorizationHeader);
        if (data.stages) {
            setStages(data.stages);
        }
        navigate(-1);
    };


    const handleRemoveStage = async (indexToRemove) => {
        const stageToRemove = stages[indexToRemove];
        if (!stageToRemove) return;

        if (stageToRemove.id) {
            const stageId = stageToRemove.id
            await removeStep(id, stageId, authorizationHeader);
        }
        setStages(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleDiscard = () => {
        setStages(prev => [...prev]);
        navigate(-1);
    };


    return (
        <div className="stages_container">
            <div className="stages_header">
                <h3>Tu proceso</h3>
                <div className="options_buttons">
                    <button onClick={handleDiscard} className="discard_btn">Descartar</button>
                    <button onClick={handleSubmit} className="save_btn">Guardar</button>
                </div>
            </div>
            <div className="selector_container">
                <select
                    value={stageData}
                    onChange={(e) => setStageData(e.target.value)}
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
                                <div onClick={() => handleRemoveStage(index)} onMouseEnter={() => setHorverIndex(index)} onMouseLeave={() => setHorverIndex(null)} className={`step ${hoverIndex === index ? 'hovered' : ''}`}>{hoverIndex === index ? 'X' : index + 1}</div>
                                <p>{label}</p>
                                {stage.stage_completed && stage.date_completed_stage && (
                                    <p>{new Date(stage.date_completed_stage).toLocaleDateString()}</p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Stepper