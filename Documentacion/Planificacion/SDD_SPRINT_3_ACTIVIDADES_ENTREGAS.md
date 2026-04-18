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

## 5) Tasks
### Must
- [ ] `TASK-001` Modelo y migraciones de actividades/entregas.
- [ ] `TASK-002` Endpoints de creacion/publicacion actividad.
- [ ] `TASK-003` Endpoints de entrega y correccion.
- [ ] `TASK-004` UI Docente para crear actividad.
- [ ] `TASK-005` UI Alumno para entregar actividad.
- [ ] `TASK-006` UI Docente para calificar y dar feedback.
- [ ] `TASK-007` UI Alumno para ver resultado.
- [ ] `TASK-008` Tests integration de estados y permisos.

### Should
- [ ] `TASK-009` Reentrega controlada (si docente habilita).

### Could
- [ ] `TASK-010` Adjuntos multiples por entrega.

## 6) Apply
- Batch 1: DB + API de actividades.
- Batch 2: entrega + correccion API.
- Batch 3: UIs docente/alumno.
- Batch 4: tests + ajustes.

## 7) Verify
- E2E: crear actividad -> entregar -> corregir -> visualizar feedback.
- Seguridad: ownership de entrega + permisos por rol.
- Calidad: casos borde (sin entrega, entrega vacia, calificacion invalida).

## 8) Archive
- Resumen, deuda, hand-off a Sprint 4.

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical
