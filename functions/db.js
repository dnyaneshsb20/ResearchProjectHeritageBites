// functions/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Supabase/Postgres connection string
   ssl: {
    rejectUnauthorized: false, // Supabase requires SSL
  },
});
pool.on("error", (err) => {
  console.error("Unexpected DB error:", err);
});

module.exports = pool;
