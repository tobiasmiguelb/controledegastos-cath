CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type TEXT CHECK (type IN ('gain', 'expense')),
  amount NUMERIC(10,2),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
