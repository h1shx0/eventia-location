# Analyse et conception — Eventia Location

## Exigences fonctionnelles

1. **EF-01** CRUD clients (nom, courriel unique, téléphone).
2. **EF-02** CRUD matériel (nom, catégorie, prix quotidien, quantité disponible).
3. **EF-03** Créer une réservation (client, matériel, quantité, dates).
4. **EF-04** Valider existence client/matériel, quantité ≥ 1, endDate ≥ startDate, stock suffisant.
5. **EF-05** À la confirmation : diminuer le stock ; à l'annulation : le remettre.
6. **EF-06** Prix total = jours inclusifs × quantité × prix quotidien.
7. **EF-07** Enregistrer une notification après confirmation/annulation (pas de vrai courriel).
8. **EF-08** Lister les notifications (plus récentes en premier).
9. **EF-09** Usage employés uniquement, pas d'authentification en v1.

## User stories

- **US-01** En tant qu'employé, je veux enregistrer un client avec un courriel unique.
- **US-02** En tant qu'employé, je veux gérer le catalogue de matériel et son stock.
- **US-03** En tant que préposée, je veux créer une réservation validée avec calcul du total.
- **US-04** En tant que préposée, je veux annuler une réservation et libérer le stock.
- **US-05** En tant que directrice, je veux consulter l'historique des notifications.

## Architecture des classes (par service)

```
routes.js → *Service → * (entité domaine)
                     → *Repository → *Model (Mongoose)
```

### Client
`Client` (name, email, phone, isValid) · `ClientRepository` · `ClientService`

### Equipment
`Equipment` (name, category, dailyPrice, availableQuantity, canReserve) · `EquipmentRepository` (reserve/release atomiques) · `EquipmentService`

### Reservation
`Reservation` (billableDays, calculateTotal, isValid) · `ReservationRepository` · `ReservationService` (Axios → client / equipment / notification)

### Notification
`Notification` (recipient, message, type) · `NotificationRepository` · `NotificationService`
