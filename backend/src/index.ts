import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { Pool } from "pg";

// ── Express setup ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// ── PostgreSQL connection pool ──────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ── Create the colleges table if it doesn't already exist ───────────────────────
async function createCollegesTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS colleges (
      id              SERIAL PRIMARY KEY,
      name            VARCHAR(255),
      location        VARCHAR(255),
      fees            INTEGER,
      rating          NUMERIC(3, 1),
      placement_rate  INTEGER,
      courses         TEXT[],
      basic_info      TEXT
    );
  `;
  await pool.query(query);
  console.log("✅  colleges table is ready");
}

// ── Seed the table with 3 mock colleges when it's empty ─────────────────────────
async function seedColleges(): Promise<void> {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM colleges");
  const count: number = rows[0]?.count ?? 0;

  if (count > 0) {
    console.log(`ℹ️  colleges table already has ${count} row(s) — skipping seed`);
    return;
  }

  const mockColleges = [
    {
      name: "Indian Institute of Technology, Bombay",
      location: "Mumbai, Maharashtra",
      fees: 250000,
      rating: 9.5,
      placement_rate: 95,
      courses: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
      basic_info:
        "One of India's premier engineering institutes, known for cutting-edge research and top-tier placements.",
    },
    {
      name: "Delhi University",
      location: "New Delhi, Delhi",
      fees: 50000,
      rating: 8.7,
      placement_rate: 82,
      courses: ["B.Com", "B.A. English", "B.Sc. Physics", "Economics"],
      basic_info:
        "A prestigious central university offering a wide range of undergraduate and postgraduate programs.",
    },
    {
      name: "Birla Institute of Technology and Science, Pilani",
      location: "Pilani, Rajasthan",
      fees: 450000,
      rating: 9.1,
      placement_rate: 90,
      courses: ["Computer Science", "Electronics", "Pharmacy", "Economics"],
      basic_info:
        "A top private university recognized for its rigorous academics and strong industry connections.",
    },
  ];

  const insertQuery = `
    INSERT INTO colleges (name, location, fees, rating, placement_rate, courses, basic_info)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  for (const college of mockColleges) {
    await pool.query(insertQuery, [
      college.name,
      college.location,
      college.fees,
      college.rating,
      college.placement_rate,
      college.courses,
      college.basic_info,
    ]);
  }

  console.log("🌱  Seeded 3 mock colleges");
}

// ── REST API endpoints ──────────────────────────────────────────────────────────

// GET /api/colleges — list all colleges (optional ?search= and ?location= filters)
app.get("/api/colleges", async (req, res) => {
  try {
    const { search, location } = req.query;

    let query = "SELECT * FROM colleges";
    const conditions: string[] = [];
    const params: string[] = [];

    if (typeof search === "string" && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (typeof location === "string" && location.trim()) {
      params.push(`%${location.trim()}%`);
      conditions.push(`location ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY id";

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching colleges:", err);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

// GET /api/colleges/:id — get a single college by ID
app.get("/api/colleges/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM colleges WHERE id = $1", [id]);

    if (rows.length === 0) {
      res.status(404).json({ error: "College not found" });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching college:", err);
    res.status(500).json({ error: "Failed to fetch college" });
  }
});

// ── Bootstrap & start the server ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function main(): Promise<void> {
  try {
    await createCollegesTable();
    await seedColleges();

    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌  Failed to start server:", err);
    process.exit(1);
  }
}

main();
