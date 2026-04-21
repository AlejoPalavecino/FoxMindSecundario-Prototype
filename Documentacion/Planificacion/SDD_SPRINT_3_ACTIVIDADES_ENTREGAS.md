# SDD - Sprint 3 Actividades Entregas

## 0) Metadata del Sprint
- `sprint_id`: `sprint-3-actividades-entregas`
- `periodo`: `2026-05-11 -> 2026-05-17`
- `estado`: `draft`
- `scope_mvp`: `Docente + Alumno`

## 1) Explore
- Objetivo: completar loop de tarea entre Docente y Alumno.
- Incluye: creacion de actividad, entrega, correccion, feedback.
- Excluye: analitica avanzada.

## 2) Propose
- Propuesta: implementar flujo vertical completo por aula con estados consistentes en UI y DB.
- Exito: actividad viaja de `creada` a `corregida` con feedback visible al alumno.

## 3) Spec
- `REQ-001`: Docente crea actividades por aula.
- `REQ-002`: Alumno ve actividades pendientes/completadas.
- `REQ-003`: Alumno entrega actividad (texto o archivo segun alcance).
- `REQ-004`: Docente corrige y califica.
- `REQ-005`: Alumno visualiza nota y devolucion.

Escenarios:
- Given actividad publicada, when alumno abre aula, then la ve como pendiente.
- Given entrega creada, when docente corrige, then cambia estado y nota.
- Given correccion lista, when alumno revisa, then ve feedback asociado.

## 4) Design
- DB: `Activity`, `Submission`, `Grade` (o campos equivalentes).
- API:
  - `POST /classrooms/:id/activities`
  - `GET /classrooms/:id/activities`
  - `POST /activities/:id/submissions`
  - `PATCH /submissions/:id/grade`
- UI:
  - Docente: listado de actividades + panel de correccion.
  - Alumno: listado de tareas + workspace de entrega.

### Contrato de estados MVP (acuerdo Batch 0)
- `Activity.status`: `published`.
- `Submission.status`:
  - `submitted`: alumno entrego y espera revision.
  - `graded`: docente corrigio y califico.
- Transiciones permitidas:
  - actividad creada (`published`) -> alumno entrega (`submitted`) -> docente corrige (`graded`).
- Reglas:
  - no se puede calificar una entrega inexistente.
  - no se puede marcar `graded` sin `score` y `feedback`.

### Contrato de entrega MVP (acuerdo Batch 0)
- Formato MVP: entrega por `content` (texto) obligatoria.
- Adjuntos:
  - Sprint 3 base: sin adjuntos multiples.
  - `TASK-010` cubre adjuntos multiples como `Could`.
- Validaciones:
  - `content` requerido, largo minimo 10 chars.
  - rechazo de entrega vacia o whitespace-only.

### Contrato de calificacion MVP (acuerdo Batch 0)
- `score`: entero en rango `1..10`.
- `feedback`: obligatorio, `5..1000` chars.
- `gradedAt` se setea al corregir.

### Matriz de permisos (acuerdo Batch 0)
| Endpoint | DOCENTE | ALUMNO |
|---|---|---|
| `POST /classrooms/:id/activities` | permitido (aulas propias) | denegado |
| `GET /classrooms/:id/activities` | permitido (aulas propias) | permitido (aulas asignadas) |
| `POST /activities/:id/submissions` | denegado | permitido (si aula asignada) |
| `PATCH /submissions/:id/grade` | permitido (si aula propia) | denegado |

### Logging minimo obligatorio (acuerdo Batch 0)
- Eventos:
  - `activity.created`
  - `submission.created`
  - `submission.graded`
  - `auth.guard.role.rejected`
- Campos minimos: `event`, `tenantId`, `actorUserId`, `role`, `resourceId`, `timestamp`.

## 5) Tasks
### Must
- [x] `TASK-001` Modelo y migraciones de actividades/entregas.
- [x] `TASK-002` Endpoints de creacion/publicacion actividad.
- [x] `TASK-003` Endpoints de entrega y correccion.
- [ ] `TASK-004` UI Docente para crear actividad.
- [ ] `TASK-005` UI Alumno para entregar actividad.
- [ ] `TASK-006` UI Docente para calificar y dar feedback.
- [ ] `TASK-007` UI Alumno para ver resultado.
- [ ] `TASK-008` Tests integration de estados y permisos. (avance parcial Batch 2: suma casos de entrega/correccion, ownership y validaciones; resta cerrar flujo E2E/UI en lotes siguientes)

### Should
- [ ] `TASK-009` Reentrega controlada (si docente habilita).

### Could
- [ ] `TASK-010` Adjuntos multiples por entrega.

## 6) Apply
- Batch 0 (completado): acuerdos operativos cerrados (estados, contrato de entrega/calificacion, matriz de permisos, logging minimo y evidencia de verify).
- Batch 1 (completado):
  - DB/Prisma: agregadas entidades `Activity` y `Submission` con enums de estado y campos de calificacion MVP (`score`, `feedback`, `gradedAt`, `gradedByUserId`), relaciones con `Tenant`, `Classroom`, `User` y migracion incremental limpia.
  - API Nest: implementados `POST /classrooms/:id/activities` y `GET /classrooms/:id/activities` con permisos por rol/membresia (`DOCENTE` aula propia, `ALUMNO` aula asignada).
  - Logging: agregado evento `activity.created`; rechazos de rol quedan cubiertos por `auth.guard.role.rejected` del guard global.
  - Tests integration (`TASK-008` parcial): caso positivo de creacion por docente, caso negativo alumno creando (`403`), listado visible por rol (docente aula propia, alumno solo asignado).
- Batch 2 (completado):
  - API Nest: implementados `POST /activities/:id/submissions` (ALUMNO) y `PATCH /submissions/:id/grade` (DOCENTE), con wiring en modulo y DTOs dedicados.
  - Reglas de negocio: entrega solo para alumno enrolado en aula de la actividad; `content` obligatorio con minimo 10 chars y rechazo whitespace-only.
  - Correccion: solo docente owner del aula de la entrega; `score` entero `1..10`; `feedback` obligatorio `5..1000`; set de `gradedAt` y `gradedByUserId`; transicion consistente `submitted -> graded` (sin doble correccion).
  - Logging: agregados eventos `submission.created` y `submission.graded`; rechazos por rol siguen auditados por `auth.guard.role.rejected` en guard global.
  - Tests integration (`TASK-008` parcial): positivos de entrega alumno y correccion docente; negativos de ownership/rol y validaciones de `content`, `score`, `feedback`.
- Batch 3: UIs docente/alumno.
- Batch 4: tests + ajustes.

## 7) Verify
- E2E: crear actividad -> entregar -> corregir -> visualizar feedback.
- Seguridad: ownership de entrega + permisos por rol.
- Calidad: casos borde (sin entrega, entrega vacia, calificacion invalida).

Checklist de evidencia (acuerdo Batch 0):
- Captura/video Docente creando actividad.
- Captura/video Alumno viendo actividad pendiente y entregando.
- Captura/video Docente corrigiendo y calificando.
- Captura/video Alumno visualizando nota + devolucion.
- Prueba negativa: ALUMNO no puede corregir (`403`).
- Prueba negativa: DOCENTE no puede entregar como alumno (`403`).

## 8) Archive
- Resumen, deuda, hand-off a Sprint 4.

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical

## DoR
- [x] Spec y Design listos
- [x] Contrato de estados definido
- [x] Contrato de entrega/calificacion definido
- [x] Matriz de permisos acordada
- [x] Logging minimo acordado
- [x] Evidencia de Verify definida
