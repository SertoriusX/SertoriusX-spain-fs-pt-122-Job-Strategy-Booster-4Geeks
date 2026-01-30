import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ShowTodo({ todoList }) {
    return (
        todoList.map((todo, index) => {
            return (
                <div key={`${todo}-${index}`} className="todo_item">
                    <p>{todo.todo_name}</p>
                    <div className="action_buttons">
                        <button className="complete_task"><FontAwesomeIcon icon={faCheck} /> </button>
                        <button className="remove_task"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                </div>
            )
        })
    )
}

export default ShowTodo