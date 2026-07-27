import { Router } from "express";
import NotificationModel from "./models/NotificationModel.js";
import NotificationRepository from "./domain/NotificationRepository.js";
import NotificationService, {
  ServiceError,
} from "./domain/NotificationService.js";

const router = Router();
const service = new NotificationService(
  new NotificationRepository(NotificationModel)
);

function handle(res, error) {
  if (error instanceof ServiceError) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: "Erreur interne du serveur" });
}

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await service.list());
  } catch (error) {
    handle(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json(await service.create(req.body));
  } catch (error) {
    handle(res, error);
  }
});

export default router;
