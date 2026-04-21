# SDD - Sprint 3 Actividades Entregas

## 0) Metadata del Sprint
- `sprint_id`: `sprint-3-actividades-entregas`
- `periodo`: `2026-05-11 -> 2026-05-17`
- `estado`: `approved_with_observations`
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
- [x] `TASK-004` UI Docente para crear actividad.
- [x] `TASK-005` UI Alumno para entregar actividad.
- [x] `TASK-006` UI Docente para calificar y dar feedback.
- [x] `TASK-007` UI Alumno para ver resultado.
- [x] `TASK-008` Tests integration de estados y permisos. (cerrada en Batch 4 con evidencia automatizada API/Web sobre permisos por rol, ownership, validaciones y transiciones `pendiente -> entregada -> corregida`; queda deuda no bloqueante de smoke/E2E browser cross-role para Sprint 4)

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
- Batch 3 (completado):
  - Frontend Docente (`TASK-004` + `TASK-006`): incorporada UI para crear actividades por aula y panel de calificación de entregas (`submissionId`, `score`, `feedback`) con validaciones mínimas y feedback de éxito/error.
  - Frontend Alumno (`TASK-005` + `TASK-007`): incorporado workspace de actividades por aula con estados visibles (`Pendiente`, `Entregada`, `Corregida`), formulario de entrega por contenido texto (mínimo 10 chars) y visualización de nota/devolución cuando la entrega está corregida.
  - Integración API web: extendido `apps/web/lib/classrooms-api.ts` con cliente tipado para `POST/GET /classrooms/:id/activities`, `POST /activities/:id/submissions` y `PATCH /submissions/:id/grade` reutilizando `requestJson` y contratos consistentes.
  - Tests (`TASK-008` avance): cobertura en Web para contratos de formularios docente/alumno, contratos de cliente API de actividades/entregas/corrección y transición visual de estados incluyendo feedback de corrección visible al alumno.
- Batch 4 (completado):
  - Verify final ejecutado sobre implementación actual con validación de `REQ-001`..`REQ-005` contra código + tests automatizados.
  - `TASK-008` cerrada a nivel Must: evidencia en API (`classrooms.service.integration.test.ts`, `classrooms.permissions.integration.test.ts`) y Web (`classrooms-api.test.ts`, `alumno-aulas-workspace.test.tsx`, `docente-aulas-workspace.test.tsx`).
  - Resultado operativo: `npm run lint` y `npm run test` en verde; sin `CRITICAL`; cierre del sprint en estado `Aprobado con observaciones`.

## 7) Verify
- Evidencia requerida:
  - Flujo vertical MVP: crear actividad -> entregar -> corregir -> visualizar feedback.
  - Seguridad: ownership de entrega + permisos por rol.
  - Calidad: casos borde (sin entrega, entrega vacia, calificacion invalida).

Checklist de evidencia (acuerdo Batch 0):
- Evidencia automatizada `REQ-001` Docente crea actividades por aula:
  - `apps/api/src/modules/classrooms/classrooms.service.integration.test.ts` -> `creates published activity for classroom teacher`.
  - `apps/api/src/modules/classrooms/classrooms.permissions.integration.test.ts` -> `rejects ALUMNO with 403 when creating classroom activity`.
  - `apps/web/lib/classrooms-api.test.ts` -> `creates a classroom activity with expected POST contract`.
  - `apps/web/components/docente/docente-aulas-workspace.test.tsx` -> renderiza formulario `Crear actividad`.
- Evidencia automatizada `REQ-002` Alumno ve actividades pendientes/completadas:
  - `apps/api/src/modules/classrooms/classrooms.service.integration.test.ts` -> `lists activities for ALUMNO only when assigned to classroom` y `rejects activity list for ALUMNO not assigned to classroom`.
  - `apps/api/src/modules/classrooms/classrooms.permissions.integration.test.ts` -> `allows ALUMNO to list classroom activities`.
  - `apps/web/components/alumno/alumno-aulas-workspace.test.tsx` -> estados `Pendiente`, `Entregada` y `Corregida`.
- Evidencia automatizada `REQ-003` Alumno entrega actividad:
  - `apps/api/src/modules/classrooms/classrooms.service.integration.test.ts` -> `creates submission for ALUMNO assigned to classroom` y `rejects submission when content is empty or shorter than minimum`.
  - `apps/api/src/modules/classrooms/classrooms.permissions.integration.test.ts` -> `allows ALUMNO to submit activity` y `rejects DOCENTE with 403 when submitting as alumno`.
  - `apps/web/lib/classrooms-api.test.ts` -> `creates a submission with expected POST contract`.
  - `apps/web/components/alumno/alumno-aulas-workspace.test.tsx` -> renderiza formulario `Entregar actividad`.
- Evidencia automatizada `REQ-004` Docente corrige y califica:
  - `apps/api/src/modules/classrooms/classrooms.service.integration.test.ts` -> `grades submission for DOCENTE that owns classroom`, `rejects grading when DOCENTE does not own classroom`, `rejects grading when score or feedback is invalid`, `rejects grading when submission was already graded`.
  - `apps/api/src/modules/classrooms/classrooms.permissions.integration.test.ts` -> `allows DOCENTE to grade submission` y `rejects ALUMNO with 403 when grading submission`.
  - `apps/web/lib/classrooms-api.test.ts` -> `grades a submission with expected PATCH contract`.
  - `apps/web/components/docente/docente-aulas-workspace.test.tsx` -> renderiza formulario `Calificar entrega`.
- Evidencia automatizada `REQ-005` Alumno visualiza nota y devolucion:
  - `apps/web/components/alumno/alumno-aulas-workspace.test.tsx` -> `renders graded status with score and feedback after teacher correction`.
- Resultado de verificación:
  - `npm run lint` ✅
  - `npm run test` ✅
  - API: 30 tests en verde.
  - Web: 57 tests en verde.
  - Shared: sin tests (passWithNoTests).
- Cumplimiento de escenarios del sprint:
  - Given actividad publicada, when alumno abre aula, then la ve como pendiente -> `COMPLIANT`.
  - Given entrega creada, when docente corrige, then cambia estado y nota -> `COMPLIANT`.
  - Given correccion lista, when alumno revisa, then ve feedback asociado -> `COMPLIANT`.
- Hallazgos:
  - `CRITICAL`: ninguno.
  - `WARNING`: no existe todavía smoke/E2E browser cross-role automatizado ni evidencia visual/capturas del flujo docente -> alumno; el cierre queda sustentado por tests de integración de servicio/permisos y tests de contrato/render Web.
  - `SUGGESTION`: agregar suite `test:e2e` específica de Sprint 3 y cobertura reportable por archivo para endurecer evidencia de regressions.
- Decision: `Aprobado con observaciones`.

## 8) Archive
- Resumen:
  - Sprint 3 queda cerrado a nivel Must: actividades, entregas, corrección y visualización de feedback están implementadas y verificadas contra `REQ-001`..`REQ-005`.
  - `TASK-008` queda cerrada con evidencia automatizada suficiente para estados, permisos y validaciones MVP.
- Deudas técnicas:
  - Incorporar smoke/E2E browser cross-role del flujo docente -> alumno como refuerzo de evidencia operativa.
  - Incorporar coverage formal para distinguir cobertura total y por archivos críticos de Sprint 3.
- Hand-off a Sprint 4:
  - Reutilizar el vertical de actividades/entregas como base para Agenda/Planificación, sin reabrir contrato MVP de estados salvo necesidad explícita.
  - Si Sprint 4 toca aulas/actividades, agregar primero la suite E2E browser pendiente para proteger regresiones cross-role.

## DoD
- [x] Must cerradas
- [x] Verify sin critical
- [x] `TASK-008` cerrada con evidencia automatizada API/Web
- [x] Cierre real del sprint documentado (Verify + Archive)

## DoR
- [x] Spec y Design listos
- [x] Contrato de estados definido
- [x] Contrato de entrega/calificacion definido
- [x] Matriz de permisos acordada
- [x] Logging minimo acordado
- [x] Evidencia de Verify definida
