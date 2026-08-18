import { useState, useEffect } from "react"
import "./App.css"

function App() {

  const [task, setTask] = useState("")

  const [todos, setTodos] = useState([])


  /* Get Todos */

  useEffect(function() {

    fetch("http://localhost:5000/todos")
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        setTodos(data)
      })

  }, [])


  /* Add Todo */

  async function addTask() {

    if (task === "") {
      return
    }

    const response = await fetch("http://localhost:5000/todos", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        text: task
      })
    })

    const newTodo = await response.json()

    setTodos([...todos, newTodo])

    setTask("")
  }


  /* Delete Todo */

  async function deleteTask(id) {

    await fetch("http://localhost:5000/todos/" + id, {
      method: "DELETE"
    })

    const newTodos = todos.filter(function(todo) {
      return todo._id !== id
    })

    setTodos(newTodos)
  }


  /* Complete Todo */

  async function completeTask(id, completed) {

    await fetch("http://localhost:5000/todos/" + id, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        completed: !completed
      })
    })


    const newTodos = todos.map(function(todo) {

      if (todo._id === id) {

        return {
          ...todo,
          completed: !completed
        }

      }

      return todo

    })

    setTodos(newTodos)
  }


  return (
    <div className="todo-container">

      <h1>My Todo App</h1>


      <div className="input-area">

        <input
          type="text"
          placeholder="Enter your task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button
          className="add-button"
          onClick={addTask}
        >
          Add
        </button>

      </div>


      <div className="todo-list">

        {todos.map(function(todo) {

          return (

            <div className="todo-item" key={todo._id}>

              <span
                className={todo.completed ? "todo-text completed" : "todo-text"}
                onClick={function() {
                  completeTask(todo._id, todo.completed)
                }}
              >
                {todo.text}
              </span>


              <button
                className="delete-button"
                onClick={function() {
                  deleteTask(todo._id)
                }}
              >
                Delete
              </button>

            </div>

          )

        })}

      </div>

    </div>
  )
}

export default App