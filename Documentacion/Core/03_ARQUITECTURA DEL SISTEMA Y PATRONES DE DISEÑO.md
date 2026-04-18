## **ARQUITECTURA DEL SISTEMA Y PATRONES DE DISEÑO**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- La arquitectura debe priorizar los casos de uso implementados en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- Cualquier diseño de microservicios o módulos no requeridos por esos flujos se planifica como evolución, evitando sobrearquitectura en el MVP.

# 1\. ESTILO ARQUITECTÓNICO BASE Y COMPONENTES DE ALTO NIVEL

## Estado actual del repositorio

El repositorio hoy NO implementa todavia la arquitectura completa de microservicios orientados a eventos descripta en la vision original. La implementacion real actual es un **monolito modular** con:

- `apps/api`: backend NestJS con modulos de `Auth`, `Tenant`, `Classroom`, `Enrollment`, `Activity`, `GlobalEvent` y `TeacherSchedule`.
- `apps/web`: frontend Next.js 14 con App Router.
- `packages/shared`: contratos y tipos compartidos.

Esta decision permite cerrar primero el MVP academico real antes de distribuir responsabilidades en servicios separados.

## Arquitectura objetivo

La vision de mediano plazo sigue siendo evolucionar hacia una Clean Architecture (Arquitectura Limpia) incrustada dentro de un ecosistema de Microservicios Orientados a Eventos (Event-Driven Architecture), especialmente cuando entren en produccion los modulos de IA, riesgo y ecosistema familiar.

- **Justificación:** FoxMind tiene dos cargas de trabajo radicalmente distintas: las peticiones rapidas del core academico y las peticiones lentas/asincronas que apareceran con IA, analitica y automatizacion pedagógica.
- **Regla para la IA y nuevas features:** El dominio de la aplicación (Reglas de Negocio) no debe tener dependencias de frameworks externos, bases de datos o proveedores de LLM (OpenAI, Anthropic). Todo se comunicará mediante interfaces (Puertos y Adaptadores).

## Componentes de Alto Nivel

1. **Core API actual** (Implementado): Backend NestJS modular para identidad, aulas, enrollment, actividades, eventos globales y agenda docente. Expone endpoints REST.
2. **LLM Gateway** (Objetivo, no implementado): Microservicio dedicado exclusivamente a orquestar las llamadas a la IA (OpenAI, Anthropic). Gestiona retries, latencias y ensamblado de prompts con el contexto del alumno.
3. **Event Bus** (Objetivo, no implementado): Para desacoplar servicios. Ej: El tutor familiar sube una foto de una tarea \-\> el Core API emite un evento `MaterialUploaded` \-\> el LLM Gateway lo procesa en segundo plano sin bloquear la interfaz.
4. **Configuration & Resource Manager** (Parcial): Hoy la configuracion se apoya en variables de entorno y modulos del backend; cache distribuido y recursos compartidos todavia no forman parte del runtime principal.

# 2\. PATRONES DE DISEÑO (GANG OF FOUR \- GOF) Y MAPEO DE DOMINIO

## 2.1. Patrones Creacionales (Creational)

- **Singleton** (Instancia Única):
  - Problema: Crear múltiples instancias de clientes de conexión a la base de datos, el gestor de configuración (ConfigurationManager) o el cliente HTTP hacia el proveedor del LLM consume recursos innecesarios y puede provocar bloqueos por límite de peticiones (Rate Limiting).
  - Solución: Implementar un patrón Singleton (gestionado como un ciclo de vida único o Scoped a través del contenedor de Inyección de Dependencias) para el DatabaseConnectionPool y el LLMClientManager. Esto garantiza que toda la aplicación comparta la misma conexión y el mismo gestor de tokens.
  - Trade-off: Si se implementa como estado estático global, dificulta las pruebas unitarias. Por ello, la regla de IA exige su inyección, permitiendo mockear las conexiones en los tests.
- **Factory Method** (Método de Fábrica):
  - Problema: El proceso de registro varía si el usuario es un "Docente Institucional" o un "Tutor Familiar/Independiente".
  - Solución: Una fábrica WorkspaceFactory que decida instanciar la jerarquía de entidades y permisos correctos dependiendo del rol detectado.
  - Trade-off: Centraliza la lógica, pero la clase Fábrica debe cumplir el principio de Responsabilidad Única para no volverse un cuello de botella.

## 2.2. Patrones de Comportamiento (Behavioral)

- **Strategy** (Estrategia):
  - Problema: El motor de Tutoría Socrática debe comportarse diferente según el perfil cognitivo del alumno.
  - Solución: Implementar la interfaz IAcademicStrategy. Clases concretas como SpacedRepetitionStrategy o VisualLearningStrategy se inyectarán dinámicamente según el perfil DUA (TDAH, Dislexia, Estándar).
- **Observer** (Observador):
  - Problema: El "Semáforo de Riesgo" del Dashboard Docente debe actualizarse ante bloqueos del alumno.
  - Solución: El motor de evaluación actúa como el Subject (Sujeto). El módulo de notificaciones y analítica actúa como Observer reaccionando a StudentFailedTaskEvent.

## 2.3. Patrones Estructurales (Structural)

- **Decorator** (Decorador):
  - Problema: El Diseño Universal para el Aprendizaje (DUA) requiere alterar el contenido base al vuelo (lectura fácil, pictogramas) sin crear infinitas subclases.
  - Solución: El objeto base Content es envuelto dinámicamente por EasyReadingDecorator y luego por HighContrastDecorator según el perfil del alumno.
- **Proxy** (Poderdante):
  - Problema: Las llamadas a proveedores de IA (LLMs) son costosas y manejan datos sensibles de menores.
  - Solución: Un LLMServiceProxy intercepta la llamada, implementa caché de preguntas frecuentes y realiza el cifrado/ofuscación de datos personales (PII) antes de enviar la solicitud al modelo externo.
