import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CreateTodo from "./AddTodo"
import ShowTodo from "./RenderTodos"
import { useState } from "react"


export function Todo() {
    const [createMode, setCreateMode] = useState(false)
    const todoList = ['Completar las tareas asignadas por hans', 'Crear el modelo completo para el funcionamiento del todo']

    const createNewTask = () => {
        setCreateMode(true)
    }

    return (
        <>
            {createMode ? <CreateTodo setCreateMode={setCreateMode} /> :
                <div className="todo_header">
                    <h2>Lista de pendientes</h2>
                    <button onClick={createNewTask}><FontAwesomeIcon icon={faPlus} /></button>
                </div>}
            <div className="todo_list_items_container">
                <ShowTodo todoList={todoList} />
            </div>
        </>
    )
}
