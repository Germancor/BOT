// bot/queries/excursionesQueries.js
import { pool } from "../db.js";

/**
 * Obtiene todas las excursiones activas
 */
export async function getExcursionesActivas() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id_excursion,
        titulo,
        descripcion,
        precio_base,
        duracion,
        ubicacion,
        incluye
      FROM Excursiones
      WHERE estado = 'activa' AND eliminado = 0
      ORDER BY titulo
    `);
    return rows;
  } catch (err) {
    console.error("❌ Error al obtener excursiones:", err.message);
    return [];
  }
}

/**
 * Obtiene una excursión específica por ID
 */
export async function getExcursionPorId(idExcursion) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id_excursion,
        titulo,
        descripcion,
        precio_base,
        duracion,
        ubicacion,
        incluye,
        politicas
      FROM Excursiones
      WHERE id_excursion = ? AND estado = 'activa' AND eliminado = 0
    `, [idExcursion]);
    
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error al obtener excursión:", err.message);
    return null;
  }
}

/**
 * Obtiene el precio de una excursión
 */
export async function getPrecioExcursion(idExcursion) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        titulo,
        precio_base,
        duracion,
        incluye
      FROM Excursiones
      WHERE id_excursion = ? AND estado = 'activa' AND eliminado = 0
    `, [idExcursion]);
    
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error al obtener precio:", err.message);
    return null;
  }
}

/**
 * Obtiene fechas disponibles de una excursión
 */
export async function getFechasDisponibles(idExcursion) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        f.id_fecha,
        f.fecha,
        f.hora_salida,
        f.cupo_disponible,
        e.titulo,
        e.precio_base
      FROM FechasExcursion f
      JOIN Excursiones e ON f.id_excursion = e.id_excursion
      WHERE f.id_excursion = ? 
        AND f.estado = 'abierta' 
        AND f.eliminado = 0
        AND f.fecha >= CURDATE()
      ORDER BY f.fecha, f.hora_salida
    `, [idExcursion]);
    
    return rows;
  } catch (err) {
    console.error("❌ Error al obtener fechas:", err.message);
    return [];
  }
}