import Curriculums from "./Curriculum";
import useCVService from "../hooks/useCVService";

const CurriculumAdapter = () => {
    const cvService = useCVService();

    const handleSaveExternal = async (formData) => {
        await cvService.save(formData);
    };

    return <Curriculums onSaveExternal={handleSaveExternal} />;
};

export default CurriculumAdapter;
