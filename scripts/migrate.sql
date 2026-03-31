CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  PRIMARY KEY (user_id, key)
);
