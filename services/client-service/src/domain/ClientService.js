/**
 * Contient la logique applicative du service des clients.
 *
 * Cette classe constitue l’intermédiaire entre les routes REST, l’entité
 * Client et le dépôt de clients. Elle doit appliquer les règles métier avant
 * de demander au dépôt de lire ou de modifier les données.
 *
 * Travail demandé :
 * - recevoir le dépôt nécessaire à son fonctionnement;
 * - offrir les opérations correspondant aux cas d’utilisation du service;
 * - créer et valider l’entité appropriée avant un enregistrement;
 * - déléguer la persistance au dépôt;
 * - signaler clairement les données invalides.
 *
 * Cette classe ne doit pas utiliser directement Express ni Mongoose.
 */
import Client from "./Client.js";

export class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export default class ClientService {
  constructor(repository) {
    this.repository = repository;
  }

  async list() {
    return this.repository.findAll();
  }

  async getById(id) {
    const client = await this.repository.findById(id);
    if (!client) {
      throw new ServiceError("Client introuvable", 404);
    }
    return client;
  }

  async create(payload) {
    const entity = new Client(payload);
    const validation = entity.isValid();
    if (!validation.ok) {
      throw new ServiceError(validation.message, 400);
    }

    const existing = await this.repository.findByEmail(entity.email);
    if (existing) {
      throw new ServiceError("Email déjà utilisé", 409);
    }

    try {
      return await this.repository.create(entity.toDocument());
    } catch (error) {
      if (error.code === 11000) {
        throw new ServiceError("Email déjà utilisé", 409);
      }
      throw error;
    }
  }

  async update(id, payload) {
    const entity = new Client(payload);
    const validation = entity.isValid();
    if (!validation.ok) {
      throw new ServiceError(validation.message, 400);
    }

    const current = await this.repository.findById(id);
    if (!current) {
      throw new ServiceError("Client introuvable", 404);
    }

    if (entity.email !== current.email) {
      const existing = await this.repository.findByEmail(entity.email);
      if (existing) {
        throw new ServiceError("Email déjà utilisé", 409);
      }
    }

    const updated = await this.repository.update(id, entity.toDocument());
    if (!updated) {
      throw new ServiceError("Client introuvable", 404);
    }
    return updated;
  }

  async remove(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new ServiceError("Client introuvable", 404);
    }
    return deleted;
  }
}
