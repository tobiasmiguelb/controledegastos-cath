import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectPg from "connect-pg-simple";
import { pool } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";

dotenv.config();
const app = express();
const PgStore = connectPg(session);

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(
  session({
    store: new PgStore({ pool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/auth", authRoutes);
app.use("/finance", financeRoutes);

app.listen(process.env.PORT, () =>
  console.log(`✅ Servidor rodando em http://localhost:${process.env.PORT}`)
);
