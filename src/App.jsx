import { useState, useEffect, useMemo } from 'react'
import { TodoProvider } from './contexts'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all') // all, active, completed

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now().toString(), text: todo.text, completed: false }, ...prev])
  }

  const updateTodo = (id, updatedTodo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo))
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('todos'))
    if (stored && stored.length) setTodos(stored)
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Filtering logic
  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(todo => !todo.completed)
    if (filter === 'completed') return todos.filter(todo => todo.completed)
    return todos
  }, [todos, filter])

  // Handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return
    const reordered = Array.from(todos)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setTodos(reordered)
  }

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}>
      <div className="bg-[#2e1e0f] min-h-screen py-10 px-4 font-sans flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white mb-2 text-center">TO DO LIST</h1>
        <h2 className="text-2xl font-light text-white mb-8 text-center">Let's Crush Today!</h2>

        <div className="w-full max-w-3xl bg-[#541D20] shadow-2xl rounded-2xl px-6 py-8 flex flex-col">
          <TodoForm />

          <div className="flex justify-between items-center my-4 text-white font-medium">
            <div>
              <button
                className={`mr-2 px-3 py-1 rounded-full ${
                  filter === 'all' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`mr-2 px-3 py-1 rounded-full ${
                  filter === 'active' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-3 py-1 rounded-full ${
                  filter === 'completed' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>

            <button
              className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-full font-semibold transition"
              onClick={clearCompleted}
              disabled={!todos.some(todo => todo.completed)}
              aria-disabled={!todos.some(todo => todo.completed)}
            >
              Clear Completed
            </button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  className="flex flex-col gap-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredTodos.length === 0 && (
                    <p className="text-center text-gray-400 italic mt-4">No todos to show</p>
                  )}

                  {filteredTodos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-shadow duration-300 ${
                            snapshot.isDragging ? 'shadow-2xl scale-105' : ''
                          }`}
                        >
                          <TodoItem todo={todo} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App
