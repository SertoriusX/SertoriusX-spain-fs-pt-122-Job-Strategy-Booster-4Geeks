import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function CreateTodo({ setCreateMode }) {

    const saveTodo = () => {
        setCreateMode(false)
    }

    return (
        <div className="add_todo_container">
            <input type="text" placeholder="Añade un nuevo pendiente" />
            <button className="save_todo" onClick={saveTodo}><FontAwesomeIcon icon={faFloppyDisk} /></button>
        </div>
    )
}

export default CreateTodo