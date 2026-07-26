import { Router } from "express";
import EquipmentModel from "./models/EquipmentModel.js";
import EquipmentRepository from "./domain/EquipmentRepository.js";
import EquipmentService, { ServiceError } from "./domain/EquipmentService.js";

const router = Router();
const service = new EquipmentService(new EquipmentRepository(EquipmentModel));

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

router.put("/:id/reserve", async (req, res) => {
  try {
    res.status(200).json(await service.reserve(req.params.id, req.body.quantity));
  } catch (error) {
    handle(res, error);
  }
});

router.put("/:id/release", async (req, res) => {
  try {
    res.status(200).json(await service.release(req.params.id, req.body.quantity));
  } catch (error) {
    handle(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.status(200).json(await service.update(req.params.id, req.body));
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
