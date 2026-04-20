# SDD - Sprint 1 Shell Roles

## 0) Metadata del Sprint
- `sprint_id`: `sprint-1-shell-roles`
- `periodo`: `2026-04-27 -> 2026-05-03`
- `estado`: `aprobado`
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
- [x] `TASK-003` Crear todas las vistas shell requeridas para Alumno.
- [x] `TASK-004` Implementar estados `empty/loading/error/success` en todas las vistas.
- [x] `TASK-005` Crear biblioteca minima de componentes compartidos.
- [x] `TASK-006` Validar responsive base desktop/mobile.

### Should
- [x] `TASK-007` Skeletons reutilizables por modulo.
- [x] `TASK-008` Storybook o showcase interno de componentes base.

### Could
- [x] `TASK-009` Atajos de navegacion rapida en dashboards.

## 6) Apply
- Batch 1 (completado): layouts por rol Docente/Alumno, config tipada unica de navegacion y base de biblioteca compartida (`PageHeader`, `EmptyState`, `StatusBadge`) integrada en shells actuales.
- Nota TASK-005: el estado parcial de Batch 1 quedo cerrado en Batch 5 con biblioteca minima shared completa (`StatCard` + `DataTable`).
- Batch 2 (completado): se crearon shells Docente para Dashboard, Aulas, Agenda, Progreso, Copiloto IA y Configuracion; se habilitaron estas rutas en la navegacion docente tipada y se cubrieron tests de render/navegacion para evitar secciones rotas.
- Batch 3 (completado): se crearon shells Alumno para Dashboard, Aulas, EstudIA, Mi Progreso y Configuracion; se habilitaron todas las rutas Alumno en la navegacion tipada y se aplico un patron reutilizable de estados UI (`loading/error/success/empty`) en todas las vistas shell Docente+Alumno con cobertura de tests de contrato.
- Batch 4 (completado): se reforzo responsive base desktop/mobile con navegacion usable en mobile (toggle accesible sin desbordes), se incorporo foco visible consistente para elementos interactivos, se mejoro semantica estructural (`aside/main` + skip link) y se resolvio el estado activo de sidebar por subrutas para Docente y Alumno con cobertura de tests de contrato.
- Batch 5 (completado): se cerro la biblioteca minima shared agregando `StatCard` y `DataTable` base, ambos integrados en los dashboards shell de Docente y Alumno sin alterar rutas/layout, con cobertura de tests de contrato para componentes y render de paginas.
- Batch 6 (completado): se implemento un set reutilizable de `ModuleSkeleton` por modulo (Docente/Alumno) integrado en el estado loading de todas las shell pages, y se agrego un showcase interno liviano en `/interno/componentes` para `PageHeader`, `EmptyState`, `StatusBadge`, `StatCard`, `DataTable` y skeletons, con cobertura de tests de contrato/render y continuidad de shells.
- Batch 7 (completado): se implementaron atajos rapidos reutilizables en dashboards Docente y Alumno usando la navegacion tipada por rol (sin hardcode duplicado), con estilos consistentes via tokens existentes y cobertura de tests de contrato para presencia + rutas esperadas; con esto se cierra el batch final de Could (`TASK-009`).

## 7) Verify
- Matriz:
  - `REQ-001` -> `apps/web/lib/role-navigation.ts` + `apps/web/app/docente/**/page.tsx` + tests `apps/web/lib/role-navigation.test.ts` y `apps/web/app/role-shell-pages.test.tsx`.
  - `REQ-002` -> `apps/web/lib/role-navigation.ts` + `apps/web/app/alumno/**/page.tsx` + tests `apps/web/lib/role-navigation.test.ts` y `apps/web/app/role-shell-pages.test.tsx`.
  - `REQ-003` -> `apps/web/components/roles/role-sidebar-nav.tsx` + `apps/web/middleware.ts` + test `apps/web/components/roles/role-layout-shell.test.tsx`.
  - `REQ-004` -> responsive/focus/semantica en `apps/web/app/globals.css` + `apps/web/components/roles/role-layout-shell.tsx`.
- Test plan ejecutado: `npm run lint` + `npm run test` (web 31 tests OK, api/shared sin tests con `passWithNoTests`).
- Smoke browser web ejecutado: `npm run test:smoke:web:sprint1`.
- Evidencia visual adjunta:
  - `Documentacion/Evidencias/Sprint-1/01-guard-unauth-docente-desktop.png`
  - `Documentacion/Evidencias/Sprint-1/02-docente-dashboard-desktop.png`
  - `Documentacion/Evidencias/Sprint-1/03-docente-aulas-mobile.png`
  - `Documentacion/Evidencias/Sprint-1/04-alumno-estudia-mobile.png`
  - `Documentacion/Evidencias/Sprint-1/05-guard-role-alumno-to-docente-redirect.png`
- Resultado:
  - `CRITICAL`: ninguno.
  - `WARNING`: ninguno.
  - `SUGGESTION`: incorporar coverage formal para api/shared en sprint siguiente.
- Decision: `Aprobado`.

## 8) Archive
- Completo/no completo: Sprint 1 completo a nivel implementacion (Must, Should y Could cerradas).
- Deuda tecnica: agregar smoke browser para comportamiento responsive y guardas de navegacion por rol en web.
- Deuda tecnica: incorporar tests automatizados en `apps/api` y `packages/shared` para reforzar cobertura de regresion (mejora no bloqueante).
- Hand-off a Sprint 2: continuar sobre shells estables con foco en logica de negocio por vertical y profundizacion de cobertura.

## DoR
- [x] Spec y Design listos
- [x] Tasks priorizadas

## DoD
- [x] Must cerradas
- [x] Verify sin critical
- [x] Evidencia adjunta
