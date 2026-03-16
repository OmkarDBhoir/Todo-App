import { type Todo } from "../types";

const api = {
  list: async (): Promise<Todo[]> => {
    const res = await fetch("/api/todos");
    if (!res.ok) throw new Error("Failed to fetch todos");
    return res.json();
  },
  create: async (title: string): Promise<Todo> => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    return res.json();
  },
  update: async (id: string, updates: Partial<Pick<Todo, "title" | "completed">>): Promise<Todo> => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json();
  },
  remove: async (id: string): Promise<void> => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
  },
};

export default api;
