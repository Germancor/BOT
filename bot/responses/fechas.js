// bot/responses/fechas.js
import { getFechasDisponibles } from "../queries/excursionesqueries.js";

/**
 * Muestra las fechas disponibles de una excursión
 */
export async function mostrarFechas(idExcursion) {
  const fechas = await getFechasDisponibles(idExcursion);
  
  if (!fechas.length) {
    return "😔 No hay fechas disponibles para esta excursión en este momento.\n\nEscribí *menu* para volver al inicio.";
  }

  const titulo = fechas[0].titulo;
  let mensaje = `📅 *FECHAS DISPONIBLES - ${titulo.toUpperCase()}*\n\n`;
  
  fechas.forEach((fecha, index) => {
    const numero = index + 1;
    const fechaFormateada = formatearFecha(fecha.fecha);
    const horaFormateada = formatearHora(fecha.hora_salida);
    
    mensaje += `*${numero}.* ${fechaFormateada}\n`;
    mensaje += `🕐 Salida: ${horaFormateada}\n`;
    mensaje += `👥 Cupos disponibles: ${fecha.cupo_disponible}\n`;
    mensaje += `💰 Precio: $${fecha.precio_base.toLocaleString('es-AR')}\n\n`;
  });
  
  mensaje += "━━━━━━━━━━━━━━━━━━━\n";
  mensaje += "📱 Para reservar, escribí *asesor*\n";
  mensaje += "🔙 Escribí *volver* para elegir otra opción\n";
  mensaje += "🏠 Escribí *menu* para volver al inicio";
  
  return mensaje;
}

/**
 * Formatea una fecha a formato legible en español
 */
function formatearFecha(fecha) {
  const date = new Date(fecha);
  // Ajustar por zona horaria
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  
  const opciones = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('es-AR', opciones);
}

/**
 * Formatea una hora a formato legible
 */
function formatearHora(hora) {
  if (!hora) return 'A confirmar';
  
  // hora viene como "07:00:00" o como objeto Time
  const horaStr = hora.toString();
  const [hh, mm] = horaStr.split(':');
  
  return `${hh}:${mm}hs`;
}