import { type Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  editingId: string | null;
  editingText: string;
  setEditingText: (text: string) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, title: string) => void;
  onSubmitEdit: () => void;
  loading: boolean;
}

export function TodoItem({
  todo,
  editingId,
  editingText,
  setEditingText,
  onToggle,
  onDelete,
  onStartEdit,
  onSubmitEdit,
  loading,
}: TodoItemProps) {
  const isEditing = editingId === todo.id;

  return (
    <li className={todo.completed ? "completed" : ""}>
      <label className="todoItem">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={loading}
        />
        {isEditing ? (
          <input
            className="editInput"
            value={editingText}
            onChange={(event) => setEditingText(event.target.value)}
            onBlur={onSubmitEdit}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSubmitEdit();
              if (event.key === "Escape") {
                onStartEdit("", "");
              }
            }}
            autoFocus
          />
        ) : (
          <span
            className="todoTitle"
            onDoubleClick={() => onStartEdit(todo.id, todo.title)}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
      </label>
      <button
        className="iconButton"
        aria-label={`Delete ${todo.title}`}
        onClick={() => onDelete(todo.id)}
        disabled={loading}
      >
        🗑️
      </button>
    </li>
  );
}