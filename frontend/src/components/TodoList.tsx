import { type Todo } from "../types";
import { TodoItem } from "./TodoItem";
import { LoadingSpinner } from "./LoadingSpinner";

interface TodoListProps {
  todos: Todo[];
  editingId: string | null;
  editingText: string;
  setEditingText: (text: string) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, title: string) => void;
  onSubmitEdit: () => void;
  onRefresh: () => void;
  loading: boolean;
  error: string | null;
}

export function TodoList({
  todos,
  editingId,
  editingText,
  setEditingText,
  onToggle,
  onDelete,
  onStartEdit,
  onSubmitEdit,
  onRefresh,
  loading,
  error,
}: TodoListProps) {
  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <section className="todoList">
      {loading && (
        <div className="status">
          <LoadingSpinner size="sm" />
          <span style={{ marginLeft: "0.5rem" }}>Loading…</span>
        </div>
      )}
      {error && <div className="status statusError">⚠️ {error}</div>}
      {!loading && !error && todos.length === 0 && (
        <div className="status">🎉 No todos yet — add one above.</div>
      )}

      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editingId={editingId}
            editingText={editingText}
            setEditingText={setEditingText}
            onToggle={onToggle}
            onDelete={onDelete}
            onStartEdit={onStartEdit}
            onSubmitEdit={onSubmitEdit}
            loading={loading}
          />
        ))}
      </ul>

      <footer className="footer">
        <div>
          {remaining === 0 ? "🎯 All done!" : `${remaining} task${remaining === 1 ? "" : "s"} left`}
        </div>
        <button className="textButton" onClick={onRefresh} disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : "🔄 Refresh"}
        </button>
      </footer>
    </section>
  );
}