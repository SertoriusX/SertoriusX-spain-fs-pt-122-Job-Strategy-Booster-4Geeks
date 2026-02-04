import { WORK_STAGES } from './CreateRouteMap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { updateStage } from '../Fetch/routeMapFecth';
import useGetAuthorizationHeader from '../hooks/useGetAuthorizationHeader';

const RouteMapPreview = ({ stages, id, setStages, isEdit }) => {
    const authorizationHeader = useGetAuthorizationHeader();

    const handleStageUpdate = async (action) => {

        const updatedStage = await updateStage(id, action, authorizationHeader);
        if (!updatedStage || !updatedStage.stage) return;

        setStages(prevStages => {
            return prevStages.map(stage =>
                stage.id === updatedStage.stage.id ? updatedStage.stage : stage
            );
        });

    };

    return (
        <div className="stages_container">
            <div className="stages_header">
                <h3>Tu proceso</h3>
                {!isEdit && (<div className="action_buttons">
                    <button onClick={() => handleStageUpdate('prev')}>
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </button>
                    <button onClick={() => handleStageUpdate('next')}>
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </button>
                </div>)}
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
                            <div
                                key={`${stage.stage_name}-${index}`}
                                className={`stage ${stage.stage_completed ? "completed" : ""} ${!isLast ? "connected" : ""}`}
                            >
                                <div className="step">{index + 1}</div>
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

export default RouteMapPreview;
