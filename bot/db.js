// bot/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function getExcursiones() {
  try {
    const [rows] = await pool.query(
      "SELECT titulo, descripcion, ubicacion FROM Excursiones WHERE estado='activa' AND eliminado=0"
    );
    return rows;
  } catch (err) {
    console.error("Error al consultar excursiones:", err.message);
    return [];
  }
}
