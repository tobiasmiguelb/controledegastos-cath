import express from "express";
import { loginUser, registerUser } from "../auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await registerUser(email, password);
    req.session.userId = user.id;
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Usuário já existe ou erro no cadastro" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);
  if (user) {
    req.session.userId = user.id;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

export default router;
