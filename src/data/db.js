import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const dbCofig = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = dbCofig;
