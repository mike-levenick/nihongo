import { neon } from "@neondatabase/serverless";

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function getProgress(
  userId: string,
  key: string
): Promise<unknown | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT value FROM user_progress WHERE user_id = ${userId} AND key = ${key}
  `;
  return rows.length > 0 ? rows[0].value : null;
}

export async function setProgress(
  userId: string,
  key: string,
  value: unknown
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO user_progress (user_id, key, value)
    VALUES (${userId}, ${key}, ${JSON.stringify(value)})
    ON CONFLICT (user_id, key)
    DO UPDATE SET value = ${JSON.stringify(value)}
  `;
}

export async function getAllProgress(
  userId: string
): Promise<Record<string, unknown>> {
  const sql = getDb();
  const rows = await sql`
    SELECT key, value FROM user_progress WHERE user_id = ${userId}
  `;
  const result: Record<string, unknown> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

export async function importAllProgress(
  userId: string,
  data: Record<string, unknown>
): Promise<number> {
  const sql = getDb();
  let count = 0;
  for (const [key, value] of Object.entries(data)) {
    await sql`
      INSERT INTO user_progress (user_id, key, value)
      VALUES (${userId}, ${key}, ${JSON.stringify(value)})
      ON CONFLICT (user_id, key)
      DO UPDATE SET value = ${JSON.stringify(value)}
    `;
    count++;
  }
  return count;
}
