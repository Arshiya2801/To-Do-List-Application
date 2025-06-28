import React, { useState, useEffect, useRef } from 'react'
import { useTodo } from '../contexts/TodoContext'
import { FiMenu } from 'react-icons/fi' // drag handle icon

function TodoItem({ todo }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false)
  const [todoMsg, setTodoMsg] = useState(todo.text)
  const { updateTodo, deleteTodo, toggleComplete } = useTodo()
  const inputRef = useRef(null)

  useEffect(() => {
    if (isTodoEditable && inputRef.current) inputRef.current.focus()
  }, [isTodoEditable])

  const editTodo = () => {
    if (todoMsg.trim() === '') return
    updateTodo(todo.id, { ...todo, text: todoMsg.trim() })
    setIsTodoEditable(false)
  }

  const toggleCompleted = () => toggleComplete(todo.id)

  return (
    <div
      className={`flex items-center rounded-lg px-3 py-2 gap-x-3 shadow-sm duration-300 select-none ${
        todo.completed ? 'bg-gray-400 text-gray-700 line-through' : 'bg-green-600 text-white'
      }`}
    >
      {/* Drag handle */}
      <span className="cursor-move text-xl text-white mr-2" title="Drag to reorder">
        <FiMenu />
      </span>

      <input
        type="checkbox"
        className="cursor-pointer w-5 h-5"
        checked={todo.completed}
        onChange={toggleCompleted}
        aria-label={`Mark todo ${todo.text} as completed`}
      />

      <input
        ref={inputRef}
        type="text"
        className={`flex-grow bg-transparent rounded-lg outline-none border ${
          isTodoEditable ? 'border-yellow-400 px-2' : 'border-transparent'
        } ${todo.completed ? 'line-through text-gray-700' : 'text-white'}`}
        value={todoMsg}
        onChange={(e) => setTodoMsg(e.target.value)}
        readOnly={!isTodoEditable}
        aria-label="Todo text"
        onKeyDown={(e) => {
          if (e.key === 'Enter') editTodo()
          else if (e.key === 'Escape') {
            setTodoMsg(todo.text)
            setIsTodoEditable(false)
          }
        }}
      />
      {/* Edit / Save Button */}
      <button
        onClick={() => {
          if (todo.completed) return
          if (isTodoEditable) editTodo()
          else setIsTodoEditable(true)
        }}
        disabled={todo.completed}
        aria-label={isTodoEditable ? 'Save todo' : 'Edit todo'}
        className="w-8 h-8 rounded-lg border border-yellow-400 bg-yellow-300 hover:bg-yellow-400 text-black transition"
      >
        {isTodoEditable ? '💾' : '✏️'}
      </button>
      {/* Delete Button */}
      <button
        onClick={() => deleteTodo(todo.id)}
        aria-label="Delete todo"
        className="w-8 h-8 rounded-lg border border-red-400 bg-red-300 hover:bg-red-400 text-black transition"
      >
        ❌
      </button>
    </div>
  )
}

export default TodoItem
