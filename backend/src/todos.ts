import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "..", "todos.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readTodos(): Promise<Todo[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through
  }
  return [];
}

async function writeTodos(todos: Todo[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), "utf8");
}

export async function listTodos(): Promise<Todo[]> {
  return await readTodos();
}

export async function createTodo(title: string): Promise<Todo> {
  const todos = await readTodos();
  const next: Todo = {
    id: randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [next, ...todos];
  await writeTodos(updated);
  return next;
}

export async function updateTodo(id: string, updates: Partial<Pick<Todo, "title" | "completed">>): Promise<Todo | null> {
  const todos = await readTodos();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  const existing = todos[idx];
  if (!existing) return null;

  const next: Todo = {
    ...existing,
    ...updates,
    title: updates.title !== undefined ? updates.title.trim() : existing.title,
  };

  todos[idx] = next;
  await writeTodos(todos);
  return next;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const todos = await readTodos();
  const filtered = todos.filter((t) => t.id !== id);
  if (filtered.length === todos.length) return false;
  await writeTodos(filtered);
  return true;
}
