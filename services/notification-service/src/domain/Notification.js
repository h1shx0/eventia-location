/**
 * Représente une notification produite par l’application.
 *
 * Une notification conserve les informations nécessaires pour savoir à qui
 * elle est destinée, quel message doit être communiqué et dans quel contexte
 * elle a été créée. Dans ce laboratoire, l’envoi est simulé par un
 * enregistrement dans MongoDB.
 *
 * Travail demandé :
 * - déterminer les données pertinentes d’une notification;
 * - fournir une valeur raisonnable lorsqu’une information optionnelle manque;
 * - vérifier qu’une notification contient le minimum nécessaire.
 *
 * Cette classe ne doit pas accéder à MongoDB et ne doit pas envoyer de courriel.
 */
export default class Notification {
  constructor({ recipient, message, type } = {}) {
    this.recipient = recipient?.trim?.() ?? recipient;
    this.message = message?.trim?.() ?? message;
    this.type = (type?.trim?.() ?? type) || "INFO";
  }

  isValid() {
    if (!this.recipient || !this.message) {
      return {
        ok: false,
        message: "Les champs recipient et message sont requis",
      };
    }
    return { ok: true };
  }

  toDocument() {
    return {
      recipient: this.recipient,
      message: this.message,
      type: this.type,
    };
  }
}
