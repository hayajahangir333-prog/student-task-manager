
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load tasks");
      const data = await response.json();
      setTasks(data);
      setError("");
    } catch {
      setError("Tasks load nahi ho rahe. Backend check karo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title required hai.");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Task add nahi hua.");
        return;
      }

      setTasks((current) => [data.task, ...current]);
      setTitle("");
      setError("");
    } catch {
      setError("Backend se connection nahi ho raha.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Task delete nahi hua.");
        return;
      }

      setTasks((current) => current.filter((task) => task._id !== id));
      setError("");
    } catch {
      setError("Task delete nahi hua. Backend check karo.");
    }
  }

  
async function toggleTask(task) {
  try {
    const response = await fetch(`${API}/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Task update nahi hua.");
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item._id === task._id ? data.task : item
      )
    );

    setError("");
  } catch {
    setError("Task update nahi hua. Backend check karo.");
  }
}


  return (
    <main className="app">
      <section className="task-card">
        <h1>Student Task Manager</h1>
        <p className="subtitle">Organize your study tasks</p>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a task..."
          />
          <button type="submit">Add Task</button>
        </form>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first task!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(task.completed)}
                    onChange={() => toggleTask(task)}
                  />
                  <span className={task.completed ? "completed" : ""}>
                    {task.title}
                  </span>
                </label>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
