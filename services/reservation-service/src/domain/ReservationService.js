/**
 * Orchestre le cas d’utilisation principal de réservation.
 *
 * Cette classe coordonne l’entité Reservation, son dépôt et les autres
 * microservices. Pour confirmer une réservation, elle doit vérifier les
 * données, obtenir les informations du client et du matériel, réserver la
 * quantité demandée, calculer le total, enregistrer la réservation et produire
 * une notification. Pour une annulation, elle doit remettre le matériel en
 * disponibilité, changer l’état de la réservation et produire une nouvelle
 * notification.
 *
 * Travail demandé :
 * - recevoir le dépôt de réservations.
 * - configurer les adresses des services externes à partir de l’environnement.
 * - fournir les opérations prévues par les contrats REST.
 * - utiliser Axios pour communiquer avec les autres services.
 * - gérer les erreurs : données invalides, ressource absente, stock insuffisant
 *   et réservation déjà annulée.
 * - préserver la cohérence des données autant que possible.
 *
 * Cette classe ne doit pas manipuler directement les objets req et res et ne
 * doit pas exécuter directement de requêtes Mongoose.
 */
import axios from "axios";
import Reservation from "./Reservation.js";

export class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export default class ReservationService {
  constructor(repository, urls = {}) {
    this.repository = repository;
    this.clientBaseUrl =
      urls.clientServiceUrl ||
      process.env.CLIENT_SERVICE_URL ||
      "http://localhost:4001";
    this.equipmentBaseUrl =
      urls.equipmentServiceUrl ||
      process.env.EQUIPMENT_SERVICE_URL ||
      "http://localhost:4002";
    this.notificationBaseUrl =
      urls.notificationServiceUrl ||
      process.env.NOTIFICATION_SERVICE_URL ||
      "http://localhost:4004";
  }

  async list() {
    return this.repository.findAll();
  }

  async getById(id) {
    const reservation = await this.repository.findById(id);
    if (!reservation) {
      throw new ServiceError("Réservation introuvable", 404);
    }
    return reservation;
  }

  async create(payload) {
    const entity = new Reservation(payload);
    const validation = entity.isValid();
    if (!validation.ok) {
      throw new ServiceError(validation.message, 400);
    }

    const client = await this.#getClient(entity.clientId);
    const equipment = await this.#getEquipment(entity.equipmentId);

    await this.#reserveStock(entity.equipmentId, entity.quantity);

    entity.clientName = client.name;
    entity.equipmentName = equipment.name;
    entity.totalPrice = entity.calculateTotal(equipment.dailyPrice);
    entity.status = "CONFIRMED";

    let reservation;
    try {
      reservation = await this.repository.create(entity.toDocument());
    } catch (error) {
      await this.#releaseStock(entity.equipmentId, entity.quantity);
      throw error;
    }

    await this.#notify({
      recipient: client.email || client.name,
      message: `Réservation confirmée pour ${equipment.name} (x${entity.quantity}) — total ${entity.totalPrice}$`,
      type: "RESERVATION_CONFIRMED",
    });

    return reservation;
  }

  async cancel(id) {
    const reservation = await this.repository.findById(id);
    if (!reservation) {
      throw new ServiceError("Réservation introuvable", 404);
    }
    if (reservation.status === "CANCELLED") {
      throw new ServiceError("La réservation est déjà annulée", 400);
    }

    await this.#releaseStock(reservation.equipmentId, reservation.quantity);

    const updated = await this.repository.update(id, { status: "CANCELLED" });

    await this.#notify({
      recipient: reservation.clientName,
      message: `Réservation annulée pour ${reservation.equipmentName} (x${reservation.quantity})`,
      type: "RESERVATION_CANCELLED",
    });

    return updated;
  }

  async remove(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new ServiceError("Réservation introuvable", 404);
    }
    return deleted;
  }

  async #getClient(id) {
    try {
      const { data } = await axios.get(
        `${this.clientBaseUrl}/api/clients/${id}`
      );
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ServiceError("Client introuvable", 404);
      }
      throw new ServiceError("Impossible de contacter le service client", 502);
    }
  }

  async #getEquipment(id) {
    try {
      const { data } = await axios.get(
        `${this.equipmentBaseUrl}/api/equipments/${id}`
      );
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ServiceError("Équipement introuvable", 404);
      }
      throw new ServiceError(
        "Impossible de contacter le service matériel",
        502
      );
    }
  }

  async #reserveStock(id, quantity) {
    try {
      const { data } = await axios.put(
        `${this.equipmentBaseUrl}/api/equipments/${id}/reserve`,
        { quantity }
      );
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ServiceError("Équipement introuvable", 404);
      }
      if (error.response?.status === 409) {
        throw new ServiceError(
          error.response.data?.message || "Quantité insuffisante",
          409
        );
      }
      if (error.response?.status === 400) {
        throw new ServiceError(
          error.response.data?.message || "Données invalides",
          400
        );
      }
      throw new ServiceError("Impossible de réserver le stock", 502);
    }
  }

  async #releaseStock(id, quantity) {
    try {
      const { data } = await axios.put(
        `${this.equipmentBaseUrl}/api/equipments/${id}/release`,
        { quantity }
      );
      return data;
    } catch (error) {
      throw new ServiceError("Impossible de libérer le stock", 502);
    }
  }

  async #notify(payload) {
    try {
      const { data } = await axios.post(
        `${this.notificationBaseUrl}/api/notifications`,
        payload
      );
      return data;
    } catch (error) {
      throw new ServiceError("Impossible de créer la notification", 502);
    }
  }
}
