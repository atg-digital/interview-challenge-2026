import { Router } from 'express';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, tableName } from '../db.js';
import type { Todo } from '../types.js';

const router = Router();

router.get('/search', async (req, res) => {
  const q = req.query.q;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    await new Promise((r) => setTimeout(r, 100 + Math.random() * 200));
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: 'contains(#title, :q)',
        ExpressionAttributeNames: { '#title': 'title' },
        ExpressionAttributeValues: { ':q': q },
      })
    );
    const todos = (result.Items ?? []) as Todo[];
    todos.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search todos' });
  }
});

export default router;
