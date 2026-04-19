# SDD - Sprint 0 Foundations

## 0) Metadata del Sprint

- `sprint_id`: `sprint-0-foundations`
- `periodo`: `2026-04-20 -> 2026-04-26`
- `estado`: `draft`
- `owner`: `equipo`
- `repo`: `https://github.com/AlejoPalavecino/FoxMindSecundario-Prototype`
- `scope_mvp`: `Compartido`
- `fuentes_canonicas`:
  - `Documentacion/Core/Detalle Rol Docente.md`
  - `Documentacion/Core/Detalle Rol Alumno.md`
  - `Documentacion/Core/Desing system.md`

---

## 1) Explore

### Objetivo

Definir y montar la base técnica mínima para desarrollar rápido y sin retrabajo en los sprints funcionales de Docente y Alumno.

### Descubrimientos

- El repositorio actual está orientado a documentación y proceso; falta bootstrap técnico de app.
- Ya existen reglas claras de colaboración (PR, checklist diario, branch strategy) y deben aplicarse desde el primer commit de código.

### Alcance propuesto (alto nivel)

- Incluye: estructura base de apps, auth/roles iniciales, conexión DB, theming base, CI mínima.
- Excluye: implementación de módulos funcionales (Aulas, Actividades, Agenda, EstudIA).

### Riesgos iniciales

- Riesgo: sobrearquitectura temprana.
  - Mitigación: priorizar vertical mínima ejecutable.
- Riesgo: desalineación visual desde inicio.
  - Mitigación: aplicar tokens base desde `Desing system.md`.

### Dependencias

- Definición de entorno y variables para API/DB/auth.
- Alineación del equipo sobre convenciones de carpetas y naming.

---

## 2) Propose

### Propuesta ejecutiva

Implementar un “foundation slice” que deje al equipo listo para construir features en sprints 1+ sin rehacer infraestructura. Esto incluye monorepo operativo (`web/api/shared`), autenticación inicial por rol, esquema DB base para dominio académico mínimo, tokens visuales del Design System y pipeline de calidad básico.

La propuesta minimiza riesgo de deuda temprana y habilita que un dev o dos devs trabajen en paralelo con contratos compartidos y reglas de integración ya activas.

### Criterio de éxito del sprint

- Se puede iniciar sesión y enrutar por rol (`Docente`/`Alumno`).
- Existe pipeline CI mínima ejecutable en PR (`lint` + `test` base).
- Existe base de datos accesible con migración inicial aplicada.
- La app renderiza layout base con estilo canonico del Design System.

### Trade-offs

- Elegida: base técnica mínima + contratos iniciales.
- Descartada: construir módulos funcionales en paralelo sin fundaciones cerradas.

---

## 3) Spec (requisitos y escenarios)

### Requisitos funcionales del sprint

- `REQ-001`: El sistema debe disponer de estructura de proyecto lista para desarrollo de `web`, `api` y `shared`.
- `REQ-002`: El backend debe proveer autenticación base y autorización por rol para endpoints protegidos.
- `REQ-003`: El frontend debe enrutar por rol después de autenticación.
- `REQ-004`: Debe existir modelo inicial de persistencia para usuarios, roles y entidades académicas base.

### Requisitos no funcionales aplicables

- `NFR-001` (calidad): lint y tests base deben ejecutarse en CI.
- `NFR-002` (seguridad): secretos únicamente por entorno, sin hardcode.
- `NFR-003` (UX): theming base alineado a `Desing system.md`.

### Escenarios (Given/When/Then)

#### Escenario 1 - Login y redirección por rol

- Given: un usuario válido con rol Docente o Alumno.
- When: inicia sesión correctamente.
- Then: accede al shell de su rol correspondiente.

#### Escenario 2 - Endpoint protegido

- Given: un endpoint privado de API.
- When: se consulta sin token válido.
- Then: responde 401/403 según corresponda.

#### Escenario 3 - CI mínima

- Given: un PR abierto.
- When: corre la pipeline base.
- Then: ejecuta lint y tests base con estado visible.

### Fuera de alcance

- Flujos de negocio completos por módulo (Aulas/Actividades/Agenda/EstudIA).
- Analítica, semáforo de riesgo y generación IA productiva.

---

## 4) Design (tecnico)

### Arquitectura del cambio

- Modulos tocados: `apps/web`, `apps/api`, `packages/shared`.
- Fronteras de dominio: auth/identity separado de dominio académico.
- Contratos API/eventos: DTOs compartidos para auth y perfil de sesión.

### Modelo de datos

- Entidades nuevas:
  - `User`
  - `Role` (enum)
  - `Tenant` (base multi-institución)
  - `Classroom` (stub para sprints futuros)
  - `Enrollment` (stub para sprints futuros)
- Entidades modificadas: N/A (inicio).
- Migraciones requeridas: migración inicial + seed mínima.

### Diseño UI/UX

- Pantallas/estados:
  - login
  - shell docente (placeholder)
  - shell alumno (placeholder)
  - estados loading/error en auth
- Componentes:
  - `AppLayout`
  - `RoleShell`
  - `AuthGuard`
- Tokens del Design System usados:
  - colores base (`--color-fox-bg`, `--color-fox-surface`, `--color-fox-text-main`)
  - tipografía base (`Montserrat`, `Roboto`)

### Seguridad

- Auth/roles: JWT + refresh token + guard por rol.
- Validaciones: DTO validation en login/refresh.
- Datos sensibles: secretos en `.env`, no persistir token plano en frontend.

### Observabilidad

- Logs: eventos de login y fallos auth.
- Metricas: contador básico de requests auth (opcional en sprint 0).
- Alertas: N/A en sprint 0 (dejar hook para sprint 7).

---

## 5) Tasks (implementacion)

### Must

- [x] `TASK-001` Bootstrap `web/api/shared` con scripts y estructura inicial.
- [x] `TASK-002` Configurar DB (Supabase + Prisma) con migración inicial y seed.
- [x] `TASK-003` Implementar auth base (login, refresh, guard global, roles).
- [x] `TASK-004` Implementar shell por rol en frontend + route guard.
- [x] `TASK-005` Integrar tokens base de `Desing system.md` en UI global.
- [x] `TASK-006` Configurar CI mínima para PR (`lint` + `test` base).

### Should

- [x] `TASK-007` Logging estructurado en auth.
- [x] `TASK-008` Documentar variables de entorno y setup local en README técnico.

### Could

- [ ] `TASK-009` Setup de test e2e smoke para login.

### Dependencias entre tareas

- `TASK-003` depende de `TASK-002`.
- `TASK-004` depende de `TASK-003`.
- `TASK-006` puede avanzar en paralelo con `TASK-003/004`.

---

## 6) Apply (ejecucion por lotes)

### Batch 1

- Objetivo del batch: bootstrap técnico + DB operativa.
- Tareas incluidas: `TASK-001`, `TASK-002`.
- Resultado: `TASK-001` y `TASK-002` completadas.
- Bloqueos: pendiente.

### Batch 2

- Objetivo del batch: auth + shell por rol.
- Tareas incluidas: `TASK-003`, `TASK-004`, `TASK-005`.
- Resultado: `TASK-003`, `TASK-004` y `TASK-005` completadas.
- Bloqueos: pendiente.

### Batch 3

- Objetivo del batch: calidad operativa y cierre sprint.
- Tareas incluidas: `TASK-006`, `TASK-007`, `TASK-008`, `TASK-009`.
- Resultado: `TASK-006`, `TASK-007` y `TASK-008` completadas; `TASK-009` pendiente.
- Bloqueos: pendiente.

---

## 7) Verify (validacion contra Spec)

### Matriz requisito -> evidencia

- `REQ-001` -> estructura en repo + scripts (`package.json`/workspace) + captura de árbol.
- `REQ-002` -> tests de auth + evidencia 401/403 en endpoint privado.
- `REQ-003` -> demo login -> redirección docente/alumno.
- `REQ-004` -> migración aplicada + seed ejecutada + consulta básica.

### Test plan del sprint

- Unit: auth service, guards, utilidades de token.
- Integration: login/refresh/me, control de acceso por rol.
- E2E: login básico y acceso a shell de rol.
- Manual UX: validación de estilos base y estados de auth.

### Resultado de verificacion

- `CRITICAL`: pendiente.
- `WARNING`: pendiente.
- `SUGGESTION`: pendiente.

### Decision

- [ ] Aprobado
- [ ] Aprobado con observaciones
- [ ] Requiere retrabajo

---

## 8) Archive (cierre del sprint)

### Resumen de cierre

- Qué se completó: pendiente.
- Qué no se completó y por qué: pendiente.

### Deuda técnica generada

- Deuda 1 + plan de pago: pendiente.

### Aprendizajes

- Aprendizaje 1: pendiente.
- Aprendizaje 2: pendiente.

### Hand-off al próximo sprint

- Inputs: shell por rol + auth + db listos para Sprint 1.
- Riesgos abiertos: pendientes al cierre.

---

## Definition of Ready (DoR)

- [x] Objetivo del sprint definido
- [x] Spec completo con escenarios
- [x] Design técnico documentado
- [x] Tasks priorizadas (`Must/Should/Could`)
- [x] Riesgos y dependencias identificados

## Definition of Done (DoD)

- [ ] Todas las `Must` cerradas
- [ ] Verify sin `CRITICAL`
- [ ] Evidencia de tests adjunta
- [ ] UI alineada a `Desing system.md`
- [ ] Sprint archivado
