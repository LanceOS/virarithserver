import 'dotenv/config';
import { Config, defineConfig } from 'drizzle-kit';

const databaseUrl = `postgresql://${process.env.POSTGRES_USER!}:${process.env.POSTGRES_PASSWORD!}@localhost:5432/${process.env.POSTGRES_DB!}`;

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/schemas/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
}) satisfies Config;