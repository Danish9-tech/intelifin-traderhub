import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { openDatabase, type AppDatabase, writeAuditLog } from "./db";

dotenv.config();

interface BuildAppOptions {
  dbPath?: string;
}

interface AuthenticatedRequest extends Request {
  userId?: number;
  sessionToken?: string;
}

const sessionTtlMs = 1000 * 60 * 60 * 24 * 7;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getAuthedUser(db: AppDatabase, token: string) {
  const now = new Date().toISOString();
  return db.get<{ id: number; name: string; email: string }>(
    `SELECT users.id, users.name, users.email
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token = ? AND sessions.expires_at > ?`,
    token,
    now,
  );
}

function toDuration(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(Date.now() - then, 0);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export async function buildApp(options: BuildAppOptions = {}) {
  const db = await openDatabase(options.dbPath);
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get("/api/health", async (_req, res) => {
    const row = await db.get<{ now: string }>("SELECT datetime('now') as now");
    res.json({ status: "ok", db: !!row, timestamp: row?.now ?? new Date().toISOString() });
  });

  const authSchema = z.object({
    name: z.string().min(2).max(80).optional(),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  });

  const holdingSchema = z.object({
    asset: z.string().min(1).max(64),
    symbol: z.string().min(1).max(16),
    amount: z.coerce.number().positive(),
    value: z.coerce.number().nonnegative(),
    pnl: z.coerce.number().default(0),
  });

  const journalSchema = z.object({
    pair: z.string().min(1).max(32),
    type: z.enum(["Long", "Short"]),
    entry: z.string().min(1).max(32),
    exit: z.string().min(1).max(32),
    pnl: z.coerce.number(),
    emotion: z.string().min(2).max(32),
    tags: z.array(z.string().max(24)).max(10).default([]),
    notes: z.string().max(2000).default(""),
  });

  const alertSchema = z.object({
    type: z.string().min(2).max(32),
    asset: z.string().min(1).max(24),
    condition: z.string().min(2).max(256),
  });

  const aiSchema = z.object({
    message: z.string().min(2).max(1000),
  });

  const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "") || "";
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const user = await getAuthedUser(db, token);
    if (!user) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }

    req.userId = user.id;
    req.sessionToken = token;
    next();
  };

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const payload = authSchema.extend({ name: z.string().min(2).max(80) }).parse(req.body);
      const existing = await db.get("SELECT id FROM users WHERE email = ?", payload.email.toLowerCase());
      if (existing) {
        res.status(409).json({ error: "Email already registered" });
        return;
      }

      const hash = await bcrypt.hash(payload.password, 10);
      const result = await db.run(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        payload.name,
        payload.email.toLowerCase(),
        hash,
      );
      await writeAuditLog(db, "auth.register", `Registered ${payload.email.toLowerCase()}`, result.lastID);
      res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const payload = authSchema.parse(req.body);
      const user = await db.get<{ id: number; name: string; email: string; password_hash: string }>(
        "SELECT id, name, email, password_hash FROM users WHERE email = ?",
        payload.email.toLowerCase(),
      );
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const valid = await bcrypt.compare(payload.password, user.password_hash);
      if (!valid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + sessionTtlMs).toISOString();
      await db.run("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)", user.id, token, expiresAt);
      await writeAuditLog(db, "auth.login", `User ${user.email} logged in`, user.id);

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
        expiresAt,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      await db.run("DELETE FROM sessions WHERE token = ?", req.sessionToken);
      await writeAuditLog(db, "auth.logout", "User logged out", req.userId);
      res.json({ message: "Logged out" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const user = await db.get<{ id: number; name: string; email: string }>(
        "SELECT id, name, email FROM users WHERE id = ?",
        req.userId,
      );
      res.json({ user });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/markets", requireAuth, async (req, res, next) => {
    try {
      const search = (req.query.search as string | undefined)?.toLowerCase().trim() || "";
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      );
      if (!response.ok) {
        throw new Error(`Market feed request failed (${response.status})`);
      }

      const data = (await response.json()) as Array<{
        symbol: string;
        name: string;
        current_price: number;
        price_change_percentage_24h: number;
        total_volume: number;
        market_cap: number;
      }>;

      const rows = data.map((coin) => ({
        symbol: `${coin.symbol.toUpperCase()}/USD`,
        name: coin.name,
        price: coin.current_price,
        change: coin.price_change_percentage_24h ?? 0,
        vol: coin.total_volume,
        cap: coin.market_cap,
        cat: "Crypto",
      }));

      const filtered = search
        ? rows.filter((item) => item.symbol.toLowerCase().includes(search) || item.name.toLowerCase().includes(search))
        : rows;

      res.json({ data: filtered });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/portfolio/holdings", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const rows = await db.all<{
        id: number;
        asset: string;
        symbol: string;
        amount: number;
        value: number;
        pnl: number;
      }[]>(
        "SELECT id, asset, symbol, amount, value, pnl FROM holdings WHERE user_id = ? ORDER BY id DESC",
        req.userId,
      );
      res.json({ data: rows });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/portfolio/summary", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const row = await db.get<{ totalValue: number; totalPnl: number; count: number }>(
        `SELECT
          COALESCE(SUM(value), 0) as totalValue,
          COALESCE(SUM(pnl), 0) as totalPnl,
          COUNT(*) as count
         FROM holdings WHERE user_id = ?`,
        req.userId,
      );
      res.json({ data: row });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/portfolio/holdings", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const payload = holdingSchema.parse(req.body);
      const result = await db.run(
        "INSERT INTO holdings (user_id, asset, symbol, amount, value, pnl) VALUES (?, ?, ?, ?, ?, ?)",
        req.userId,
        payload.asset,
        payload.symbol.toUpperCase(),
        payload.amount,
        payload.value,
        payload.pnl,
      );
      await writeAuditLog(db, "portfolio.add_holding", `Added ${payload.symbol}`, req.userId);
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/portfolio/holdings/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ error: "Invalid holding id" });
        return;
      }
      await db.run("DELETE FROM holdings WHERE id = ? AND user_id = ?", id, req.userId);
      await writeAuditLog(db, "portfolio.delete_holding", `Deleted holding ${id}`, req.userId);
      res.json({ message: "Holding deleted" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/journal", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const rows = await db.all<
        {
          id: number;
          pair: string;
          type: "Long" | "Short";
          entry_price: string;
          exit_price: string;
          pnl: number;
          emotion: string;
          tags: string;
          notes: string;
          created_at: string;
        }[]
      >(
        `SELECT id, pair, type, entry_price, exit_price, pnl, emotion, tags, notes, created_at
         FROM journal_entries WHERE user_id = ? ORDER BY id DESC`,
        req.userId,
      );

      const data = rows.map((row) => ({
        id: row.id,
        date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        pair: row.pair,
        type: row.type,
        entry: row.entry_price,
        exit: row.exit_price,
        pnl: row.pnl,
        emotion: row.emotion,
        tags: parseTags(row.tags),
        notes: row.notes,
      }));

      res.json({ data });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/journal", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const payload = journalSchema.parse(req.body);
      const result = await db.run(
        `INSERT INTO journal_entries (user_id, pair, type, entry_price, exit_price, pnl, emotion, tags, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        req.userId,
        payload.pair,
        payload.type,
        payload.entry,
        payload.exit,
        payload.pnl,
        payload.emotion,
        JSON.stringify(payload.tags),
        payload.notes || "No notes added.",
      );
      await writeAuditLog(db, "journal.create_entry", `Created entry ${result.lastID}`, req.userId);
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/journal/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ error: "Invalid journal id" });
        return;
      }
      await db.run("DELETE FROM journal_entries WHERE id = ? AND user_id = ?", id, req.userId);
      await writeAuditLog(db, "journal.delete_entry", `Deleted entry ${id}`, req.userId);
      res.json({ message: "Entry deleted" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/alerts", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const includeDismissed = req.query.includeDismissed === "true";
      const rows = await db.all<
        {
          id: number;
          type: string;
          asset: string;
          condition: string;
          status: string;
          dismissed: number;
          created_at: string;
        }[]
      >(
        `SELECT id, type, asset, condition, status, dismissed, created_at
         FROM alerts
         WHERE user_id = ? ${includeDismissed ? "" : "AND dismissed = 0"}
         ORDER BY id DESC`,
        req.userId,
      );

      const data = rows.map((row) => ({
        id: row.id,
        type: row.type,
        asset: row.asset,
        condition: row.condition,
        status: row.status,
        dismissed: !!row.dismissed,
        time: toDuration(row.created_at),
      }));

      res.json({ data });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/alerts", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const payload = alertSchema.parse(req.body);
      const result = await db.run(
        "INSERT INTO alerts (user_id, type, asset, condition) VALUES (?, ?, ?, ?)",
        req.userId,
        payload.type,
        payload.asset.toUpperCase(),
        payload.condition,
      );
      await writeAuditLog(db, "alerts.create", `Created alert ${result.lastID}`, req.userId);
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/alerts/:id/dismiss", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ error: "Invalid alert id" });
        return;
      }
      await db.run("UPDATE alerts SET dismissed = 1, status = 'Dismissed' WHERE id = ? AND user_id = ?", id, req.userId);
      await writeAuditLog(db, "alerts.dismiss", `Dismissed alert ${id}`, req.userId);
      res.json({ message: "Alert dismissed" });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/alerts/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ error: "Invalid alert id" });
        return;
      }
      await db.run("DELETE FROM alerts WHERE id = ? AND user_id = ?", id, req.userId);
      await writeAuditLog(db, "alerts.delete", `Deleted alert ${id}`, req.userId);
      res.json({ message: "Alert deleted" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ai/chat", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const payload = aiSchema.parse(req.body);
      const prompt = payload.message.trim();

      if (process.env.OPENAI_API_KEY) {
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.OPENAI_API_KEY,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are a trading assistant. Provide concise educational insights only. Never provide guaranteed outcomes. Include risk note.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.4,
          }),
        });

        if (process.env.NODE_ENV === "production") {
          app.use(express.static(distPath));
          app.get("*", (req, res, next) => {
            if (req.path.startsWith("/api")) {
              next();
              return;
            }
            res.sendFile(path.join(distPath, "index.html"));
          });
        }

        if (!aiRes.ok) {
          throw new Error(`AI provider failed (${aiRes.status})`);
        }

        const payloadJson = (await aiRes.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const reply = payloadJson.choices?.[0]?.message?.content?.trim();

        if (!reply) {
          throw new Error("AI provider returned empty response");
        }

        await writeAuditLog(db, "ai.chat", "AI message requested", req.userId);
        res.json({ reply, provider: "openai" });
        return;
      }

      const fallback = `Market context for "${prompt}": prioritize trend direction, key support/resistance, and position sizing <= 1-2% risk per trade. This is educational, not financial advice.`;
      await writeAuditLog(db, "ai.chat.fallback", "Fallback AI response used", req.userId);
      res.json({ reply: fallback, provider: "fallback" });
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.issues.map((x) => x.message) });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  });

  return { app, db };
}
