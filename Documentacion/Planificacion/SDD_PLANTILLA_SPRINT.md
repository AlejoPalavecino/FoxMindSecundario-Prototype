# Plantilla SDD por Sprint

Usa esta plantilla para cada sprint y completa TODO en orden. No pasar a implementacion sin `Spec` y `Design` aprobados.

---

## 0) Metadata del Sprint

- `sprint_id`: `sprint-<numero>-<nombre-corto>`
- `periodo`: `YYYY-MM-DD -> YYYY-MM-DD`
- `estado`: `draft | in_progress | verify | done`
- `owner`: `equipo`
- `repo`: `https://github.com/AlejoPalavecino/FoxMindSecundario-Prototype`
- `scope_mvp`: `Docente | Alumno | Compartido`
- `fuentes_canonicas`:
  - `Documentacion/Core/Detalle Rol Docente.md`
  - `Documentacion/Core/Detalle Rol Alumno.md`
  - `Documentacion/Core/Desing system.md`

---

## 1) Explore

### Objetivo

Describir el problema a resolver en este sprint y por que ahora.

### Descubrimientos

- Hallazgo 1
- Hallazgo 2

### Alcance propuesto (alto nivel)

- Incluye
- Excluye

### Riesgos iniciales

- Riesgo
- Mitigacion

### Dependencias

- Dependencia tecnica
- Dependencia funcional

---

## 2) Propose

### Propuesta ejecutiva

1-2 parrafos con la solucion y su impacto.

### Criterio de exito del sprint

- Resultado medible 1
- Resultado medible 2

### Trade-offs

- Opcion elegida y por que
- Opcion descartada y por que

---

## 3) Spec (requisitos y escenarios)

### Requisitos funcionales del sprint

- `REQ-001`: 
- `REQ-002`: 

### Requisitos no funcionales aplicables

- `NFR-001` (performance)
- `NFR-002` (seguridad)
- `NFR-003` (accesibilidad)

### Escenarios (Given/When/Then)

#### Escenario 1

- Given:
- When:
- Then:

#### Escenario 2

- Given:
- When:
- Then:

### Fuera de alcance

- Item 1
- Item 2

---

## 4) Design (tecnico)

### Arquitectura del cambio

- Modulos tocados:
- Fronteras de dominio:
- Contratos API/eventos:

### Modelo de datos

- Entidades nuevas:
- Entidades modificadas:
- Migraciones requeridas:

### Diseño UI/UX

- Pantallas/estados:
- Componentes:
- Tokens del Design System usados:

### Seguridad

- Auth/roles:
- Validaciones:
- Datos sensibles:

### Observabilidad

- Logs:
- Metricas:
- Alertas:

---

## 5) Tasks (implementacion)

> Regla: tareas verticales por feature, no listas separadas frontend/backend sin cierre funcional.

### Must

- [ ] `TASK-001` Descripcion corta (impacto + criterio de cierre)
- [ ] `TASK-002` Descripcion corta (impacto + criterio de cierre)

### Should

- [ ] `TASK-003` 
- [ ] `TASK-004` 

### Could

- [ ] `TASK-005` 

### Dependencias entre tareas

- `TASK-002` depende de `TASK-001`

---

## 6) Apply (ejecucion por lotes)

### Batch 1

- Objetivo del batch:
- Tareas incluidas:
- Resultado:
- Bloqueos:

### Batch 2

- Objetivo del batch:
- Tareas incluidas:
- Resultado:
- Bloqueos:

---

## 7) Verify (validacion contra Spec)

### Matriz requisito -> evidencia

- `REQ-001` -> PR/commit/test/evidencia
- `REQ-002` -> PR/commit/test/evidencia

### Test plan del sprint

- Unit:
- Integration:
- E2E:
- Manual UX:

### Resultado de verificacion

- `CRITICAL`:
- `WARNING`:
- `SUGGESTION`:

### Decision

- [ ] Aprobado
- [ ] Aprobado con observaciones
- [ ] Requiere retrabajo

---

## 8) Archive (cierre del sprint)

### Resumen de cierre

- Que se completo
- Que no se completo y por que

### Deuda tecnica generada

- Deuda 1 + plan de pago

### Aprendizajes

- Aprendizaje 1
- Aprendizaje 2

### Hand-off al proximo sprint

- Inputs para siguiente sprint
- Riesgos abiertos

---

## Definition of Ready (DoR)

- [ ] Objetivo del sprint definido
- [ ] Spec completo con escenarios
- [ ] Design tecnico documentado
- [ ] Tasks priorizadas (`Must/Should/Could`)
- [ ] Riesgos y dependencias identificados

## Definition of Done (DoD)

- [ ] Todas las `Must` cerradas
- [ ] Verify sin `CRITICAL`
- [ ] Evidencia de tests adjunta
- [ ] UI alineada a `Desing system.md`
- [ ] Documentacion del sprint archivada

---

## Convencion de nombres recomendada

- `sprint-0-foundations`
- `sprint-1-shell-roles`
- `sprint-2-aulas-onboarding`
- `sprint-3-actividades-entregas`
- `sprint-4-agenda-planificacion`
- `sprint-5-progreso-analitica`
- `sprint-6-estudia-studyfolder`
- `sprint-7-hardening-release`
