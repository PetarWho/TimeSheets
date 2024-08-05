import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db_port: any = process.env.DB_PORT;
const host: any = process.env.DB_HOST;
const user: any = process.env.DB_USER;
const password: any = process.env.DB_PASSWORD;
const database: any = process.env.DATABASE;

const db = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
  port: db_port,
});

export default db;
