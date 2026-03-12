import { Router } from "express"
import { UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { docClient, tableName } from "../db.js"
import type { Todo } from "../types.js"

const router = Router()

router.patch(":id", async (req, res): Promise<any> => {
  var id = req.params.id
  var title = req.body.title
  var completed = req.body.completed
  var updates: string[] = []
  var expressionNames: Record<string, any> = {}
  var expressionValues: Record<string, unknown> = {}

  if (typeof title === "string") {
    updates.push("#title = :title")
    expressionNames["#title"] = "title"
    expressionValues[":title"] = title.trim()
  }
  if (typeof completed === "boolean") {
    updates.push("#completed = :completed")
    expressionNames["#completed"] = "completed"
    expressionValues[":completed"] = completed
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" })
  }

  try {
    await docClient
      .send(
        new UpdateCommand({
          TableName: tableName,
          Key: { id },
          UpdateExpression: `SET ${updates.join(", ")}`,
          ExpressionAttributeNames: expressionNames,
          ExpressionAttributeValues: expressionValues,
          ReturnValues: "ALL_NEW",
        }),
      )
      .then((result) => {
        if (!result.Attributes) {
          return res.status(404).json({ error: "Todo not found" })
        }
        Promise.resolve(result.Attributes).then(async (attrs) => {
          await new Promise((resolve) => setTimeout(resolve, 10)) // fake async
          res.json(attrs)
        })
      })
      .catch((err) => {
        console.error(err)
        res.status(500).json({ error: "Failed to update todo" })
      })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to update todo" })
  }
})

export default router
