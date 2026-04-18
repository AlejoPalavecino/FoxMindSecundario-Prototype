# SDD - Sprint 7 Hardening Release

## 0) Metadata del Sprint
- `sprint_id`: `sprint-7-hardening-release`
- `periodo`: `2026-06-08 -> 2026-06-14`
- `estado`: `draft`
- `scope_mvp`: `Docente + Alumno + Compartido`

## 1) Explore
- Objetivo: dejar MVP estable, seguro y verificable para release.
- Incluye: configuraciones finales, hardening, QA integral, checklist de salida.

## 2) Propose
- Propuesta: cerrar gaps de seguridad/calidad antes de declarar MVP completo.
- Exito: flujos criticos pasan e2e, sin hallazgos criticos abiertos.

## 3) Spec
- `REQ-001`: Configuracion funcional para ambos roles (perfil, seguridad, notificaciones basicas).
- `REQ-002`: Endpoints sensibles con rate limiting y validaciones reforzadas.
- `REQ-003`: Suite e2e de recorridos criticos en verde.
- `REQ-004`: Checklist de release y documentacion de cierre completados.

Escenarios:
- Given usuario autenticado, when modifica configuracion valida, then persiste cambios.
- Given abuso de endpoint sensible, when excede limite, then recibe bloqueo controlado.
- Given pipeline release, when corre suite critica, then no hay fallas bloqueantes.

## 4) Design
- Seguridad:
  - rate limiting en auth y endpoints IA.
  - validacion estricta de payloads.
  - politica de errores sin fuga de detalles sensibles.
- Calidad:
  - matriz e2e por flujo critico.
  - smoke/performance/accesibilidad minima.
- Operacion:
  - logs de eventos clave
  - checklist final de salida.

## 5) Tasks
### Must
- [ ] `TASK-001` Configuracion Docente/Alumno (perfil, seguridad, notificaciones base).
- [ ] `TASK-002` Hardening de validaciones y manejo de errores.
- [ ] `TASK-003` Rate limiting en endpoints sensibles.
- [ ] `TASK-004` Suite e2e de flujos criticos.
- [ ] `TASK-005` Correccion de bugs encontrados en QA final.
- [ ] `TASK-006` Checklist de release + documentacion final.

### Should
- [ ] `TASK-007` Baseline de performance en vistas principales.

### Could
- [ ] `TASK-008` Dashboard tecnico simple de salud del sistema.

## 6) Apply
- Batch 1: configuracion + hardening backend.
- Batch 2: e2e critica + correcciones.
- Batch 3: cierre release + documentacion.

## 7) Verify
- E2E obligatorios:
  - login/roles
  - aulas/enrollment
  - actividades/entregas/correccion
  - agenda/planificacion
  - progreso
  - estudIA base
- Seguridad: sin critical abiertos.
- UX: lineamientos visuales y accesibilidad base cumplidos.

## 8) Archive
- Cierre de MVP:
  - resumen final de cumplimiento
  - deuda pendiente y roadmap inmediato
  - hand-off operativo para siguiente fase

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical
- [ ] Release checklist completo
