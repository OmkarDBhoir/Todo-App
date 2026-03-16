import { useRef } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface TodoInputProps {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onAdd: () => void;
  loading: boolean;
}

export function TodoInput({ newTitle, setNewTitle, onAdd, loading }: TodoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") onAdd();
  };

  return (
    <section className="todoInput">
      <input
        ref={inputRef}
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="✨ Add a new task..."
        disabled={loading}
        aria-label="New todo"
      />
      <button className="primary" onClick={onAdd} disabled={loading || !newTitle.trim()}>
        {loading ? <LoadingSpinner size="sm" /> : "Add"}
      </button>
    </section>
  );
}