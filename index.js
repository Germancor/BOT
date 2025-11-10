import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { initWhatsAppBot } from "./bot/whatsapp.js";

const app = express();
const client = initWhatsAppBot();

app.get("/", (req, res) => {
  res.send("🤖 Bot de Turismo Tucumán activo!");
});

const server = app.listen(3000, () => {
  console.log("🌐 Servidor corriendo en http://localhost:3000");
});

process.on("SIGINT", async () => {
  console.log("\n🛑 Cerrando bot y servidor...");
  try {
    await client.destroy();
  } catch (error) {
    console.log("⚠️ Error al cerrar (ignorado)");
  }
  server.close(() => console.log("✅ Servidor cerrado"));
  process.exit(0);
});