/**
 * Représente un client de l’entreprise Eventia Location.
 *
 * Cette classe doit regrouper les informations nécessaires pour identifier
 * et contacter un client. Elle doit aussi contenir les règles simples qui
 * permettent de vérifier qu’un client possède des données acceptables avant
 * son enregistrement.
 *
 * Travail demandé :
 * - déterminer les données qui décrivent un client à partir des besoins.
 * - initialiser correctement un nouvel objet client.
 * - prévoir une opération permettant de vérifier sa validité.
 *
 * Ne placez ici aucune logique liée à MongoDB ou aux requêtes HTTP.
 */
export default class Client {
  constructor({ name, email, phone } = {}) {
    this.name = name?.trim?.() ?? name;
    this.email = email?.trim?.().toLowerCase?.() ?? email;
    this.phone = phone?.trim?.() ?? phone;
  }

  isValid() {
    if (!this.name || !this.email || !this.phone) {
      return { ok: false, message: "Les champs name, email et phone sont requis" };
    }
    if (!/^\S+@\S+\.\S+$/.test(this.email)) {
      return { ok: false, message: "Email invalide" };
    }
    return { ok: true };
  }

  toDocument() {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
    };
  }
}
