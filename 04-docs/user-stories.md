# User Stories — Eventia Location

## US-01 — Ajouter un client

**En tant qu'employé**, je veux ajouter un client afin de pouvoir l'utiliser lors d'une réservation.

### Critères d'acceptation
- Le nom, le courriel et le téléphone sont obligatoires.
- Le courriel doit avoir un format valide.
- Le courriel doit être unique.
- Le client est enregistré lorsque les données sont valides.

## US-02 — Consulter les clients

**En tant qu'employé**, je veux consulter les clients afin de retrouver leurs coordonnées.

### Critères d'acceptation
- La liste des clients peut être affichée.
- Un client précis peut être retrouvé à partir de son identifiant.
- Une erreur claire est retournée si le client n'existe pas.

## US-03 — Modifier un client

**En tant qu'employé**, je veux modifier les informations d'un client afin de garder ses coordonnées à jour.

### Critères d'acceptation
- Le client doit exister.
- Les nouvelles données doivent être valides.
- Le nouveau courriel doit rester unique.
- Les informations modifiées sont enregistrées.

## US-04 — Supprimer un client

**En tant qu'employé**, je veux supprimer un client afin de retirer une fiche devenue inutile.

### Critères d'acceptation
- Le client doit exister.
- Après suppression, il n'est plus retourné par le service.

## US-05 — Ajouter un équipement

**En tant que responsable de l'inventaire**, je veux ajouter un équipement afin de le rendre disponible à la location.

### Critères d'acceptation
- Le nom et la catégorie sont obligatoires.
- Le prix quotidien doit être supérieur ou égal à 0.
- La quantité disponible doit être un entier supérieur ou égal à 0.
- L'équipement valide est enregistré.

## US-06 — Consulter les équipements

**En tant qu'employé**, je veux consulter le matériel afin de connaître les articles disponibles à la location.

### Critères d'acceptation
- La liste des équipements peut être affichée.
- Un équipement précis peut être retrouvé par son identifiant.
- Une erreur est retournée si l'équipement n'existe pas.

## US-07 — Modifier un équipement

**En tant que responsable de l'inventaire**, je veux modifier un équipement afin de maintenir le catalogue à jour.

### Critères d'acceptation
- L'équipement doit exister.
- Les nouvelles données doivent respecter les règles de validation.
- Les modifications sont enregistrées.

## US-08 — Supprimer un équipement

**En tant que responsable de l'inventaire**, je veux supprimer un équipement afin de retirer un article du catalogue.

### Critères d'acceptation
- L'équipement doit exister.
- Après suppression, il n'est plus retourné par le service.

## US-09 — Créer une réservation

**En tant que préposé**, je veux créer une réservation afin de louer du matériel à un client.

### Critères d'acceptation
- Un client, un équipement, une quantité, une date de début et une date de fin sont fournis.
- Le client doit exister.
- L'équipement doit exister.
- La quantité doit être un entier supérieur ou égal à 1.
- La date de fin ne doit pas précéder la date de début.
- Le stock disponible doit être suffisant.
- Le prix total inclut le premier et le dernier jour.
- Le stock est diminué lorsque la réservation est confirmée.
- La réservation est créée avec le statut `CONFIRMED`.
- Une notification de confirmation est créée.

## US-10 — Consulter les réservations

**En tant qu'employé**, je veux consulter les réservations afin de suivre les locations en cours et passées.

### Critères d'acceptation
- La liste des réservations peut être affichée.
- Une réservation contient les informations utiles sur le client, le matériel, la quantité, les dates, le prix total et le statut.

## US-11 — Annuler une réservation

**En tant qu'employé**, je veux annuler une réservation afin de remettre le matériel dans l'inventaire.

### Critères d'acceptation
- La réservation doit exister.
- Une réservation déjà annulée ne peut pas être annulée à nouveau.
- La quantité réservée est remise dans l'inventaire.
- Le statut devient `CANCELLED`.
- Une notification d'annulation est créée.

## US-12 — Consulter les notifications

**En tant qu'employé**, je veux consulter les notifications afin de voir l'historique des opérations importantes.

### Critères d'acceptation
- Les notifications sont affichées de la plus récente à la plus ancienne.
- Chaque notification indique au minimum son destinataire et son message.

## US-13 — Créer automatiquement une notification

**En tant que système**, je veux enregistrer une notification après une confirmation ou une annulation afin de conserver une trace de l'opération.

### Critères d'acceptation
- Une confirmation crée une notification de type `RESERVATION_CONFIRMED`.
- Une annulation crée une notification de type `RESERVATION_CANCELLED`.
- La notification est enregistrée dans MongoDB.
- Aucun véritable courriel n'est requis.
