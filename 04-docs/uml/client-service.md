# Diagramme UML — Service Client

Ce diagramme représente les classes et modules utilisés par le service Client.

```mermaid
classDiagram
direction TB

class ClientRoutes {
  <<controller>>
  +GET /
  +GET /:id
  +POST /
  +PUT /:id
  +DELETE /:id
}

class ClientService {
  -repository
  +list()
  +getById(id)
  +create(payload)
  +update(id, payload)
  +remove(id)
}

class ServiceError {
  +status
  +constructor(message, status)
}

class ClientRepository {
  -model
  +findAll()
  +findById(id)
  +findByEmail(email)
  +create(data)
  +update(id, data)
  +delete(id)
}

class Client {
  +name : String
  +email : String
  +phone : String
  +constructor(data)
  +isValid()
  +toDocument()
}

class ClientModel {
  <<Mongoose Model>>
  +name : String
  +email : String
  +phone : String
  +createdAt : Date
  +updatedAt : Date
}

ClientRoutes "1" --> "1" ClientService : utilise
ClientService "1" --> "1" ClientRepository : utilise
ClientService ..> Client : crée et valide
ClientService ..> ServiceError : lève
ClientRepository "1" --> "0..*" ClientModel : persiste
```

## Responsabilités principales

- `Client` contient les données métier et valide le nom, le courriel et le téléphone.
- `ClientService` applique les règles métier, notamment l'unicité du courriel.
- `ClientRepository` encapsule l'accès à MongoDB par Mongoose.
- `ClientRoutes` joue le rôle de contrôleur HTTP du service.
