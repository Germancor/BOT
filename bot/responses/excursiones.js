// bot/responses/excursiones.js
import { getExcursionesActivas } from "../queries/excursionesqueries.js";

/**
 * Lista todas las excursiones disponibles
 */
export async function listarExcursiones() {
  const excursiones = await getExcursionesActivas();
  
  if (!excursiones.length) {
    return "😔 Lo siento, no hay excursiones disponibles en este momento.\n\nEscribí *menu* para volver al inicio.";
  }

  let mensaje = "🌄 *EXCURSIONES DISPONIBLES EN TUCUMÁN*\n\n";
  
  excursiones.forEach((exc, index) => {
    const numero = index + 1;
    mensaje += `*${numero}.* ${exc.titulo}\n`;
    mensaje += `📍 ${exc.ubicacion}\n`;
    mensaje += `⏱️ Duración: ${exc.duracion}\n`;
    mensaje += `💰 Desde $${exc.precio_base.toLocaleString('es-AR')}\n\n`;
  });
  
  mensaje += "━━━━━━━━━━━━━━━━━━━\n";
  mensaje += "Escribí el *número* de la excursión que te interesa para más información.";
  
  return mensaje;
}

/**
 * Obtiene el índice de la excursión según el número elegido
 */
export async function getExcursionPorNumero(numero) {
  const excursiones = await getExcursionesActivas();
  const index = numero - 1;
  
  if (index >= 0 && index < excursiones.length) {
    return excursiones[index];
  }
  
  return null;
}