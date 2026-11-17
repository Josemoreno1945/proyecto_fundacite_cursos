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

const use_ssl = process.env.NODE_ENV === "production" || process.env.DB_SSL === "true";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(use_ssl && {
    ssl: { rejectUnauthorized: false },
  }),
});

export { pool };
