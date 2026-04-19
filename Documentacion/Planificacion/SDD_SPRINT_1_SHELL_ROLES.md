# SDD - Sprint 1 Shell Roles

## 0) Metadata del Sprint
- `sprint_id`: `sprint-1-shell-roles`
- `periodo`: `2026-04-27 -> 2026-05-03`
- `estado`: `draft`
- `scope_mvp`: `Docente + Alumno`

## 1) Explore
- Objetivo: tener todas las secciones de ambos roles creadas y navegables con estados UI base.
- Incluye: rutas, layouts por rol, pantallas shell, componentes base compartidos.
- Excluye: logica de negocio completa por modulo.
- Riesgo: crear pantallas desacopladas del Design System.

## 2) Propose
- Propuesta: construir estructura completa de navegacion y vistas para Docente y Alumno para habilitar implementacion por verticales en sprints siguientes.
- Exito: no hay rutas rotas y cada seccion tiene `empty/loading/error/success`.

## 3) Spec
- `REQ-001`: Docente debe tener Dashboard, Aulas, Agenda, Progreso, Copiloto IA y Configuracion.
- `REQ-002`: Alumno debe tener Dashboard, Aulas, EstudIA, Mi Progreso y Configuracion.
- `REQ-003`: Navegacion por rol debe ocultar secciones no permitidas.
- `REQ-004`: Layout debe ser usable en desktop y mobile.
- NFR: accesibilidad base, consistencia visual, performance inicial.

Escenarios clave:
- Given usuario docente autenticado, when abre app, then ve menu docente completo.
- Given usuario alumno autenticado, when abre app, then ve menu alumno completo.
- Given una seccion sin datos, when carga vista, then ve estado empty claro.

## 4) Design
- Frontend:
  - `RoleLayout` docente/alumno.
  - `NavigationConfig` tipada por rol.
  - Componentes base: `PageHeader`, `StatCard`, `DataTable`, `StatusBadge`, `EmptyState`.
- Backend:
  - Endpoints placeholder `GET /me`, `GET /health`, stubs por modulo si aplica.
- UI:
  - Aplicar tokens de `Desing system.md`.
  - Tipografia Montserrat/Roboto y foco visible.

## 5) Tasks
### Must
- [x] `TASK-001` Implementar rutas y layouts por rol.
- [x] `TASK-002` Crear todas las vistas shell requeridas para Docente.
- [ ] `TASK-003` Crear todas las vistas shell requeridas para Alumno.
- [ ] `TASK-004` Implementar estados `empty/loading/error/success` en todas las vistas.
- [ ] `TASK-005` Crear biblioteca minima de componentes compartidos.
- [ ] `TASK-006` Validar responsive base desktop/mobile.

### Should
- [ ] `TASK-007` Skeletons reutilizables por modulo.
- [ ] `TASK-008` Storybook o showcase interno de componentes base.

### Could
- [ ] `TASK-009` Atajos de navegacion rapida en dashboards.

## 6) Apply
- Batch 1 (completado): layouts por rol Docente/Alumno, config tipada unica de navegacion y base de biblioteca compartida (`PageHeader`, `EmptyState`, `StatusBadge`) integrada en shells actuales.
- Nota TASK-005: en Batch 1 se completo SOLO la base inicial de componentes compartidos; la task sigue abierta hasta cerrar biblioteca minima completa en batches siguientes.
- Batch 2 (completado): se crearon shells Docente para Dashboard, Aulas, Agenda, Progreso, Copiloto IA y Configuracion; se habilitaron estas rutas en la navegacion docente tipada y se cubrieron tests de render/navegacion para evitar secciones rotas.
- Batch 3: pantallas shell alumno + estados UI.
- Batch 4: polish responsive + accesibilidad base.

## 7) Verify
- Matriz:
  - `REQ-001` -> demo docente navegando todas las secciones.
  - `REQ-002` -> demo alumno navegando todas las secciones.
  - `REQ-003` -> prueba de menus/guards por rol.
  - `REQ-004` -> evidencia mobile + desktop.
- Test plan: unit de config de navegacion, integration de guards, e2e smoke por rol.
- Decision: pendiente.

## 8) Archive
- Completo/no completo, deuda tecnica, hand-off a Sprint 2.

## DoR
- [x] Spec y Design listos
- [x] Tasks priorizadas

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical
- [ ] Evidencia adjunta
