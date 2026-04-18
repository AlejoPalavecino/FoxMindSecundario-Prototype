# SDD - Sprint 6 EstudIA StudyFolder

## 0) Metadata del Sprint
- `sprint_id`: `sprint-6-estudia-studyfolder`
- `periodo`: `2026-06-01 -> 2026-06-07`
- `estado`: `draft`
- `scope_mvp`: `Alumno`

## 1) Explore
- Objetivo: completar modulo EstudIA con carpetas de estudio y tutor socratico MVP.
- Incluye: CRUD study folders, recursos, chat contextual, acciones rapidas.
- Excluye: capacidades IA avanzadas fuera del MVP.

## 2) Propose
- Propuesta: priorizar experiencia de estudio util y segura, con guardrails explicitos.
- Exito: alumno estudia con carpeta + recibe guia socratica sin respuestas directas.

## 3) Spec
- `REQ-001`: Alumno puede crear/editar/eliminar StudyFolders.
- `REQ-002`: Alumno puede subir y consultar recursos en carpeta.
- `REQ-003`: EstudIA responde con enfoque socratico contextual.
- `REQ-004`: Acciones rapidas MVP (resumen, simplificar, quiz, flashcards).
- `REQ-005`: Distincion clara de politica IA Alumno vs Docente.

Escenarios:
- Given carpeta con recurso, when alumno consulta en chat, then respuesta usa contexto.
- Given pregunta de resolucion directa, when se consulta, then guardrail evita respuesta final.
- Given accion rapida, when se ejecuta, then devuelve salida util sobre el recurso.

## 4) Design
- DB: `StudyFolder`, `StudyResource`, `StudySession` (si aplica), `ChatMessage`.
- API:
  - CRUD folders/resources
  - `POST /estudia/chat`
  - `POST /estudia/actions/:type`
- IA:
  - policy layer con reglas socraticas.
  - sanitizacion de input y control de contexto.
- UI:
  - vista split (recursos + chat)
  - historial de interacciones
  - panel de acciones rapidas.

## 5) Tasks
### Must
- [ ] `TASK-001` Modelo y endpoints de StudyFolder/Resource.
- [ ] `TASK-002` UI de carpetas y gestion de recursos.
- [ ] `TASK-003` Endpoint de chat contextual EstudIA.
- [ ] `TASK-004` Implementar guardrails socraticos.
- [ ] `TASK-005` Implementar acciones rapidas MVP.
- [ ] `TASK-006` UI de chat + panel de acciones.
- [ ] `TASK-007` Tests de guardrails, contexto y permisos.

### Should
- [ ] `TASK-008` Historial de sesiones por carpeta.

### Could
- [ ] `TASK-009` Recomendacion simple de siguiente estudio.

## 6) Apply
- Batch 1: study folder backend/frontend.
- Batch 2: chat contextual + policy layer.
- Batch 3: quick actions + UX polish.
- Batch 4: pruebas y endurecimiento.

## 7) Verify
- E2E: crear carpeta -> subir recurso -> conversar con contexto.
- Guardrails: no entrega respuestas directas en casos prohibidos.
- Seguridad: alumno no accede a carpetas ajenas.
- Resiliencia: manejo de timeout/error de proveedor IA.

## 8) Archive
- Resumen y hand-off a Sprint 7.

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical
