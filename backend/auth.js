import argon2 from "argon2";
import { pool } from "./db.js";

export async function registerUser(email, password) {
  const hash = await argon2.hash(password, { type: argon2.argon2id });
  const result = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
    [email, hash]
  );
  return result.rows[0];
}

export async function loginUser(email, password) {
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  const user = result.rows[0];
  if (!user) return null;
  const valid = await argon2.verify(user.password_hash, password);
  return valid ? user : null;
}
