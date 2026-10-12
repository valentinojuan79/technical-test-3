import { useState, useEffect, useMemo } from "react";

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem("todos");

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to load todos:", error);
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos:", error);
    }
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") {
      alert("Please enter a todo");
      return;
    }

    const newTodo = {
      id: crypto.randomUUID(),
      text: input,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setInput("");
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [todos, filter]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;

    return {
      total,
      completed,
      active: total - completed,
    };
  }, [todos]);

  return (
    <div className="app">
      <h1>My Todo List</h1>
      <div className="input-section">
        <label htmlFor="todo-input">New todo</label>

        <input
          id="todo-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
          placeholder="What needs to be done?"
        />

        <button onClick={addTodo}>Add</button>
      </div>

      <div className="filter-section">
        <button
          className={filter === "all" ? "filter-active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "active" ? "filter-active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          className={filter === "completed" ? "filter-active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <p className="empty-state">
            {todos.length === 0
              ? "No todos yet. Add your first todo!"
              : "No matching todos found."}
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <input
                id={`todo-${todo.id}`}
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />

              <label htmlFor={`todo-${todo.id}`} className="todo-text">
                {todo.text}
              </label>

              <button
                className="delete-btn"
                aria-label={`Delete ${todo.text}`}
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="stats">
        <p>
          Total: {stats.total} | Active: {stats.active} | Completed:{" "}
          {stats.completed}
        </p>
      </div>
    </div>
  );
}

export default App;
