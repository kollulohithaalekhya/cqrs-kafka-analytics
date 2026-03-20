import pkg from "pg";
import { env } from "../config/env.js";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: env.DB_URL,
});