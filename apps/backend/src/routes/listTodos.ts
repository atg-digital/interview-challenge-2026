import { Router } from 'express';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, tableName } from '../db.js';
import type { Todo } from '../types.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: tableName })
    );
    const todos = (result.Items ?? []) as Todo[];
    todos.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

export default router;
