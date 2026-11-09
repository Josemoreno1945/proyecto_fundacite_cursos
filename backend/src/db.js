import 'dotenv/config';
import pg from "pg";

/*import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./config.js";
*/
// user: DB_USER,
//host: DB_HOST,
//database: DB_DATABASE,
//password: DB_PASSWORD,
//port: DB_PORT,

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

export { pool };
