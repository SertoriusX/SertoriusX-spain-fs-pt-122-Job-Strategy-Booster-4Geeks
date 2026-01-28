import { WORK_STAGES } from './CreateRouteMap'

const RouteMapPreview = ({ stages }) => (
    <div className="stages_container">
        <div className="header">
            <h3>Tu proceso</h3>
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
                            <div className="step">{index + 1}</div>
                            <p>{label}</p>
                        </div>
                    );
                })
            )}
        </div>
    </div>
);

export default RouteMapPreview