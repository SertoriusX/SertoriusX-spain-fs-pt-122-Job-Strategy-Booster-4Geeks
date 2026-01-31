import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteTodo, updateTodo } from "../../../Fetch/todosFetch";
import useGetAuthorizationHeader from "../../../hooks/useGetAuthorizationHeader";

function ShowTodo({ todoList, refresTodo }) {
    const authorizationHeader = useGetAuthorizationHeader()
    const handleDelete = async (id) => {
        await deleteTodo(id, authorizationHeader)
        refresTodo()
    }

    const handleUpdate = async (id) => {
        await updateTodo(id, authorizationHeader)
        refresTodo()
    }
    return (
        todoList.map((todo, index) => {
            return (
                <div key={todo.id} className="todo_item">
                    <p className={todo.todo_complete ? `complete` : ''}>{todo.todo_name}</p>
                    <div className="action_buttons">
                        <button onClick={() => handleUpdate(todo.id)} className="complete_task"><FontAwesomeIcon icon={faCheck} /> </button>
                        <button onClick={() => handleDelete(todo.id)} className="remove_task"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                </div>
            )
        })
    )
}

export default ShowTodo