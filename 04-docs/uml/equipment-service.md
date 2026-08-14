# Diagramme UML — Service Matériel

Ce diagramme représente les classes et modules utilisés par le service Matériel.

```mermaid
classDiagram
direction TB

class EquipmentRoutes {
  <<controller>>
  +GET /
  +GET /:id
  +POST /
  +PUT /:id
  +PUT /:id/reserve
  +PUT /:id/release
  +DELETE /:id
}

class EquipmentService {
  -repository
  +list()
  +getById(id)
  +create(payload)
  +update(id, payload)
  +remove(id)
  +reserve(id, quantity)
  +release(id, quantity)
}

class ServiceError {
  +status
  +constructor(message, status)
}

class EquipmentRepository {
  -model
  +findAll()
  +findById(id)
  +create(data)
  +update(id, data)
  +delete(id)
  +reserve(id, quantity)
  +release(id, quantity)
}

class Equipment {
  +name : String
  +category : String
  +dailyPrice : Number
  +availableQuantity : Number
  +constructor(data)
  +isValid()
  +canReserve(quantity)
  +toDocument()
}

class EquipmentModel {
  <<Mongoose Model>>
  +name : String
  +category : String
  +dailyPrice : Number
  +availableQuantity : Number
  +createdAt : Date
  +updatedAt : Date
}

EquipmentRoutes "1" --> "1" EquipmentService : utilise
EquipmentService "1" --> "1" EquipmentRepository : utilise
EquipmentService ..> Equipment : crée et valide
EquipmentService ..> ServiceError : lève
EquipmentRepository "1" --> "0..*" EquipmentModel : persiste
```

## Responsabilités principales

- `Equipment` contient les informations du matériel et les règles de validation du stock.
- `EquipmentService` gère le CRUD, la réservation du stock et sa remise en disponibilité.
- `EquipmentRepository` effectue les opérations MongoDB, y compris les ajustements atomiques de quantité.
- `EquipmentRoutes` joue le rôle de contrôleur HTTP du service.
