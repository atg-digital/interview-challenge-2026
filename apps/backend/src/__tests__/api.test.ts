import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

// Mock DynamoDB before routes are loaded
const mockSend = vi.fn();
vi.mock('../db.js', () => ({
  docClient: { send: (...args: unknown[]) => mockSend(...args) },
  tableName: 'Todos',
  ensureTableExists: vi.fn(),
  ensureSeedData: vi.fn(),
}));

describe('Todos API', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/todos', () => {
    it('returns an array of todos', async () => {
      const mockTodos = [
        {
          id: '1',
          title: 'Test todo',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];
      mockSend.mockResolvedValueOnce({ Items: mockTodos });

      const res = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(res.body).toEqual(mockTodos);
    });

    it('returns empty array when no todos exist', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const res = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/todos', () => {
    it('creates a todo with valid title', async () => {
      mockSend.mockResolvedValueOnce(undefined);

      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'New todo' })
        .expect(201);

      expect(res.body).toMatchObject({
        title: 'New todo',
        completed: false,
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({})
        .expect(400);

      expect(res.body.error).toContain('Title');
    });

    it('returns 400 when title is not a string', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 123 })
        .expect(400);

      expect(res.body.error).toContain('Title');
    });

    it('trims whitespace from title', async () => {
      mockSend.mockResolvedValueOnce(undefined);

      const res = await request(app)
        .post('/api/todos')
        .send({ title: '  Trimmed  ' })
        .expect(201);

      expect(res.body.title).toBe('Trimmed');
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('updates todo completed status', async () => {
      const updated = {
        id: 'todo-1',
        title: 'Test',
        completed: true,
        createdAt: new Date().toISOString(),
      };
      mockSend.mockResolvedValueOnce({ Attributes: updated });

      const res = await request(app)
        .patch('/api/todos/todo-1')
        .send({ completed: true })
        .expect(200);

      expect(res.body.completed).toBe(true);
    });

    it('returns 400 when no valid fields provided', async () => {
      const res = await request(app)
        .patch('/api/todos/todo-1')
        .send({})
        .expect(400);

      expect(res.body.error).toContain('No valid fields');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('returns 204 on successful delete', async () => {
      mockSend.mockResolvedValueOnce(undefined);

      await request(app)
        .delete('/api/todos/todo-1')
        .expect(204);
    });
  });

  describe('GET /api/todos/search', () => {
    it('returns 400 when query param q is missing', async () => {
      const res = await request(app)
        .get('/api/todos/search')
        .expect(400);

      expect(res.body.error).toContain('q');
    });

    it('returns matching todos when q is provided', async () => {
      const mockTodos = [
        {
          id: '1',
          title: 'Buy groceries',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];
      mockSend.mockResolvedValueOnce({ Items: mockTodos });

      const res = await request(app)
        .get('/api/todos/search?q=groceries')
        .expect(200);

      expect(res.body).toEqual(mockTodos);
    });
  });
});
