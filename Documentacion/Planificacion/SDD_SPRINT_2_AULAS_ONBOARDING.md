# SDD - Sprint 2 Aulas Onboarding

## 0) Metadata del Sprint
- `sprint_id`: `sprint-2-aulas-onboarding`
- `periodo`: `2026-05-04 -> 2026-05-10`
- `estado`: `aprobado`
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
- [x] `TASK-001` Modelo y migraciones de Classroom/Enrollment.
- [x] `TASK-002` Endpoints de aula y enrollment con permisos por rol.
- [x] `TASK-003` UI Docente para crear/editar aula.
- [x] `TASK-004` UI Docente para alta manual de alumno.
- [x] `TASK-005` Import CSV MVP con reporte de errores.
- [x] `TASK-006` UI Alumno para visualizar aulas asignadas.
- [x] `TASK-007` Tests integration de enrollment y permisos.

### Should
- [x] `TASK-008` Busqueda/filtro en listado de alumnos de aula.

### Could
- [x] `TASK-009` Export rapido de listado de aula.

## 6) Apply
- Batch 0 (completado): acuerdos operativos cerrados (contrato CSV, matriz permisos, logging minimo y evidencia de verify).
- Batch 1: DB + API core.
  - Resultado Batch 1:
    - `TASK-001` completada: relation `Enrollment -> Tenant` agregada en Prisma y migracion SQL incremental con FK; constraint unico de duplicado por aula-alumno validado (`@@unique([classroomId, studentId])`).
    - `TASK-002` completada: endpoints `POST /classrooms`, `PATCH /classrooms/:id`, `POST /classrooms/:id/enrollments` implementados con `@Roles("DOCENTE")`, aislamiento por `tenantId` y control de duplicados de enrollment.
    - Logging minimo aplicado para `classroom.created`, `classroom.updated`, `enrollment.created` y `auth.guard.role.rejected` con metadata minima (`event`, `tenantId`, `actorUserId`, `role`, `resourceId`, `timestamp`).
    - `TASK-007` avance parcial: base de tests de integracion para permisos (403 ALUMNO) y enrollment (positivo DOCENTE + duplicado consistente) implementada para core API de este batch.
- Batch 2: UI docente (aulas + enrollment manual).
  - Resultado Batch 2:
    - `TASK-003` completada: vista `Docente / Aulas` implementada con listado, formularios de crear/editar y estados `loading/error/empty/success` alineados al shell.
    - `TASK-004` completada: alta manual de alumno por `studentId` integrada contra `POST /classrooms/:id/enrollments` con feedback de exito, error y manejo de duplicado idempotente (`created: false`).
    - Integracion cliente API agregada para `GET/POST/PATCH /classrooms` y `POST /classrooms/:id/enrollments` con fallback MVP cuando listado no esta disponible.
    - Cobertura de tests UI y contrato agregada para formularios, estados y caso duplicado de enrollment.
- Batch 3: CSV + UI alumno + pruebas.
  - Resultado Batch 3:
    - `TASK-005` completada: endpoint `POST /classrooms/:id/enrollments/csv` implementado con parsing CSV MVP (`email,fullName`), tope de `200` filas, normalización de email, validación por fila y respuesta con `processed`, `createdUsers`, `createdEnrollments`, `errors[{line,code,message}]`.
    - Logging mínimo aplicado para import masivo: `enrollment.csv.imported` (resumen de import) y `enrollment.csv.rejected` (errores por fila o rechazo de archivo) con metadata obligatoria y `line`/`code`.
    - `TASK-006` completada: endpoint `GET /student/classrooms` habilitado para `ALUMNO` y UI Alumno conectada a endpoint real para listar aulas asignadas con estados `loading/error/empty/success` consistentes.
    - `TASK-007` completada: tests de integración/API cubren CSV válido, CSV inválido, duplicados y permisos (`403` para ALUMNO en endpoints admin y `403` para DOCENTE en endpoint alumno); tests Web cubren render de aulas asignadas y feedback/reportes de import CSV.
- Batch 4: filtro + export rápido de listado docente.
  - Resultado Batch 4:
    - `TASK-008` completada: UI Docente agrega `Listado de alumnos` para aula seleccionada con filtro por `studentId` (MVP disponible), botón de limpieza de filtro y feedback explícito cuando no hay coincidencias.
    - `TASK-009` completada: acción `Exportar CSV` desde aula seleccionada con generación de archivo `studentId,email,fullName,status`; comportamiento elegido para aula sin alumnos: no descarga archivo y muestra mensaje preventivo.
    - Cobertura de tests agregada para búsqueda/filtro (con resultados y sin resultados) y export (contrato de payload CSV + disparo de descarga + caso sin alumnos).

## 7) Verify
- Evidencia requerida:
  - Flujo E2E completo: crear aula -> enrolar -> alumno visualiza.
  - Validaciones CSV (archivo invalido, filas duplicadas, formato incorrecto).
  - Permisos (alumno no puede administrar aula).
- Checklist de evidencia (acuerdo Batch 0):
  - Evidencia automatizada Docente creando/actualizando aulas: `apps/api/src/modules/classrooms/classrooms.service.integration.test.ts` + `apps/web/components/docente/docente-aulas-workspace.test.tsx`.
  - Evidencia automatizada alta manual en aula y duplicado idempotente: `apps/api/src/modules/classrooms/classrooms.service.integration.test.ts` + `apps/web/components/docente/docente-aulas-workspace.test.tsx`.
  - Evidencia automatizada import CSV con errores por fila: `apps/api/src/modules/classrooms/classrooms.service.integration.test.ts` + `apps/web/lib/classrooms-api.test.ts` + `apps/web/components/docente/docente-aulas-workspace.test.tsx`.
  - Evidencia automatizada Alumno visualizando aulas asignadas: `apps/api/src/modules/classrooms/classrooms.service.integration.test.ts` + `apps/web/components/alumno/alumno-aulas-workspace.test.tsx`.
  - Evidencia automatizada permisos (`403` ALUMNO en admin y `403` DOCENTE en endpoint alumno): `apps/api/src/modules/classrooms/classrooms.permissions.integration.test.ts`.
- Resultado de verificación:
  - `npm run lint` ✅
  - `npm run test` ✅
  - API: 13 tests en verde.
  - Web: 49 tests en verde.
  - Shared: sin tests (passWithNoTests).
- Hallazgos:
  - `CRITICAL`: ninguno.
  - `WARNING`: ninguno.
  - `SUGGESTION`: sumar smoke browser visual del flujo docente->alumno en Sprint 3 para evidencia UX adicional.
- Decision: `Aprobado`.

## 8) Archive
- Resumen:
  - Flujo académico E2E MVP implementado: Docente crea/edita aula, enrola manual o CSV, Alumno visualiza aulas asignadas.
  - Todas las tasks `Must`, `Should` y `Could` cerradas en este sprint.
- Deudas técnicas:
  - Fortalecer cobertura de `packages/shared` con tests unitarios en Sprint 3.
  - Incorporar smoke browser visual para evidencia UX end-to-end.
- Hand-off a Sprint 3:
  - Base de aulas/onboarding estable y lista para verticales pedagógicas (actividades/correcciones) sobre datos reales.

## DoR
- [x] Spec y Design listos
- [x] Contrato CSV MVP definido
- [x] Matriz de permisos acordada
- [x] Logging minimo acordado
- [x] Evidencia de Verify definida

## DoD
- [x] Must cerradas
- [x] Verify sin critical
