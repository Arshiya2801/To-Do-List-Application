import React, { useState } from 'react'
import { useTodo } from '../contexts/TodoContext'

function TodoForm() {
  const [todo, setTodo] = useState("")
  const { addTodo } = useTodo()
  const [error, setError] = useState(false)

  const add = (e) => {
    e.preventDefault()
    const trimmedTodo = todo.trim()
    if (!trimmedTodo) {
      setError(true)
      setTimeout(() => setError(false), 1000) // Clear error after 1 sec
      return
    }

    addTodo({ text: trimmedTodo, completed: false })
    setTodo("")
  }

  return (
    <form onSubmit={add} className="flex w-full max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Write Todo..."
        aria-label="New todo"
        className={`w-full border rounded-l-lg px-3 py-2 outline-none transition duration-200
          ${error ? 'border-red-500 ring-1 ring-red-500 animate-shake' : 'border-gray-300 focus:ring-2 focus:ring-yellow-400'}
          bg-[#2e1e0f]/50 text-white`}
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button
        type="submit"
        disabled={!todo.trim()}
        className={`rounded-r-lg px-4 py-2 bg-yellow-500 text-black font-semibold transition
          disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600`}
      >
        Add
      </button>
    </form>
  )
}

export default TodoForm
