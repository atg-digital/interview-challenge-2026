import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, tableName } from "../db.js";
import type { Todo } from "../types.js";

const router = Router();

router.post("/", async (req, res) => {
  const { title } = req.body;

  // TODO: Implement idempotency

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }

  const height = Math.floor(Math.random() * 100) + 60;
  const width = Math.floor(Math.random() * 100) + 80;

  const id = uuidv4();
  const todo: Todo = {
    id,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    imageUrl: `https://picsum.photos/seed/${id}/${width}/${height}`,
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: todo,
      }),
    );
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

export default router;
