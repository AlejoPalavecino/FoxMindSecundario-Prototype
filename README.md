# FoxMind Secundario

FoxMind Secundario es un sistema de aprendizaje adaptativo con foco en dos perfiles del MVP: **Docente** y **Alumno**. Este repositorio hoy funciona como **base documental canónica** para iniciar el desarrollo con coherencia funcional, técnica y de experiencia de usuario.

> [!IMPORTANT]
> Para construir el producto sin ambiguedades:
> - Funcionalidad canonica: `Documentacion/Core/Detalle Rol Docente.md` y `Documentacion/Core/Detalle Rol Alumno.md`
> - UI/UX canonica: `Documentacion/Core/Desing system.md`
> - Restricciones tecnicas: `Documentacion/Core` y `Documentacion/Operacion`

## Estado del proyecto

- Estado actual: fase de definicion y alineacion documental
- Fuente de verdad de MVP: Documentacion del prototipo validado
- Base de datos objetivo: Supabase (PostgreSQL administrado)
- Stack objetivo: Next.js + NestJS + TypeScript + Prisma + Supabase
- Repositorio remoto oficial: `https://github.com/AlejoPalavecino/FoxMindSecundario-Prototype`

## Protocolo antes de cada sesion de trabajo

Como el equipo es de 2 personas, antes de empezar cualquier tarea ambos devs deben:

1. Verificar si hay cambios nuevos en remoto (`main`, PRs abiertas y comentarios pendientes).
2. Actualizar rama local `main` con la ultima version del repo.
3. Confirmar que la tarea a tomar no se superpone con cambios en curso del otro dev.
4. Recién ahi crear la rama de trabajo.

Comandos minimos recomendados:

```bash
git checkout main
git fetch origin
git pull origin main
```

Checklist rapido (inicio de jornada):

- [ ] Revise commits nuevos en `origin/main`.
- [ ] Revise PRs abiertas y comentarios de review.
- [ ] Sincronicé `main` local (`fetch` + `pull`).
- [ ] Confirmé con el otro dev que no hay solapamiento de archivos/modulos.
- [ ] Cree rama nueva desde `main` para una sola tarea concreta.

## Alcance del MVP

El MVP a implementar prioriza:

- Rol Docente
- Rol Alumno

El **Rol Tutor Familiar** se mantiene como backlog de evolucion (no bloquea el inicio del desarrollo del MVP actual).

## Roles, secciones y funcionalidades

### Rol Docente

Secciones principales esperadas:

- Dashboard
- Aulas
- Agenda y Planificacion
- Progreso de Clase
- Copiloto IA (Foxy)
- Configuracion y Accesibilidad

Funcionalidades clave:

- Visualizacion de KPIs del curso (riesgo, asistencia, correcciones)
- Gestion de aulas, alumnos, actividades y curriculas
- Planificacion asistida por IA sobre agenda academica
- Analitica comparativa entre cursos y alertas tempranas
- Generacion de recursos pedagogicos con contexto de aula

### Rol Alumno

Secciones principales esperadas:

- Dashboard
- Aulas
- EstudIA (Tutor Socratico)
- Mi Progreso
- Configuracion y Accesibilidad

Funcionalidades clave:

- Vista clara de tareas y siguientes pasos
- Consumo de actividades por aula con entregas y feedback
- Carpetas de estudio y chat IA con guardrails socraticos
- Quizzes generativos para autoevaluacion
- Progreso gamificado enfocado en esfuerzo, habito y mejora continua

## Lineamientos de estilo y experiencia

Los lineamientos visuales deben seguir `Documentacion/Core/Desing system.md`:

- Paleta de baja fatiga visual basada en verdes/esmeraldas
- Identidad por rol: Docente (teal), Alumno (lavanda), CTA (naranja)
- Tipografia: Montserrat (titulos) + Roboto (cuerpo)
- Componentes con bordes suaves, contraste accesible y foco visible
- Accesibilidad como requisito nativo (no como parche)

`Documentacion/Core/05_ARQUITECTURA DE LA EXPERIENCIA.md` y `Documentacion/Core/05.1_GUÍA DE ESTILO VISUAL (NIVEL SECUNDARIO) – ABSTRACCIÓN DE PRIMARIA.md` complementan la implementacion, pero ante conflicto prevalece `Documentacion/Core/Desing system.md`.

## Arquitectura y calidad (resumen)

- Arquitectura MVP: monolito modular orientado a cerrar rapido el core academico
- Evolucion prevista: servicios desacoplados/event-driven para modulos de IA y analitica avanzada
- Seguridad: enfoque DevSecOps, auth robusta, manejo seguro de secretos y datos sensibles
- Calidad: TDD, cobertura priorizada por riesgo, guardrails de complejidad y revisiones de PR

## Plan recomendado para empezar desarrollo

### Fase 1 - Fundaciones

- Definir contratos de dominio y API para flujos Docente/Alumno
- Crear estructura base de apps (web/api/shared) y convenciones de codigo
- Configurar auth base y modelo de roles

### Fase 2 - Vertical Docente + Alumno (core)

- Dashboard + Aulas para ambos roles
- Actividades: creacion, entrega, correccion y visualizacion de progreso
- EstudIA base con guardrails socraticos y contexto de carpeta

### Fase 3 - Agenda, analitica y hardening

- Agenda docente y planificacion asistida
- Alertas y paneles de progreso clave
- Endurecimiento de seguridad, testing e integracion continua

## Definicion de listo (MVP)

Se considera MVP listo cuando:

- Los recorridos criticos Docente y Alumno estan operativos de punta a punta
- Las decisiones visuales respetan el Design System canonico
- Existen tests de los flujos criticos del core academico
- El flujo de colaboracion por PR mantiene integridad de `main`

## Mapa de documentacion

- Vision y actores: `Documentacion/Core/00_PROPUESTA DE VALOR Y ACTORES.md`
- Funcionalidad e historias: `Documentacion/Core/01_REQUISITOS FUNCIONALES E HISTORIAS DE USUARIO.md`
- No funcionales: `Documentacion/Core/02_REQUISITOS NO FUNCIONALES.md`
- Arquitectura tecnica: `Documentacion/Core/03_ARQUITECTURA DEL SISTEMA Y PATRONES DE DISEÑO.md`
- Dominio y datos: `Documentacion/Core/04_MODELADO DE DATOS Y DOMINIO.md`
- UX/UI: `Documentacion/Core/05_ARQUITECTURA DE LA EXPERIENCIA.md`
- Guia visual secundaria: `Documentacion/Core/05.1_GUÍA DE ESTILO VISUAL (NIVEL SECUNDARIO) – ABSTRACCIÓN DE PRIMARIA.md`
- Detalle funcional Docente: `Documentacion/Core/Detalle Rol Docente.md`
- Detalle funcional Alumno: `Documentacion/Core/Detalle Rol Alumno.md`
- Design System canonico: `Documentacion/Core/Desing system.md`
- Testing y calidad: `Documentacion/Operacion/06_ESTRATEGIA DE TESTING Y CALIDAD DE CÓDIGO.md`
- Seguridad y CI/CD: `Documentacion/Operacion/07_SEGURIDAD (DEVSECOPS) Y CI-CD.md`
- Reglas operativas: `Documentacion/Operacion/08_REGLAS DEL AGENTE (AGENT.MD) Y SCAFFOLDING.md`
- Colaboracion Git: `Documentacion/Operacion/09_GUIA_COLABORACION_GIT_REMOTO.md`
- Setup OAuth: `Documentacion/Operacion/OAuth-Setup.md`
- Plan de implementacion por sprints: `Documentacion/Planificacion/PLAN_IMPLEMENTACION_SPRINTS.md`
- Plantilla SDD por sprint: `Documentacion/Planificacion/SDD_PLANTILLA_SPRINT.md`

---

Si queres, el siguiente paso es convertir este README en un plan de ejecucion por sprint (Sprint 0, 1 y 2) con historias listas para levantar en issues.
