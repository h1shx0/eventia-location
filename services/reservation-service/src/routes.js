import { Router } from "express";
import ReservationModel from "./models/ReservationModel.js";
import ReservationRepository from "./domain/ReservationRepository.js";
import ReservationService, {
  ServiceError,
} from "./domain/ReservationService.js";

const router = Router();
const service = new ReservationService(
  new ReservationRepository(ReservationModel)
);

function handle(res, error) {
  if (error instanceof ServiceError) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Identifiant invalide" });
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

router.get("/:id", async (req, res) => {
  try {
    res.status(200).json(await service.getById(req.params.id));
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

router.patch("/:id/cancel", async (req, res) => {
  try {
    res.status(200).json(await service.cancel(req.params.id));
  } catch (error) {
    handle(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    handle(res, error);
  }
});

export default router;
