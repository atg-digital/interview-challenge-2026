import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "Todos";

const endpoint =
  process.env.DYNAMODB_ENDPOINT ??
  (process.env.NODE_ENV !== "production" ? "http://localhost:8000" : undefined);

const client = new DynamoDBClient({
  region: "us-east-1",
  ...(endpoint && {
    endpoint,
    credentials: {
      accessKeyId: "local",
      secretAccessKey: "local",
    },
  }),
});

export const docClient = DynamoDBDocumentClient.from(client);

export async function ensureTableExists(): Promise<void> {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`Table "${TABLE_NAME}" exists`);
  } catch {
    console.log(`Creating table "${TABLE_NAME}"...`);
    await client.send(
      new CreateTableCommand({
        TableName: TABLE_NAME,
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
      }),
    );
    console.log(`Table "${TABLE_NAME}" created`);
  }
}

const SEED_TODOS = [
  { title: "Clean the car", completed: false, imageWidth: 80, imageHeight: 60 },
  { title: "Buy groceries", completed: false, imageWidth: 80, imageHeight: 85 },
  { title: "Call mum", completed: true, imageWidth: 80, imageHeight: 110 },
  { title: "Review pull requests", completed: false, imageWidth: 100, imageHeight: 80 },
  { title: "Plan the quarterly OKRs", completed: false, imageWidth: 60, imageHeight: 80 },
];

export async function ensureSeedData(): Promise<void> {
  const baseTime = Date.now();
  for (let i = 0; i < SEED_TODOS.length; i++) {
    const { title, completed, imageWidth, imageHeight } = SEED_TODOS[i];
    const id = `seed-${i + 1}`;
    const todo = {
      id,
      title,
      completed,
      createdAt: new Date(baseTime + i).toISOString(),
      imageUrl: `https://picsum.photos/seed/${id}/${imageWidth}/${imageHeight}`,
    };
    try {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: todo,
          ConditionExpression: "attribute_not_exists(id)",
        }),
      );
      console.log(`Seeded todo: "${title}"`);
    } catch (err: unknown) {
      if (
        (err as { name?: string })?.name === "ConditionalCheckFailedException"
      ) {
        continue;
      }
      throw err;
    }
  }
}

export const tableName = TABLE_NAME;
