import { useEffect, useMemo, useState } from "react";
import api from "./api/todos";
import { type Todo, type Filter } from "./types";
import { TodoInput, Filters, TodoList, ThemeToggle } from "./components";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    void refreshTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [filter, todos]);

  async function refreshTodos() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.list();
      setTodos(data);
    } catch (err) {
      setError("Unable to load todos. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    const title = newTitle.trim();
    if (!title) return;
    setLoading(true);
    setError(null);
    try {
      const next = await api.create(title);
      setTodos((current) => [next, ...current]);
      setNewTitle("");
    } catch (err) {
      setError("Unable to create todo. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTodo(todo: Todo) {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.update(todo.id, { completed: !todo.completed });
      setTodos((current) => current.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError("Unable to update todo.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTodo(id: string) {
    setLoading(true);
    setError(null);
    try {
      await api.remove(id);
      setTodos((current) => current.filter((t) => t.id !== id));
    } catch (err) {
      setError("Unable to delete todo.");
    } finally {
      setLoading(false);
    }
  }

  async function submitEdit() {
    if (!editingId) return;
    const title = editingText.trim();
    if (!title) {
      setEditingId(null);
      setEditingText("");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updated = await api.update(editingId, { title });
      setTodos((current) => current.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError("Unable to update todo.");
    } finally {
      setLoading(false);
      setEditingId(null);
      setEditingText("");
    }
  }

  function startEdit(id: string, title: string) {
    setEditingId(id);
    setEditingText(title);
  }

  return (
    <>
      <ThemeToggle />
      <div className="app">
        <header className="header">
          <h1 className="title">✨ Todo</h1>
          <p className="subtitle">A modern, lightweight todo list that syncs with a local API.</p>
        </header>

        <main className="card">
          <TodoInput
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            onAdd={addTodo}
            loading={loading}
          />

          <Filters currentFilter={filter} onFilterChange={setFilter} />

          <TodoList
            todos={visibleTodos}
            editingId={editingId}
            editingText={editingText}
            setEditingText={setEditingText}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onStartEdit={startEdit}
            onSubmitEdit={submitEdit}
            onRefresh={refreshTodos}
            loading={loading}
            error={error}
          />
        </main>

        <footer className="credit">
          🚀 Built with React + TypeScript • Backend powered by Express
        </footer>
      </div>
    </>
  );
}

export default App;
