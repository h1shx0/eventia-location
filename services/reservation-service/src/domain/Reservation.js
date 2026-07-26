/**
 * Représente une réservation de matériel effectuée par un client.
 *
 * Cette classe porte les données et calculs propres à une réservation. Elle
 * doit notamment interpréter correctement les dates et la quantité, vérifier
 * la cohérence de la période demandée et participer au calcul du montant de la
 * location à partir du prix quotidien fourni par le service du matériel.
 *
 * Travail demandé :
 * - déduire toutes les données d’une réservation à partir des besoins.
 * - normaliser les nombres et les dates lors de la création de l’objet.
 * - attribuer un état initial lorsqu’il n’est pas fourni.
 * - calculer la durée facturable de la location.
 * - calculer le total à partir de la durée, de la quantité et d’un prix.
 * - vérifier la validité de la réservation.
 *
 * Cette classe ne doit appeler aucun autre service et ne doit pas utiliser
 * directement MongoDB.
 */
export default class Reservation {
  constructor({
    clientId,
    equipmentId,
    quantity,
    startDate,
    endDate,
    status,
    clientName,
    equipmentName,
    totalPrice,
  } = {}) {
    this.clientId = clientId;
    this.equipmentId = equipmentId;
    this.quantity = Number(quantity);
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.status = status || "CONFIRMED";
    this.clientName = clientName;
    this.equipmentName = equipmentName;
    this.totalPrice = totalPrice !== undefined ? Number(totalPrice) : undefined;
  }

  /**
   * Nombre de jours facturables (premier et dernier jour inclus).
   */
  billableDays() {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((end - start) / msPerDay) + 1;
  }

  calculateTotal(dailyPrice) {
    return this.billableDays() * this.quantity * Number(dailyPrice);
  }

  isValid() {
    if (!this.clientId || !this.equipmentId) {
      return {
        ok: false,
        message: "clientId et equipmentId sont requis",
      };
    }
    if (!Number.isInteger(this.quantity) || this.quantity < 1) {
      return {
        ok: false,
        message: "La quantité doit être un entier >= 1",
      };
    }
    if (
      !this.startDate ||
      !this.endDate ||
      Number.isNaN(this.startDate.getTime()) ||
      Number.isNaN(this.endDate.getTime())
    ) {
      return { ok: false, message: "Dates invalides" };
    }
    if (this.endDate < this.startDate) {
      return {
        ok: false,
        message: "La date de fin ne peut pas précéder la date de début",
      };
    }
    return { ok: true };
  }

  toDocument() {
    return {
      clientId: this.clientId,
      clientName: this.clientName,
      equipmentId: this.equipmentId,
      equipmentName: this.equipmentName,
      quantity: this.quantity,
      startDate: this.startDate,
      endDate: this.endDate,
      totalPrice: this.totalPrice,
      status: this.status,
    };
  }
}
