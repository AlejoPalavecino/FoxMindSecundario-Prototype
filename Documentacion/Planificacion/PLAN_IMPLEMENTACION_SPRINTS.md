# Plan de Implementacion (MVP completo Docente + Alumno)

Este plan baja a ejecucion todo el alcance del MVP y define que hay que implementar y verificar para considerar cada sprint realmente completo.

## 1) Objetivo

Entregar una app funcional de punta a punta para los dos roles canónicos del MVP:

- Rol Docente
- Rol Alumno

Con foco en:

- Flujos funcionales completos (no pantallas sueltas)
- Coherencia UX/UI con `Desing system.md`
- Seguridad y calidad base para trabajo en equipo

## 2) Fuentes canónicas obligatorias

- Funcionalidad: `Documentacion/Core/Detalle Rol Docente.md`, `Documentacion/Core/Detalle Rol Alumno.md`
- UI/UX y estilo: `Documentacion/Core/Desing system.md`
- Restricciones técnicas: `Documentacion/Core` y `Documentacion/Operacion`
- Ejecución por sprint con SDD: `Documentacion/Planificacion/SDD_PLANTILLA_SPRINT.md`

## 3) Reglas de ejecución (para cerrar al 100%)

Cada sprint debe cumplir sí o sí:

1. `Spec` + `Design` aprobados antes de implementar.
2. Tareas clasificadas en `Must/Should/Could`.
3. Todas las `Must` cerradas para considerar sprint completo.
4. `Verify` sin hallazgos críticos.
5. Evidencia de pruebas y demo funcional de flujos.
6. `Archive` con resumen, deuda y hand-off.

## 4) Definición de “implementado al 100%” por feature

Una feature se considera al 100% cuando cumple estos 8 puntos:

1. Existe UI completa (estados vacío/carga/error/success).
2. Tiene backend y persistencia real (sin mocks para el flujo principal).
3. Respeta permisos por rol.
4. Tiene validaciones de entrada/salida.
5. Tiene trazabilidad mínima (logs de acciones críticas).
6. Tiene tests mínimos acordados (unit/integration/e2e según impacto).
7. Cumple lineamientos de `Desing system.md` y accesibilidad base.
8. Está documentada en el `Archive` del sprint.

## 5) Plan por sprints

> Nota: el plan es flexible por persona. Un dev puede cerrar un sprint entero o el equipo puede repartirse dinámicamente.

---

### Sprint 0 - Fundaciones operativas

**Objetivo:** dejar una base sólida para construir sin retrabajo.

**Implementaciones necesarias**

- Estructura base de proyecto (`web`, `api`, `shared`) y convenciones.
- Conexión a Supabase + Prisma y esquema inicial de dominio core.
- Autenticación base (JWT + refresh) y autorización por rol (`Docente`, `Alumno`).
- Layout app base y navegación inicial por rol.
- Tokens y estilos base aplicados desde `Desing system.md`.
- CI mínima (lint + tests + revisión básica de seguridad/secretos).

**Verificaciones obligatorias**

- Login exitoso y redirección correcta por rol.
- Endpoints protegidos y públicos funcionando como corresponde.
- Build/lint/tests base en verde.
- Seed de datos demo disponible para ambos roles.

---

### Sprint 1 - Shell completo de secciones

**Objetivo:** todas las secciones creadas, navegables y coherentes en UX.

**Implementaciones necesarias**

- Rol Docente:
  - Dashboard
  - Aulas
  - Agenda
  - Progreso de Clase
  - Copiloto IA
  - Configuración
- Rol Alumno:
  - Dashboard
  - Aulas
  - EstudIA
  - Mi Progreso
  - Configuración
- Estados UI por sección: `empty`, `loading`, `error`, `success`.
- Componentes base reutilizables (cards, tablas, badges, modales, gráficos base).

**Verificaciones obligatorias**

- Navegación completa sin rutas rotas.
- Responsivo base en desktop y mobile.
- Consistencia visual con tokens definidos.
- Revisión UX de accesibilidad inicial (contrastes y focus states).

---

### Sprint 2 - Aulas + Onboarding + Enrollments

**Objetivo:** primer flujo académico real de punta a punta.

**Implementaciones necesarias**

- Docente crea y edita aulas.
- Alta de alumnos (manual + carga CSV MVP).
- Vinculación alumno-aula (enrollment).
- Alumno ve automáticamente sus aulas asignadas.
- Detalle de aula para ambos roles (base funcional).

**Verificaciones obligatorias**

- Flujo E2E: crear aula -> enrolar alumno -> alumno ve aula.
- Validaciones de datos (duplicados, formato de CSV, integridad).
- Permisos correctos (alumno no administra aulas).
- Logs de acciones críticas (creación, alta, vínculo).

---

### Sprint 3 - Actividades, entregas y corrección

**Objetivo:** cerrar loop docente-alumno sobre tareas.

**Implementaciones necesarias**

- Docente crea actividades y define condiciones básicas.
- Alumno visualiza tareas pendientes/completadas.
- Alumno entrega actividad (texto/archivo, según alcance MVP).
- Docente corrige, califica y deja feedback.
- Alumno visualiza calificación y devolución.

**Verificaciones obligatorias**

- Flujo E2E completo: actividad -> entrega -> corrección -> feedback visible.
- Estado de tarea consistente en UI y DB.
- Seguridad de acceso a entregas por ownership/rol.
- Tests de casos borde (sin entrega, reintento, formato inválido).

---

### Sprint 4 - Agenda Docente + Planificación asistida

**Objetivo:** entregar planificación con calendario y soporte IA.

**Implementaciones necesarias**

- Calendario docente (mensual/semanal).
- Eventos globales institucionales (feriados/recesos/ciclo).
- Bloqueo visual de días no laborables.
- Generación asistida de secuencia didáctica (MVP IA).
- Flujo Human-in-the-loop: revisar/editar/aprobar antes de publicar.

**Verificaciones obligatorias**

- Eventos globales impactan agenda correctamente.
- Flujo de planificación con IA no publica sin revisión humana.
- Mensajería de espera y estados de carga según lineamientos UX.
- Test de fallback ante error de proveedor IA.

---

### Sprint 5 - Progreso y analítica

**Objetivo:** habilitar visibilidad accionable para ambos roles.

**Implementaciones necesarias**

- Docente:
  - Panel de rendimiento por curso
  - Semáforo de riesgo MVP (reglas iniciales)
- Alumno:
  - Mi Progreso (avance, racha, métricas de esfuerzo)
  - Visualizaciones por materia
- Agregaciones y métricas sobre datos reales de actividades/entregas.

**Verificaciones obligatorias**

- Datos de dashboard consistentes con DB.
- Semáforo reacciona a reglas configuradas.
- UX prioriza métricas de esfuerzo (no ranking competitivo).
- Performance aceptable para vistas analíticas principales.

---

### Sprint 6 - EstudIA + StudyFolders

**Objetivo:** completar módulo de estudio asistido del Alumno.

**Implementaciones necesarias**

- StudyFolders:
  - crear/editar/eliminar carpeta
  - subir y listar recursos
  - vinculación opcional con aula
- EstudIA (tutor socrático):
  - chat contextual
  - guardrails para no dar respuestas directas
  - acciones rápidas MVP (resumen/simplificar/quiz/flashcards)
- Diferenciación explícita de comportamiento IA Docente vs Alumno.

**Verificaciones obligatorias**

- Guardrails socráticos activos y auditables.
- Contexto de carpeta impacta respuestas.
- Permisos y privacidad de contenido correctamente aislados.
- Pruebas de errores frecuentes (sin contexto, timeout IA, input inválido).

---

### Sprint 7 - Configuración, hardening y release MVP

**Objetivo:** dejar el producto listo para uso serio y evolución.

**Implementaciones necesarias**

- Configuración Docente/Alumno:
  - perfil
  - notificaciones
  - seguridad
  - accesibilidad
- Hardening de seguridad:
  - validaciones reforzadas
  - rate limiting en endpoints sensibles
  - manejo robusto de errores
- QA final:
  - e2e de recorridos críticos
  - chequeo de accesibilidad base
  - revisión de performance clave
- Cierre release:
  - checklist de salida
  - documentación final de sprint

**Verificaciones obligatorias**

- Suite crítica en verde.
- Sin vulnerabilidades críticas conocidas abiertas.
- Flujo principal Docente y Alumno estable de punta a punta.
- Archive final con deuda y próximos pasos.

## 6) Matriz de verificación transversal (todos los sprints)

En cada sprint revisar obligatoriamente:

- **Funcionalidad:** cumple requisitos `Spec`.
- **Diseño:** respeta `Documentacion/Core/Desing system.md`.
- **Seguridad:** auth/roles/validaciones.
- **Calidad:** tests mínimos definidos por riesgo.
- **Operación:** logs y trazabilidad básica.
- **Colaboración:** PR template completo + revisión cruzada.

## 7) Checklist de cierre de sprint

- [ ] Todas las tareas `Must` cerradas.
- [ ] Verify sin hallazgos críticos.
- [ ] Evidencia de pruebas adjunta.
- [ ] Demo funcional registrada.
- [ ] Deuda técnica documentada.
- [ ] Archive completo con hand-off al siguiente sprint.

## 8) Orden sugerido de ejecución

1. `sprint-0-foundations`
2. `sprint-1-shell-roles`
3. `sprint-2-aulas-onboarding`
4. `sprint-3-actividades-entregas`
5. `sprint-4-agenda-planificacion`
6. `sprint-5-progreso-analitica`
7. `sprint-6-estudia-studyfolder`
8. `sprint-7-hardening-release`

## 8.1 Documentos SDD prellenados

- `Documentacion/Planificacion/SDD_SPRINT_0_FOUNDATIONS.md`
- `Documentacion/Planificacion/SDD_SPRINT_1_SHELL_ROLES.md`
- `Documentacion/Planificacion/SDD_SPRINT_2_AULAS_ONBOARDING.md`
- `Documentacion/Planificacion/SDD_SPRINT_3_ACTIVIDADES_ENTREGAS.md`
- `Documentacion/Planificacion/SDD_SPRINT_4_AGENDA_PLANIFICACION.md`
- `Documentacion/Planificacion/SDD_SPRINT_5_PROGRESO_ANALITICA.md`
- `Documentacion/Planificacion/SDD_SPRINT_6_ESTUDIA_STUDYFOLDER.md`
- `Documentacion/Planificacion/SDD_SPRINT_7_HARDENING_RELEASE.md`

## 9) Criterio final de MVP completo

Se considera MVP completo cuando:

- Todas las secciones de Docente y Alumno existen y tienen flujo real funcional.
- No hay módulos críticos dependientes de mocks para los recorridos principales.
- Los flujos críticos pasan pruebas y verificación final.
- La app mantiene coherencia visual, de permisos y de experiencia.
