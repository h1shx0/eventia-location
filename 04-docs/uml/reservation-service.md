# Diagramme UML — Service Réservation

Ce diagramme représente les classes du service Réservation et ses dépendances REST vers les autres services.

```mermaid
classDiagram
direction LR

class ReservationRoutes {
  <<controller>>
  +GET /
  +GET /:id
  +POST /
  +PATCH /:id/cancel
  +DELETE /:id
}

class ReservationService {
  -repository
  -clientBaseUrl : String
  -equipmentBaseUrl : String
  -notificationBaseUrl : String
  +list()
  +getById(id)
  +create(payload)
  +cancel(id)
  +remove(id)
  -getClient(id)
  -getEquipment(id)
  -reserveStock(id, quantity)
  -releaseStock(id, quantity)
  -notify(payload)
}

class ServiceError {
  +status
  +constructor(message, status)
}

class ReservationRepository {
  -model
  +findAll()
  +findById(id)
  +create(data)
  +update(id, data)
  +delete(id)
}

class Reservation {
  +clientId : String
  +equipmentId : String
  +quantity : Number
  +startDate : Date
  +endDate : Date
  +status : String
  +clientName : String
  +equipmentName : String
  +totalPrice : Number
  +constructor(data)
  +billableDays()
  +calculateTotal(dailyPrice)
  +isValid()
  +toDocument()
}

class ReservationModel {
  <<Mongoose Model>>
  +clientId : String
  +clientName : String
  +equipmentId : String
  +equipmentName : String
  +quantity : Number
  +startDate : Date
  +endDate : Date
  +totalPrice : Number
  +status : CONFIRMED|CANCELLED
  +createdAt : Date
  +updatedAt : Date
}

class ClientAPI {
  <<external REST service>>
  +getClient(id)
}

class EquipmentAPI {
  <<external REST service>>
  +getEquipment(id)
  +reserve(id, quantity)
  +release(id, quantity)
}

class NotificationAPI {
  <<external REST service>>
  +createNotification(payload)
}

ReservationRoutes "1" --> "1" ReservationService : utilise
ReservationService "1" --> "1" ReservationRepository : utilise
ReservationService ..> Reservation : crée et valide
ReservationService ..> ServiceError : lève
ReservationRepository "1" --> "0..*" ReservationModel : persiste

ReservationService ..> ClientAPI : REST
ReservationService ..> EquipmentAPI : REST
ReservationService ..> NotificationAPI : REST

Reservation "0..*" --> "1" ClientAPI : référence logique clientId
Reservation "0..*" --> "1" EquipmentAPI : référence logique equipmentId
```

## Responsabilités principales

- `Reservation` valide les identifiants, la quantité et les dates, puis calcule le nombre de jours facturables et le prix total.
- `ReservationService` orchestre la création et l'annulation d'une réservation.
- Le service Réservation vérifie le client et le matériel par REST.
- Il réserve ou libère le stock par le service Matériel.
- Il crée une notification après confirmation ou annulation.
- `ReservationRepository` persiste les réservations dans MongoDB.

> Les relations avec `ClientAPI` et `EquipmentAPI` sont des références logiques entre microservices : la réservation conserve des identifiants (`clientId`, `equipmentId`) plutôt qu'une relation MongoDB directe.
