# Exigences fonctionnelles — Eventia Location

## 1. Gestion des clients

- **EF-01** — Le système doit permettre d'enregistrer un client avec son nom, son courriel et son téléphone.
- **EF-02** — Le système doit permettre de consulter la liste des clients.
- **EF-03** — Le système doit permettre de consulter un client précis.
- **EF-04** — Le système doit permettre de modifier les informations d'un client.
- **EF-05** — Le système doit permettre de supprimer un client.
- **EF-06** — Le courriel d'un client doit être unique.
- **EF-07** — Un client ne peut pas être enregistré si les données obligatoires sont invalides ou manquantes.

## 2. Gestion du matériel

- **EF-08** — Le système doit permettre d'ajouter un équipement avec un nom, une catégorie, un prix quotidien et une quantité disponible.
- **EF-09** — Le système doit permettre de consulter la liste des équipements.
- **EF-10** — Le système doit permettre de consulter un équipement précis.
- **EF-11** — Le système doit permettre de modifier un équipement.
- **EF-12** — Le système doit permettre de supprimer un équipement.
- **EF-13** — Le prix quotidien doit être supérieur ou égal à 0.
- **EF-14** — La quantité disponible doit être un entier supérieur ou égal à 0.
- **EF-15** — Le système doit permettre de réserver une quantité d'un équipement seulement si le stock disponible est suffisant.
- **EF-16** — Lorsqu'une quantité est réservée, le stock disponible doit diminuer.
- **EF-17** — Lorsqu'une réservation est annulée, la quantité réservée doit être remise dans l'inventaire.

## 3. Gestion des réservations

- **EF-18** — Le système doit permettre de créer une réservation en sélectionnant un client, un équipement, une quantité, une date de début et une date de fin.
- **EF-19** — Avant de confirmer une réservation, le système doit vérifier que le client existe.
- **EF-20** — Avant de confirmer une réservation, le système doit vérifier que l'équipement existe.
- **EF-21** — La quantité demandée doit être un entier supérieur ou égal à 1.
- **EF-22** — La date de fin ne doit pas précéder la date de début.
- **EF-23** — Le système doit vérifier que la quantité demandée est disponible avant de confirmer la réservation.
- **EF-24** — Une réservation créée avec succès doit avoir le statut `CONFIRMED`.
- **EF-25** — Le prix total doit être calculé avec la formule : nombre de jours facturables × quantité × prix quotidien.
- **EF-26** — Le premier et le dernier jour de la période doivent être inclus dans le nombre de jours facturables.
- **EF-27** — Le système doit conserver dans la réservation le nom du client et le nom de l'équipement afin d'enrichir l'affichage.
- **EF-28** — Le système doit permettre de consulter les réservations.
- **EF-29** — Le système doit permettre d'annuler une réservation existante.
- **EF-30** — Une réservation annulée doit avoir le statut `CANCELLED`.
- **EF-31** — Une réservation déjà annulée ne doit pas pouvoir être annulée une deuxième fois.
- **EF-32** — Lorsqu'une réservation est annulée, le stock correspondant doit être remis dans le service matériel.

## 4. Gestion des notifications

- **EF-33** — Après la confirmation d'une réservation, le système doit créer une notification.
- **EF-34** — Après l'annulation d'une réservation, le système doit créer une notification.
- **EF-35** — Une notification doit contenir au minimum un destinataire et un message.
- **EF-36** — Une notification peut contenir un type; la valeur `INFO` est utilisée par défaut lorsqu'aucun type n'est fourni.
- **EF-37** — Le système doit permettre de consulter l'historique des notifications de la plus récente à la plus ancienne.
- **EF-38** — Dans cette version, les notifications sont enregistrées dans MongoDB; aucun véritable courriel n'est envoyé.

## 5. Architecture et intégration

- **EF-39** — Les domaines Client, Matériel, Réservation et Notification doivent être séparés en services.
- **EF-40** — Chaque service doit posséder sa propre base de données MongoDB.
- **EF-41** — Les services doivent communiquer au moyen d'API REST.
- **EF-42** — Le service Réservation doit communiquer avec le service Client pour valider le client.
- **EF-43** — Le service Réservation doit communiquer avec le service Matériel pour consulter l'équipement et réserver ou libérer le stock.
- **EF-44** — Le service Réservation doit communiquer avec le service Notification après une confirmation ou une annulation.
- **EF-45** — Le frontend React doit utiliser les services sans nécessiter d'authentification dans cette première version.
