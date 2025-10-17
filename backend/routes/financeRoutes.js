import express from "express";
import { pool } from "../db.js";
import { encrypt, decrypt } from "../crypto.js";

const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: "Não autenticado" });
  next();
});

router.post("/", async (req, res) => {
  const { type, amount, description } = req.body;
  const encryptedDesc = encrypt(description);
  await pool.query(
    "INSERT INTO entries (user_id, type, amount, description) VALUES ($1,$2,$3,$4)",
    [req.session.userId, type, amount, encryptedDesc]
  );
  res.json({ success: true });
});

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM entries WHERE user_id=$1", [req.session.userId]);
  const data = result.rows.map((r) => ({
    ...r,
    description: decrypt(r.description),
  }));
  res.json(data);
});

export default router;
