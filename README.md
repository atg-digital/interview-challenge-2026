# To-Do Application

A full-stack to-do app built as a pnpm monorepo with a React + Vite frontend and Node.js + Express backend, using DynamoDB Local for storage.

## Prerequisites

- **Node.js** 18+
- **pnpm** 8+
- **Docker** (for DynamoDB Local)

  _Alternative_: If you don't have Docker, you can run DynamoDB Local with Java using the `aws-dynamodb-local` npm package.

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start DynamoDB Local:
   ```bash
   docker compose up -d
   ```
   Or use: `pnpm db:start`

3. Start the app (frontend + backend):
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### One-command start

To start DynamoDB and run the app in a single command:

```bash
pnpm start
```

Note: Docker must be installed for `pnpm start` to work.

## Project Structure

```
interview-challenge/
├── apps/
│   ├── frontend/     # React + Vite (port 5173)
│   └── backend/      # Express API (port 3000)
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## Testing

Run unit tests to verify your changes:

```bash
pnpm test
```

Tests use Vitest. Backend tests mock DynamoDB; frontend tests mock the API. No need for Docker or a running server.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/todos` | List all todos |
| GET | `/api/todos/search?q=` | Search todos by title |
| POST | `/api/todos` | Create a todo |
| PATCH | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

## Environment Variables

- **Backend**
  - `DYNAMODB_ENDPOINT` – Override DynamoDB endpoint (default: `http://localhost:8000` in development)
  - `PORT` – Server port (default: `3000`)

- **Frontend**
  - `VITE_API_URL` – API base URL (default: `/api` for dev proxy to backend)

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React 18, Vite, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: DynamoDB (AWS SDK v3) with DynamoDB Local
