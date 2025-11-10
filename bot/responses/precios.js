// bot/responses/precios.js
import { getPrecioExcursion } from "../queries/excursionesqueries.js";

/**
 * Muestra el precio y detalles de una excursión
 */
export async function mostrarPrecio(idExcursion) {
  const excursion = await getPrecioExcursion(idExcursion);
  
  if (!excursion) {
    return "😔 No se encontró información de precio para esta excursión.\n\nEscribí *menu* para volver al inicio.";
  }

  let mensaje = `💰 *PRECIO - ${excursion.titulo.toUpperCase()}*\n\n`;
  
  mensaje += `💵 *Precio por persona:* $${excursion.precio_base.toLocaleString('es-AR')}\n\n`;
  
  mensaje += `⏱️ *Duración:* ${excursion.duracion}\n\n`;
  
  if (excursion.incluye) {
    mensaje += `✅ *Incluye:*\n${excursion.incluye}\n\n`;
  }
  
  mensaje += "━━━━━━━━━━━━━━━━━━━\n";
  mensaje += "📱 Para reservar o más info, escribí *asesor*\n";
  mensaje += "🔙 Escribí *volver* para elegir otra opción\n";
  mensaje += "🏠 Escribí *menu* para volver al inicio";
  
  return mensaje;
}