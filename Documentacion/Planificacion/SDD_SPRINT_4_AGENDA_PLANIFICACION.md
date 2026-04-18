# SDD - Sprint 4 Agenda Planificacion

## 0) Metadata del Sprint
- `sprint_id`: `sprint-4-agenda-planificacion`
- `periodo`: `2026-05-18 -> 2026-05-24`
- `estado`: `draft`
- `scope_mvp`: `Docente`

## 1) Explore
- Objetivo: implementar agenda docente con calendario institucional y planificacion asistida MVP.
- Incluye: global events, teacher schedule, propuesta IA con revision humana.
- Excluye: automatizaciones avanzadas multi-curso.

## 2) Propose
- Propuesta: cerrar recorrido de planificacion util en contexto real de dias habiles.
- Exito: docente selecciona bloque de agenda y genera secuencia asistida revisable.

## 3) Spec
- `REQ-001`: Sistema muestra calendario docente mensual/semanal.
- `REQ-002`: Eventos institucionales bloquean o marcan dias especiales.
- `REQ-003`: Docente puede seleccionar rango y solicitar propuesta IA.
- `REQ-004`: No se publica secuencia sin aprobacion manual.

Escenarios:
- Given feriado cargado, when docente abre agenda, then ve bloqueo visual.
- Given rango valido, when solicita plan, then recibe propuesta con estado de carga.
- Given propuesta IA, when docente revisa, then puede editar y publicar.

## 4) Design
- DB: `GlobalEvent`, `TeacherScheduleEntry`.
- API:
  - `GET /global-events`
  - `GET/POST /teacher-schedule`
  - `POST /planning/generate`
- UI:
  - calendario con leyenda de tipos de evento.
  - panel lateral de planificacion IA.
  - controles de revisar/editar/publicar.

## 5) Tasks
### Must
- [ ] `TASK-001` Modelo y endpoints de eventos globales.
- [ ] `TASK-002` Modelo y endpoints de agenda docente.
- [ ] `TASK-003` UI calendario docente con eventos institucionales.
- [ ] `TASK-004` Endpoint MVP de generacion asistida.
- [ ] `TASK-005` UI de flujo revisar/editar/publicar secuencia.
- [ ] `TASK-006` Estados de carga segun lineamientos UX.
- [ ] `TASK-007` Tests de permisos y de no-publicacion sin revision.

### Should
- [ ] `TASK-008` Historial de secuencias publicadas.

### Could
- [ ] `TASK-009` Plantillas de secuencia por materia.

## 6) Apply
- Batch 1: eventos + agenda.
- Batch 2: UI calendario.
- Batch 3: planificacion IA + flujo HITL.
- Batch 4: pruebas + polish.

## 7) Verify
- E2E: seleccionar dias habiles -> generar -> revisar -> publicar.
- Seguridad: solo docente puede gestionar agenda propia.
- UX: feedback visual durante esperas, sin pantallas congeladas.

## 8) Archive
- Resumen y hand-off a Sprint 5.

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical
