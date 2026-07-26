/**
 * Contient la logique applicative du service du matériel.
 *
 * Cette classe orchestre l’entité Equipment et son dépôt. Elle doit gérer le
 * catalogue, valider les nouveaux articles et appliquer les règles de stock
 * lors d’une réservation ou d’une remise en disponibilité.
 *
 * Travail demandé :
 * - recevoir le dépôt de matériel;
 * - exposer les opérations requises par les contrats REST;
 * - valider les données avant la création;
 * - empêcher une réservation lorsque le matériel est absent ou insuffisant;
 * - diminuer ou augmenter la quantité disponible de façon cohérente;
 * - produire des erreurs compréhensibles lorsque l’opération est impossible.
 *
 * Cette classe ne doit pas traiter directement les objets req et res.
 */
import Equipment from "./Equipment.js";

export class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export default class EquipmentService {
  constructor(repository) {
    this.repository = repository;
  }

  async list() {
    return this.repository.findAll();
  }

  async getById(id) {
    const equipment = await this.repository.findById(id);
    if (!equipment) {
      throw new ServiceError("Équipement introuvable", 404);
    }
    return equipment;
  }

  async create(payload) {
    const entity = new Equipment(payload);
    const validation = entity.isValid();
    if (!validation.ok) {
      throw new ServiceError(validation.message, 400);
    }
    return this.repository.create(entity.toDocument());
  }

  async update(id, payload) {
    const entity = new Equipment(payload);
    const validation = entity.isValid();
    if (!validation.ok) {
      throw new ServiceError(validation.message, 400);
    }
    const updated = await this.repository.update(id, entity.toDocument());
    if (!updated) {
      throw new ServiceError("Équipement introuvable", 404);
    }
    return updated;
  }

  async remove(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new ServiceError("Équipement introuvable", 404);
    }
    return deleted;
  }

  async reserve(id, quantity) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      throw new ServiceError("quantity doit être un entier >= 1", 400);
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new ServiceError("Équipement introuvable", 404);
    }

    const entity = new Equipment(existing);
    if (!entity.canReserve(qty)) {
      throw new ServiceError("Quantité insuffisante", 409);
    }

    const updated = await this.repository.reserve(id, qty);
    if (!updated) {
      throw new ServiceError("Quantité insuffisante", 409);
    }
    return updated;
  }

  async release(id, quantity) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      throw new ServiceError("quantity doit être un entier >= 1", 400);
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new ServiceError("Équipement introuvable", 404);
    }

    return this.repository.release(id, qty);
  }
}
