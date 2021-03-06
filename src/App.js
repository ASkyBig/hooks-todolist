import React, {useCallback, useState, useRef, useEffect, memo} from 'react';
import './App.css'

let idSeq = Date.now()

const Control = memo((props) => {
    console.log('control props', props)
    const inputRef = useRef(null)
    const { addTodo } = props

    const onSubmit =(e) => {
        e.preventDefault()
        const newText = inputRef.current.value.trim()
        if (newText.length === 0) {
            return
        }
        addTodo({
            id: ++idSeq,
            text: newText,
            complete: false
        })

        inputRef.current.value =''
    }
    return <div className="control">
        <h1>todos</h1>
        <form onSubmit={onSubmit}>
            <input type='text' ref={inputRef} className="new-todo" placeholder="new thing to be done"/>
        </form>
    </div>
})
const TodoItem = memo((props) => {
    const {
        todo: {
            id,
            text,
            complete
        },
        toggleTodo,
        removeTodo
    } = props
    const onChange = () => {
        toggleTodo(id)
    }
    const onRemove = () => {
        removeTodo(id)
    }

    return (
        <li className="todo-item">
            <input type="checkbox" onChange={onChange} checked={complete}/>
            <label className={complete ? 'complete': ''}>{text}</label>
            <button onClick={onRemove}>&#xd7;</button>
        </li>
    )
})

const Todos = memo((props) => {
    const { todos, toggleTodo, removeTodo } = props
    return (
        <ul>
            {
                todos.map(todo => {
                    return (
                        <TodoItem key={todo.id} todo={todo} removeTodo={removeTodo} toggleTodo={toggleTodo}/>
                    )
                })
            }
        </ul>
    )
})

function TodoList() {
    const [todos, setTodos] = useState([])
    const addTodo = useCallback((todo) => {
        setTodos(todos => [...todos, todo])
    }, [])
    const removeTodo = useCallback((id) => {
        setTodos(todos => todos.filter(todo => {
            return todo.id !== id
        }))
    }, [])

    const toggleTodo = useCallback((id) => {
        setTodos(todos => todos.map(todo => {
            return todo.id === id
                ? {
                    ...todo,
                    complete: !todo.complete
                }
                : todo
        }))
    }, [])

    useEffect(() => {
        console.log("localStorage.getItem('todos')", localStorage.getItem('todos'))
        const todos = JSON.parse(localStorage.getItem('todos')) || []
        setTodos(todos)
    }, [])

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

  return (
      <div className="todo-list">
        <Control addTodo={addTodo}/>
        <Todos removeTodo={removeTodo} toggleTodo={toggleTodo} todos={todos}/>
      </div>
  )
}

function App() {
  return (
    <div className="App">
     <TodoList/>
    </div>
  );
}

export default App;
