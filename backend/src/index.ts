import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { createTodo, deleteTodo, listTodos, updateTodo } from "./todos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running");
});

app.get("/api/todos", async (_req: Request, res: Response) => {
  const todos = await listTodos();
  res.json(todos);
});

app.post("/api/todos", async (req: Request, res: Response) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const todo = await createTodo(title);
  res.status(201).json(todo);
});

app.patch("/api/todos/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id ?? "");
  if (!id) return res.status(400).json({ error: "invalid id" });

  const updates: { title?: string; completed?: boolean } = {};
  if (typeof req.body?.title === "string") updates.title = req.body.title;
  if (typeof req.body?.completed === "boolean") updates.completed = req.body.completed;

  const todo = await updateTodo(id, updates);
  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }
  res.json(todo);
});

app.delete("/api/todos/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id ?? "");
  if (!id) return res.status(400).json({ error: "invalid id" });

  const removed = await deleteTodo(id);
  if (!removed) {
    return res.status(404).json({ error: "todo not found" });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});


