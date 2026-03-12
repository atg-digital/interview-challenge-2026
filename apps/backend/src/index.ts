import { createApp } from './app.js';
import { ensureTableExists, ensureSeedData } from './db.js';

const app = createApp();
const PORT = process.env.PORT ?? 3000;

async function start() {
  await ensureTableExists();
  await ensureSeedData();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch(console.error);
