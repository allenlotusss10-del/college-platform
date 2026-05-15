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

// ── Seed the table with mock colleges ─────────────────────────
async function seedColleges(): Promise<void> {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM colleges");
  const count: number = rows[0]?.count ?? 0;

  const mockColleges = [
    {
      name: "Indian Institute of Technology, Bombay",
      location: "Mumbai, Maharashtra",
      fees: 250000,
      rating: 9.5,
      placement_rate: 95,
      courses: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
      basic_info: "One of India's premier engineering institutes, known for cutting-edge research and top-tier placements.",
    },
    {
      name: "Delhi University",
      location: "New Delhi, Delhi",
      fees: 50000,
      rating: 8.7,
      placement_rate: 82,
      courses: ["B.Com", "B.A. English", "B.Sc. Physics", "Economics"],
      basic_info: "A prestigious central university offering a wide range of undergraduate and postgraduate programs.",
    },
    {
      name: "Birla Institute of Technology and Science, Pilani",
      location: "Pilani, Rajasthan",
      fees: 450000,
      rating: 9.1,
      placement_rate: 90,
      courses: ["Computer Science", "Electronics", "Pharmacy", "Economics"],
      basic_info: "A top private university recognized for its rigorous academics and strong industry connections.",
    },
    {
      name: "Indian Institute of Technology, Delhi",
      location: "New Delhi, Delhi",
      fees: 220000,
      rating: 9.4,
      placement_rate: 96,
      courses: ["Computer Science", "Mathematics & Computing", "Textile Engineering"],
      basic_info: "Globally recognized for technical excellence and a thriving startup ecosystem."
    },
    {
      name: "Indian Institute of Technology, Madras",
      location: "Chennai, Tamil Nadu",
      fees: 210000,
      rating: 9.6,
      placement_rate: 94,
      courses: ["Aerospace Engineering", "Civil Engineering", "Data Science"],
      basic_info: "Consistently ranked #1 in NIRF for engineering, featuring massive research parks."
    },
    {
      name: "Vellore Institute of Technology (VIT)",
      location: "Vellore, Tamil Nadu",
      fees: 198000,
      rating: 8.5,
      placement_rate: 88,
      courses: ["Computer Science", "Bioinformatics", "Information Technology"],
      basic_info: "A highly sought-after private institute famous for its massive scale and diverse student body."
    },
    {
      name: "National Institute of Technology, Trichy",
      location: "Tiruchirappalli, Tamil Nadu",
      fees: 145000,
      rating: 9.2,
      placement_rate: 92,
      courses: ["Electronics", "Production Engineering", "Computer Science"],
      basic_info: "The top-ranked NIT in India, boasting brilliant faculty and outstanding campus culture."
    },
    {
      name: "International Institute of Information Technology, Hyderabad",
      location: "Hyderabad, Telangana",
      fees: 330000,
      rating: 9.3,
      placement_rate: 98,
      courses: ["Computer Science", "Electronics and Communication"],
      basic_info: "An autonomous institute strictly focused on IT and research, with incredibly high coding standards."
    },
    {
      name: "Jadavpur University",
      location: "Kolkata, West Bengal",
      fees: 12000,
      rating: 9.0,
      placement_rate: 89,
      courses: ["Computer Science", "Architecture", "Chemical Engineering"],
      basic_info: "Known for almost negligible fees combined with elite academics and strong global alumni network."
    },
    {
      name: "Manipal Institute of Technology",
      location: "Manipal, Karnataka",
      fees: 335000,
      rating: 8.4,
      placement_rate: 85,
      courses: ["Mechatronics", "Computer Science", "Aeronautical Engineering"],
      basic_info: "Offers excellent infrastructure, vibrant student life, and strong global connections."
    },
    {
      name: "Christ University",
      location: "Bangalore, Karnataka",
      fees: 180000,
      rating: 8.6,
      placement_rate: 80,
      courses: ["BBA", "B.Com", "Psychology", "Law"],
      basic_info: "Famous for its strict discipline, commerce/management programs, and beautifully maintained campus."
    },
    {
      name: "Symbiosis International University",
      location: "Pune, Maharashtra",
      fees: 350000,
      rating: 8.8,
      placement_rate: 87,
      courses: ["Law", "Business Administration", "Mass Communication"],
      basic_info: "A hub for management and liberal arts with a highly diverse, cosmopolitan environment."
    },
    {
      name: "SRM Institute of Science and Technology",
      location: "Chennai, Tamil Nadu",
      fees: 260000,
      rating: 8.2,
      placement_rate: 83,
      courses: ["Computer Science", "Biomedical Engineering", "Automobile Engineering"],
      basic_info: "A massive private university network known for extensive global tie-ups and semester-abroad programs."
    },
    {
      name: "Banaras Hindu University (BHU)",
      location: "Varanasi, Uttar Pradesh",
      fees: 15000,
      rating: 8.9,
      placement_rate: 78,
      courses: ["Arts", "Science", "Agriculture", "Medicine"],
      basic_info: "One of the largest residential universities in Asia, steeped in history and culture."
    },
    {
      name: "Jawaharlal Nehru University (JNU)",
      location: "New Delhi, Delhi",
      fees: 12000,
      rating: 9.1,
      placement_rate: 70,
      courses: ["International Relations", "Sociology", "Foreign Languages"],
      basic_info: "A premier research university predominantly focused on postgraduate liberal arts and sciences."
    },
    {
      name: "National Institute of Technology, Surathkal",
      location: "Surathkal, Karnataka",
      fees: 150000,
      rating: 9.1,
      placement_rate: 93,
      courses: ["Computer Science", "Information Technology", "Mining Engineering"],
      basic_info: "Features a private beach on campus and exceptional engineering placement statistics."
    },
    {
      name: "St. Stephen's College",
      location: "New Delhi, Delhi",
      fees: 45000,
      rating: 9.2,
      placement_rate: 75,
      courses: ["Economics", "History", "Mathematics", "English"],
      basic_info: "One of the oldest and most prestigious colleges for arts and sciences under Delhi University."
    },
    {
      name: "Loyola College",
      location: "Chennai, Tamil Nadu",
      fees: 55000,
      rating: 8.9,
      placement_rate: 79,
      courses: ["Visual Communication", "Commerce", "Economics"],
      basic_info: "Highly reputed for its commerce, arts, and media programs with a legacy of excellence."
    },
    {
      name: "Narsee Monjee Institute of Management Studies (NMIMS)",
      location: "Mumbai, Maharashtra",
      fees: 400000,
      rating: 8.7,
      placement_rate: 89,
      courses: ["BBA", "B.Tech", "MBA", "Commerce"],
      basic_info: "A top-tier private institute dominating the management and commerce education sector in Mumbai."
    },
    {
      name: "Indian Institute of Technology, Kanpur",
      location: "Kanpur, Uttar Pradesh",
      fees: 215000,
      rating: 9.5,
      placement_rate: 94,
      courses: ["Computer Science", "Aerospace Engineering", "Materials Science"],
      basic_info: "Known for an extremely rigorous academic curriculum and producing top-notch researchers."
    },
    {
      name: "Indian Institute of Technology, Kharagpur",
      location: "Kharagpur, West Bengal",
      fees: 220000,
      rating: 9.4,
      placement_rate: 93,
      courses: ["Architecture", "Computer Science", "Agricultural Engineering"],
      basic_info: "The oldest IIT with the largest campus, offering the widest variety of engineering disciplines."
    },
    {
      name: "Presidency College",
      location: "Chennai, Tamil Nadu",
      fees: 18000,
      rating: 8.6,
      placement_rate: 72,
      courses: ["Political Science", "Physics", "Literature"],
      basic_info: "A historic government arts and science college that has produced Nobel laureates."
    },
    {
      name: "Anna University",
      location: "Chennai, Tamil Nadu",
      fees: 40000,
      rating: 8.8,
      placement_rate: 85,
      courses: ["Mechanical Engineering", "Civil Engineering", "Computer Science"],
      basic_info: "A massive state university serving as the affiliating body for most engineering colleges in Tamil Nadu."
    }
  ];

  if (count >= mockColleges.length) {
    console.log(`ℹ️  colleges table already has ${count} row(s) — skipping seed`);
    return;
  }

  console.log(`🔄  Updating database with ${mockColleges.length} colleges...`);
  await pool.query("TRUNCATE TABLE colleges RESTART IDENTITY");

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

  console.log(`🌱  Seeded ${mockColleges.length} mock colleges successfully`);
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
