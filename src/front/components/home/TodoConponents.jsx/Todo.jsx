import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CreateTodo from "./AddTodo"
import ShowTodo from "./RenderTodos"
import { useState, useEffect } from "react"
import { getTodos } from "../../../Fetch/todosFetch"
import useGetAuthorizationHeader from "../../../hooks/useGetAuthorizationHeader"

export function Todo() {
    const authorizationHeader = useGetAuthorizationHeader()
    const [createMode, setCreateMode] = useState(false)
    const [todoList, setTodoList] = useState([])

    const fetchTodos = async () => {
        try {
            const todos = await getTodos(authorizationHeader)
            setTodoList(todos)
        } catch (err) {
            console.error("Error fetching todos:", err.message)
        }
        console.log(todoList)
    }

    useEffect(() => {
        console.log(todoList)
        fetchTodos()
    }, [])

    return (
        <>
            {createMode ? <CreateTodo setCreateMode={setCreateMode} refresTodo={fetchTodos} /> :
                <div className="todo_header">
                    <h2>Lista de pendientes</h2>
                    <button onClick={() => { setCreateMode(true) }}><FontAwesomeIcon icon={faPlus} /></button>
                </div>}
            <div className="todo_list_items_container">
                <ShowTodo todoList={todoList} refresTodo={fetchTodos} />
            </div>
        </>
    )
}
