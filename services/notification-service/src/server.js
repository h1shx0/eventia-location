import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes.js";

const PORT = process.env.PORT || 4004;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventia_notifications";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "notification-service", status: "UP" })
);
app.use("/api/notifications", routes);

async function start() {
  await mongoose.connect(MONGO_URI);
  app.listen(PORT, () =>
    console.log(`notification-service sur le port ${PORT}`)
  );
}

start().catch((error) => {
  console.error("Échec du démarrage notification-service:", error);
  process.exit(1);
});
