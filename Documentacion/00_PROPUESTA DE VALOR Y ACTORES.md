## **VISIÓN, PROPUESTA DE VALOR Y ACTORES**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- Este documento debe leerse en continuidad con [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md), que describen los flujos funcionales del prototipo validado.
- Cualquier actor o capacidad adicional no presente en esos dos documentos se considera evolución posterior al MVP actual.

# 1\. VISIÓN DEL PROYECTO

FoxMind es un Ecosistema de Aprendizaje Adaptativo e Inclusivo basado en Inteligencia Artificial, estructurado como un Sistema de Tutoría Inteligente (ITS). A diferencia de los sistemas de gestión de aprendizaje (LMS) estáticos que actúan como meros repositorios de archivos , FoxMind entiende tanto el contenido como la arquitectura neurocognitiva del estudiante. Su propósito es democratizar la excelencia educativa mediante la personalización masiva, alineando la tecnología con principios neurocientíficos (neuroplasticidad, repetición espaciada y recuperación activa) para transformar el entorno escolar en un espacio inteligente, accesible y profundamente humano.

# 2\. EL PROBLEMA

- **Modelo industrial estandarizado**: El sistema educativo actual fuerza a estudiantes neurodiversos a adaptarse a un modelo de "talla única" , lo que actúa como una barrera discapacitante y eleva las tasas de frustración y abandono escolar.
- **Sobrecarga docente**: Los educadores dedican una porción desproporcionada de su tiempo a tareas administrativas y logísticas, lo que erosiona el tiempo disponible para la mentoría humana, el apoyo socioemocional y la prevención de la deserción.
- **Brecha de inclusión**: Las herramientas digitales actuales suelen requerir "parches" de accesibilidad, marginando a estudiantes con discapacidades visuales, auditivas, motoras o cognitivas (TEA, TDAH, Dislexia).

# 3\. PROPUESTA DE VALOR

- **Copiloto pedagógico** (Para el Docente): Reducción de la carga administrativa en un 40-50% mediante la automatización del diseño instruccional, generación de rúbricas y adaptación de currículos locales.
- **Módulo estudIA** (Para el Estudiante): Un tutor socrático impulsado por IA generativa disponible 24/7 que no entrega respuestas directas, sino que guía al alumno en su "Zona de Desarrollo Próximo" aplicando metodologías de Growth Mindset y recuperación activa.
- **Visibilidad mandatoria y prevención**: Implementación de un "Semáforo de Riesgo" basado en analítica predictiva que alerta tempranamente sobre trayectorias de abandono escolar, permitiendo intervenciones proactivas.
- **Accesibilidad nativa** (DUA): Principio de Accessibility by Design, garantizando múltiples formas de representación, acción e implicación desde el código base (ej. reescritura en "Lectura Fácil", interfaces operables por voz/teclado, alto contraste).

# 4\. ACTORES DEL SISTEMA

## 4.1. Actores humanos

- **Estudiante** (Nivel Secundario y Primario): Usuario final del módulo EstudIA. Interactúa con el sistema para consumir contenido adaptado, resolver desafíos gamificados (no competitivos) y gestionar sus carpetas de estudio.
- **Docente / Educado**r: Director del proceso educativo (Human-in-the-loop). Utiliza el copiloto para planificar, aprueba las secuencias didácticas generadas por la IA y monitorea el tablero de riesgo y perfiles cognitivos.
- **Administrador institucional** (Sector Privado \- B2B): Directivos de colegios que buscan visualizar métricas globales de rendimiento, retención y eficiencia operativa para la toma de decisiones.
- **Supervisor gubernamental** (Sector Público \- B2G): Entidades ministeriales que consumen analítica predictiva macro (Big Data) para diseñar políticas públicas de prevención de deserción escolar a gran escala.
- **Familiares / Tutores legales** (Evolución posterior al MVP Docente/Alumno): Actores de apoyo que participan activamente en el progreso lúdico y educativo del niño en el nivel primario.

## 4.2. Actores de sistema (Sistemas externos / IA)

- **Motor de IA generativa** (LLM Core): Subsistema responsable de la generación de diálogos socráticos, simplificación de textos (DUA) y corrección formativa de ensayos.
- **Sistemas de gestión escolar locales** (SIG): Sistemas externos (ej. GEM en Mendoza) con los cuales FoxMind interoperará eventualmente a través de APIs OpenAPI para cruzar datos de matrícula y riesgo.
