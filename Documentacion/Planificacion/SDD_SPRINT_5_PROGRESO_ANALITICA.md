# SDD - Sprint 5 Progreso Analitica

## 0) Metadata del Sprint
- `sprint_id`: `sprint-5-progreso-analitica`
- `periodo`: `2026-05-25 -> 2026-05-31`
- `estado`: `draft`
- `scope_mvp`: `Docente + Alumno`

## 1) Explore
- Objetivo: habilitar paneles de progreso accionables para ambos roles.
- Incluye: metricas agregadas, vistas de progreso y semaforo de riesgo MVP.

## 2) Propose
- Propuesta: priorizar metricas derivadas de datos reales de actividades y entregas.
- Exito: docente identifica riesgo y alumno visualiza progreso personal claro.

## 3) Spec
- `REQ-001`: Docente ve rendimiento por aula con metricas principales.
- `REQ-002`: Docente ve semaforo de riesgo MVP por alumno.
- `REQ-003`: Alumno ve progreso propio (avance, racha, actividad semanal).
- `REQ-004`: UI evita ranking competitivo y prioriza esfuerzo.

Escenarios:
- Given datos de entregas, when docente abre progreso, then ve agregados por aula.
- Given reglas de riesgo, when alumno cae en indicadores, then estado cambia.
- Given alumno logueado, when abre Mi Progreso, then ve solo sus datos.

## 4) Design
- Servicios de agregacion:
  - rendimiento por aula
  - progreso individual
  - riesgo heuristico inicial
- API:
  - `GET /analytics/teacher/classrooms/:id`
  - `GET /analytics/student/me`
- UI:
  - Docente: tabla + graficos + semaforo.
  - Alumno: KPIs, barras por materia, tendencia semanal.

## 5) Tasks
### Must
- [ ] `TASK-001` Implementar servicios de agregacion base.
- [ ] `TASK-002` Implementar reglas iniciales de semaforo de riesgo.
- [ ] `TASK-003` Endpoint de analitica docente.
- [ ] `TASK-004` Endpoint de analitica alumno.
- [ ] `TASK-005` UI Progreso Docente.
- [ ] `TASK-006` UI Mi Progreso Alumno.
- [ ] `TASK-007` Tests de consistencia de metricas y permisos.

### Should
- [ ] `TASK-008` Filtros por periodo/materia.

### Could
- [ ] `TASK-009` Insights textuales breves generados por reglas.

## 6) Apply
- Batch 1: agregaciones + APIs.
- Batch 2: UI docente.
- Batch 3: UI alumno + validaciones.
- Batch 4: pruebas y ajuste de reglas.

## 7) Verify
- Coherencia de metricas con DB.
- Permisos: alumno solo ve su informacion.
- UX: lectura clara y accionable, sin overload visual.

## 8) Archive
- Resumen y hand-off a Sprint 6.

## DoD
- [ ] Must cerradas
- [ ] Verify sin critical
