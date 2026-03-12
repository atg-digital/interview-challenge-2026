import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchTodos,
  searchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../api';

describe('API module', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('fetchTodos', () => {
    it('returns todos from GET /api/todos', async () => {
      const todos = [
        {
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(todos),
      });

      const result = await fetchTodos();
      expect(result).toEqual(todos);
      expect(fetch).toHaveBeenCalledWith('/api/todos');
    });

    it('throws when response is not ok', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchTodos()).rejects.toThrow('Failed to fetch todos');
    });
  });

  describe('searchTodos', () => {
    it('calls GET /api/todos/search with query param', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await searchTodos('groceries');
      expect(fetch).toHaveBeenCalledWith(
        '/api/todos/search?q=groceries'
      );
    });

    it('encodes special characters in query', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await searchTodos('hello world');
      expect(fetch).toHaveBeenCalledWith(
        '/api/todos/search?q=hello%20world'
      );
    });
  });

  describe('createTodo', () => {
    it('sends POST with title and returns created todo', async () => {
      const todo = {
        id: '1',
        title: 'New todo',
        completed: false,
        createdAt: new Date().toISOString(),
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(todo),
      });

      const result = await createTodo('New todo');
      expect(result).toEqual(todo);
      expect(fetch).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New todo' }),
      });
    });
  });

  describe('updateTodo', () => {
    it('sends PATCH with updates', async () => {
      const updated = {
        id: '1',
        title: 'Test',
        completed: true,
        createdAt: new Date().toISOString(),
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updated),
      });

      const result = await updateTodo('1', { completed: true });
      expect(result.completed).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      });
    });
  });

  describe('deleteTodo', () => {
    it('sends DELETE request', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
      });

      await deleteTodo('1');
      expect(fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'DELETE',
      });
    });
  });
});
