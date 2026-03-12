import { useState, useEffect, useCallback } from "react";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  searchTodos,
  updateTodo,
} from "./api";
import { ErrorMessage, SearchInput, TodoForm, TodoGrid } from "./components";
import type { Todo } from "./types";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async (q?: string) => {
    try {
      setError(null);
      const data = q ? await searchTodos(q) : await fetchTodos();
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setLoading(true);
      loadTodos();
    } else {
      const timer = setTimeout(() => {
        setLoading(true);
        loadTodos(searchQuery.trim());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    try {
      const todo = await createTodo(title);
      setTodos((prev) => [...prev, todo]);
      setInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add todo");
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await updateTodo(id, { completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update todo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete todo");
    }
  };

  return (
    <main>
      <h1 className="app-title">To-Do</h1>

      {error && <ErrorMessage message={error} />}

      <TodoForm value={input} onChange={setInput} onSubmit={handleSubmit} />

      <SearchInput value={searchQuery} onChange={setSearchQuery} />

      <TodoGrid
        todos={todos}
        loading={loading}
        searchQuery={searchQuery}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </main>
  );
}

export default App;
