/**
 * Représente un matériel disponible à la location.
 *
 * Cette classe doit regrouper les informations commerciales et de stock d’un
 * article loué par Eventia Location. Elle porte aussi les règles permettant
 * de vérifier la cohérence d’un matériel et de déterminer si une quantité
 * demandée peut être réservée.
 *
 * Travail demandé :
 * - déduire les données nécessaires à partir du dialogue et des contrats REST;
 * - convertir les valeurs numériques lorsque cela est nécessaire;
 * - vérifier la validité générale d’un matériel;
 * - vérifier si le stock permet une réservation donnée.
 *
 * Ne placez ici aucune logique MongoDB, Express ou Axios.
 */
export default class Equipment {
  constructor({ name, category, dailyPrice, availableQuantity } = {}) {
    this.name = name?.trim?.() ?? name;
    this.category = category?.trim?.() ?? category;
    this.dailyPrice = Number(dailyPrice);
    this.availableQuantity = Number(availableQuantity);
  }

  isValid() {
    if (!this.name || !this.category) {
      return { ok: false, message: "Les champs name et category sont requis" };
    }
    if (Number.isNaN(this.dailyPrice) || this.dailyPrice < 0) {
      return { ok: false, message: "dailyPrice doit être un nombre >= 0" };
    }
    if (
      !Number.isInteger(this.availableQuantity) ||
      this.availableQuantity < 0
    ) {
      return {
        ok: false,
        message: "availableQuantity doit être un entier >= 0",
      };
    }
    return { ok: true };
  }

  canReserve(quantity) {
    const qty = Number(quantity);
    return Number.isInteger(qty) && qty >= 1 && this.availableQuantity >= qty;
  }

  toDocument() {
    return {
      name: this.name,
      category: this.category,
      dailyPrice: this.dailyPrice,
      availableQuantity: this.availableQuantity,
    };
  }
}
