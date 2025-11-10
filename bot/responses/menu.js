// bot/responses/menu.js
import { 
  getSession, 
  setStep, 
  setExcursionSeleccionada, 
  getExcursionSeleccionada,
  resetSession 
} from "../sessionManager.js";
import { listarExcursiones, getExcursionPorNumero } from "./excursiones.js";
import { mostrarPrecio } from "./precios.js";
import { mostrarFechas } from "./fechas.js";
import { cleanMessage } from "../utils.js";

/**
 * Función principal que maneja todas las respuestas del menú
 */
export async function getMenuResponse(userId, userMessage) {
  const mensaje = cleanMessage(userMessage);
  const session = getSession(userId);
  
  console.log(`👤 Usuario: ${userId.split('@')[0]} | Step: ${session.step} | Mensaje: "${mensaje}"`);
  
  // Comandos globales
  if (mensaje === "menu" || mensaje === "inicio" || mensaje === "hola") {
    resetSession(userId);
    return await mensajeBienvenida();
  }
  
  if (mensaje === "volver") {
    return await manejarVolver(userId);
  }
  
  if (mensaje === "asesor" || mensaje === "contacto") {
    return mensajeAsesor();
  }
  
  // Flujo según el step actual
  switch (session.step) {
    case "start":
      return await manejarInicio(userId);
    
    case "lista_excursiones":
      return await manejarSeleccionExcursion(userId, mensaje);
    
    case "submenu_excursion":
      return await manejarSubmenu(userId, mensaje);
    
    default:
      return "No entendí tu mensaje. Escribí *menu* para volver al inicio.";
  }
}

/**
 * Mensaje de bienvenida inicial
 */
async function mensajeBienvenida() {
  return await listarExcursiones();
}

/**
 * Maneja el inicio - muestra lista de excursiones
 */
async function manejarInicio(userId) {
  setStep(userId, "lista_excursiones");
  return await listarExcursiones();
}

/**
 * Maneja la selección de una excursión por número
 */
async function manejarSeleccionExcursion(userId, mensaje) {
  const numero = parseInt(mensaje);
  
  if (isNaN(numero)) {
    return "❌ Por favor, escribí el *número* de la excursión que te interesa.\n\nEscribí *menu* para ver las opciones nuevamente.";
  }
  
  const excursion = await getExcursionPorNumero(numero);
  
  if (!excursion) {
    return "❌ Número inválido. Por favor, elegí un número de la lista.\n\nEscribí *menu* para ver las excursiones disponibles.";
  }
  
  // Guardar la excursión seleccionada
  setExcursionSeleccionada(userId, excursion.id_excursion);
  setStep(userId, "submenu_excursion");
  
  // Mostrar submenú
  let respuesta = `✅ Seleccionaste: *${excursion.titulo}*\n\n`;
  respuesta += `📍 ${excursion.ubicacion}\n`;
  respuesta += `📝 ${excursion.descripcion}\n\n`;
  respuesta += "━━━━━━━━━━━━━━━━━━━\n";
  respuesta += "¿Qué querés consultar?\n\n";
  respuesta += "*1.* 💰 Ver precio\n";
  respuesta += "*2.* 📅 Ver fechas disponibles\n\n";
  respuesta += "🔙 Escribí *volver* para elegir otra excursión\n";
  respuesta += "🏠 Escribí *menu* para volver al inicio";

  return respuesta;
}

/**
 * Maneja el submenú (precio o fechas)
 */
async function manejarSubmenu(userId, mensaje) {
  const idExcursion = getExcursionSeleccionada(userId);
  
  if (!idExcursion) {
    resetSession(userId);
    return "❌ Hubo un error. Por favor, empezá de nuevo.\n\nEscribí *menu* para comenzar.";
  }
  
  if (mensaje === "1") {
    // Mostrar precio
    return await mostrarPrecio(idExcursion);
  }
  
  if (mensaje === "2") {
    // Mostrar fechas
    return await mostrarFechas(idExcursion);
  }
  
  return "❌ Por favor, elegí una opción válida:\n\n*1* para ver precio\n*2* para ver fechas\n\n🔙 Escribí *volver* para elegir otra excursión";
}

/**
 * Maneja el comando "volver"
 */
async function manejarVolver(userId) {
  const session = getSession(userId);
  
  if (session.step === "submenu_excursion") {
    // Volver a la lista de excursiones
    setStep(userId, "lista_excursiones");
    setExcursionSeleccionada(userId, null);
    return await listarExcursiones();
  }
  
  // Si está en cualquier otro paso, volver al inicio
  resetSession(userId);
  return await mensajeBienvenida();
}

/**
 * Mensaje para contactar con un asesor
 */
function mensajeAsesor() {
  let mensaje = "👤 *CONTACTO CON ASESOR*\n\n";
  mensaje += "📱 WhatsApp: +54 9 381 XXX-XXXX\n";
  mensaje += "📧 Email: info@turismomaavyt.com\n";
  mensaje += "⏰ Horario: Lun a Vie 9:00 a 18:00hs\n\n";
  mensaje += "Un asesor te atenderá personalmente para coordinar tu reserva. 😊\n\n";
  mensaje += "🏠 Escribí *menu* para volver al inicio";
  
  return mensaje;
}