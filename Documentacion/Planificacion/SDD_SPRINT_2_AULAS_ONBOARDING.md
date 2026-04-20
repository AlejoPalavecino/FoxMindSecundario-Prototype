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

### Contrato CSV MVP (acuerdo Batch 0)
- Objetivo: alta masiva simple y segura para enrollment por aula.
- Formato: `text/csv`, UTF-8, separador coma `,`, primera fila header obligatoria.
- Columnas obligatorias: `email`, `fullName`.
- Columnas opcionales: ninguna para MVP.
- Maximo por archivo: `200` filas de datos.
- Reglas por fila:
  - `email` valido y normalizado a minuscula.
  - `fullName` no vacio (1..120 chars).
  - Si alumno no existe en tenant, crear `User` rol `ALUMNO`.
  - Si ya existe enrollment en esa aula, no duplicar y reportar como `duplicado`.
- Respuesta API esperada:
  - `processed`: filas procesadas.
  - `createdUsers`: alumnos creados.
  - `createdEnrollments`: enrollments creados.
  - `errors`: lista por fila con `line`, `code`, `message`.

### Matriz de permisos (acuerdo Batch 0)
| Endpoint | DOCENTE | ALUMNO |
|---|---|---|
| `POST /classrooms` | permitido | denegado |
| `PATCH /classrooms/:id` | permitido (solo tenant propio) | denegado |
| `POST /classrooms/:id/enrollments` | permitido (solo tenant propio) | denegado |
| `POST /classrooms/:id/enrollments/csv` | permitido (solo tenant propio) | denegado |
| `GET /student/classrooms` | denegado | permitido (solo propias) |

### Logging minimo obligatorio (acuerdo Batch 0)
- Eventos a registrar:
  - `classroom.created`
  - `classroom.updated`
  - `enrollment.created`
  - `enrollment.csv.imported`
  - `enrollment.csv.rejected`
  - `auth.guard.role.rejected` (si aplica en flujo)
- Campos minimos: `event`, `tenantId`, `actorUserId`, `role`, `resourceId`, `timestamp`.
- Errores CSV deben incluir `line` y `code` en metadata.

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
- Batch 0 (completado): acuerdos operativos cerrados (contrato CSV, matriz permisos, logging minimo y evidencia de verify).
- Batch 1: DB + API core.
- Batch 2: UI docente (aulas + enrollment manual).
- Batch 3: CSV + UI alumno + pruebas.

## 7) Verify
- Evidencia requerida:
  - Flujo E2E completo: crear aula -> enrolar -> alumno visualiza.
  - Validaciones CSV (archivo invalido, filas duplicadas, formato incorrecto).
  - Permisos (alumno no puede administrar aula).
- Checklist de evidencia (acuerdo Batch 0):
  - Captura/video de Docente creando aula.
  - Captura/video de alta manual de alumno en aula.
  - Captura/video de import CSV con al menos un error por fila.
  - Captura/video de Alumno visualizando aula asignada.
  - Prueba negativa de permiso: request de ALUMNO a endpoint de admin responde `403`.
- Decision: pendiente.

## 8) Archive
- Resumen, deudas, hand-off a Sprint 3.

## DoR
- [x] Spec y Design listos
- [x] Contrato CSV MVP definido
- [x] Matriz de permisos acordada
- [x] Logging minimo acordado
- [x] Evidencia de Verify definida

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical
