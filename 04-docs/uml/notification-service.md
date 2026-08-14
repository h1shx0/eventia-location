# Diagramme UML — Service Notification

Ce diagramme représente les classes et modules utilisés par le service Notification.

```mermaid
classDiagram
direction TB

class NotificationRoutes {
  <<controller>>
  +GET /
  +POST /
}

class NotificationService {
  -repository
  +list()
  +create(payload)
}

class ServiceError {
  +status
  +constructor(message, status)
}

class NotificationRepository {
  -model
  +findAllNewestFirst()
  +create(data)
}

class Notification {
  +recipient : String
  +message : String
  +type : String
  +constructor(data)
  +isValid()
  +toDocument()
}

class NotificationModel {
  <<Mongoose Model>>
  +recipient : String
  +message : String
  +type : String
  +createdAt : Date
  +updatedAt : Date
}

NotificationRoutes "1" --> "1" NotificationService : utilise
NotificationService "1" --> "1" NotificationRepository : utilise
NotificationService ..> Notification : crée et valide
NotificationService ..> ServiceError : lève
NotificationRepository "1" --> "0..*" NotificationModel : persiste
```

## Responsabilités principales

- `Notification` contient le destinataire, le message et le type de notification.
- `NotificationService` valide puis enregistre les notifications.
- `NotificationRepository` récupère les notifications de la plus récente à la plus ancienne et les persiste dans MongoDB.
- `NotificationRoutes` joue le rôle de contrôleur HTTP.
