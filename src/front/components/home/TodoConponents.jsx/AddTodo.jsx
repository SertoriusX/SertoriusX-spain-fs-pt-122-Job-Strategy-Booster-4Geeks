import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createNewTodo } from "../../../Fetch/todosFetch";
import useGetAuthorizationHeader from "../../../hooks/useGetAuthorizationHeader";
import { useState } from "react";


function CreateTodo({ setCreateMode }) {
    const authorizationHeader = useGetAuthorizationHeader()
    const [todo, setTodo] = useState({
        todo_name: '',
        todo_complete: false
    })

    const handleChange = (e) => {
        setTodo({
            ...todo,
            todo_name: e.target.value
        });
    }

    const saveTodo = async () => {
        if (!todo.todo_name.trim()) return;
        const newTodo = await createNewTodo(todo, authorizationHeader);
        console.log(newTodo)
        setCreateMode(false);
    }
    return (
        <div className="add_todo_container">
            <input value={todo.todo_name} onChange={handleChange} type="text" placeholder="Añade un nuevo pendiente" />
            <button className="save_todo" onClick={saveTodo}><FontAwesomeIcon icon={faFloppyDisk} /></button>
        </div>
    )
}

export default CreateTodo