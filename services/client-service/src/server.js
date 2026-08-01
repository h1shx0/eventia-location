import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes.js";

const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventia_clients";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => res.json({ service: "client-service", status: "UP" }));
app.use("/api/clients", routes);

async function start() {
  await mongoose.connect(MONGO_URI);
  app.listen(PORT, () => console.log(`client-service sur le port ${PORT}`));
}

start().catch((error) => {
  console.error("Échec du démarrage client-service:", error);
  process.exit(1);
});
