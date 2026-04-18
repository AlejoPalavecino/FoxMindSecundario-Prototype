# SDD - Sprint 2 Aulas Onboarding

## 0) Metadata del Sprint
- `sprint_id`: `sprint-2-aulas-onboarding`
- `periodo`: `2026-05-04 -> 2026-05-10`
- `estado`: `draft`
- `scope_mvp`: `Docente + Alumno`

## 1) Explore
- Objetivo: cerrar primer flujo academico real (crear aula, enrolar alumno, visualizar aula).
- Incluye: classroom CRUD basico, enrollment, alta manual y CSV MVP.
- Excluye: actividades y correcciones.

## 2) Propose
- Propuesta: priorizar recorrido end-to-end minimo para probar valor y permisos.
- Exito: Docente crea aula y Alumno la ve automaticamente.

## 3) Spec
- `REQ-001`: Docente puede crear/editar aulas.
- `REQ-002`: Docente puede enrolar alumnos manualmente.
- `REQ-003`: Docente puede importar alumnos via CSV simple.
- `REQ-004`: Alumno ve listado de aulas asignadas.
- `REQ-005`: Sistema evita duplicados de enrollment por aula.

Escenarios:
- Given aula creada, when se enrola alumno, then aparece en lista del docente.
- Given alumno enrolado, when inicia sesion, then ve aula en su panel.
- Given CSV invalido, when se intenta importar, then sistema reporta errores por fila.

## 4) Design
- DB: `Classroom`, `Enrollment`, relaciones con `User` y `Tenant`.
- API:
  - `POST /classrooms`
  - `PATCH /classrooms/:id`
  - `POST /classrooms/:id/enrollments`
  - `POST /classrooms/:id/enrollments/csv`
  - `GET /student/classrooms`
- UI:
  - Docente: lista aulas + modal crear/editar + tabla alumnos.
  - Alumno: cards de aulas asignadas.

## 5) Tasks
### Must
- [ ] `TASK-001` Modelo y migraciones de Classroom/Enrollment.
- [ ] `TASK-002` Endpoints de aula y enrollment con permisos por rol.
- [ ] `TASK-003` UI Docente para crear/editar aula.
- [ ] `TASK-004` UI Docente para alta manual de alumno.
- [ ] `TASK-005` Import CSV MVP con reporte de errores.
- [ ] `TASK-006` UI Alumno para visualizar aulas asignadas.
- [ ] `TASK-007` Tests integration de enrollment y permisos.

### Should
- [ ] `TASK-008` Busqueda/filtro en listado de alumnos de aula.

### Could
- [ ] `TASK-009` Export rapido de listado de aula.

## 6) Apply
- Batch 1: DB + API core.
- Batch 2: UI docente (aulas + enrollment manual).
- Batch 3: CSV + UI alumno + pruebas.

## 7) Verify
- Evidencia requerida:
  - Flujo E2E completo: crear aula -> enrolar -> alumno visualiza.
  - Validaciones CSV (archivo invalido, filas duplicadas, formato incorrecto).
  - Permisos (alumno no puede administrar aula).
- Decision: pendiente.

## 8) Archive
- Resumen, deudas, hand-off a Sprint 3.

## DoR
- [x] Spec y Design listos

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical
