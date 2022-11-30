import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: process.env.PGCERT
  }
});

export default pool;
