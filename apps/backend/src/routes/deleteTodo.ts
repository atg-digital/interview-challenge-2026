import { Router } from 'express';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, tableName } from '../db.js';

const router = Router();

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id },
      })
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;
