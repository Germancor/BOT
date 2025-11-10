// bot/botWhatsapp.js
import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { getMenuResponse } from "./responses/menu.js";

const client = new Client();

// Evento cuando el cliente está listo
client.on("ready", () => {
  console.log("✅ Bot de WhatsApp conectado y listo!");
});

// Evento para mostrar el código QR en la consola
client.on("qr", (qr) => {
  console.log("\n📱 Escanea este código QR con WhatsApp:\n");
  qrcode.generate(qr, { small: true });
});

// Evento cuando llega un mensaje
client.on("message", async (message) => {
  const userId = message.from;
  const userMessage = message.body.trim();
  
  // Ignorar mensajes de grupos
  if (userId.includes("@g.us")) {
    console.log("⚠️ Mensaje de grupo ignorado");
    return;
  }
  
  console.log(`\n📨 Mensaje de ${userId.split('@')[0]}: "${userMessage}"`);
  
  try {
    // Generar respuesta usando tu sistema de menú
    const respuesta = await getMenuResponse(userId, userMessage);
    
    // Enviar respuesta
    await message.reply(respuesta);
    
    console.log("✅ Respuesta enviada");
  } catch (error) {
    console.error("❌ Error al procesar mensaje:", error.message);
    console.error(error.stack);
    
    // Respuesta de error al usuario
    await message.reply("Lo siento, hubo un error. Intenta de nuevo escribiendo *menu*.");
  }
});

// Evento cuando se desconecta
client.on("disconnected", (reason) => {
  console.log("⚠️ Bot desconectado:", reason);
});

console.log("🚀 Iniciando bot de WhatsApp...");
client.initialize();