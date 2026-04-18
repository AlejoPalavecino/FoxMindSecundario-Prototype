## **REQUISITOS FUNCIONALES E HISTORIAS DE USUARIO**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- Los flujos funcionales de referencia para implementación son [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- Las historias o casos de uso fuera de ese alcance se consideran backlog de evolución, no bloqueo del MVP Docente/Alumno.

# 1\. ÉPICAS FUNCIONALES (MVP \- NIVEL SECUNDARIO Y B2B2C)

- **EP-01:** Gestión de Identidad y Roles: Diferenciación estricta de permisos entre Docentes (Grupal), Alumnos (Individual) y Tutores Familiares (Facilitador de hogar).
- **EP-02:** Gestión de Aulas y Calendario Compuesto: Herramientas core para el profesor (creación de cursos, ingesta de currículos) y visualización de la Agenda Docente (planificación personal \+ eventos institucionales).
- **EP-03:** Copiloto Pedagógico y Visibilidad (Docente): Dashboards de rendimiento masivo y alertas de riesgo del grupo completo.
- **EP-04 (Backlog de evolución):** Ecosistema Familiar (Módulo Tutor): Interfaz simplificada para padres, carga de tareas (fotos/texto) y sugerencias de acompañamiento.
- **EP-05:** Entorno EstudIA y Metacognición (Alumno): Carpetas personales, vinculación con el colegio/hogar y tutoría socrática.
- **EP-06:** Perfilado Cognitivo Seguro: ABM de accesibilidad y neurodivergencias (DUA nativo) bajo cifrado.

# 2\. HISTORIAS DE USUARIO (CRITERIO INVEST) \- SELECCIÓN CORE

## Rol: Docente (Enfoque Académico y Grupal)

- **US-D01** (Agenda Institucional y Planificación): Como Docente, quiero visualizar en mi agenda una capa con el calendario escolar oficial (fechas de inicio/fin de ciclo, recesos de invierno, feriados, asuetos y eventos institucionales), para poder estructurar mis secuencias didácticas sin superponerme con días no laborables.
- **US-D02** (Planificación Asistida en Agenda): Como Docente, quiero seleccionar un bloque de mi agenda y solicitar a la IA que me sugiera los temas a dar, para optimizar mi tiempo respetando los tiempos reales del ciclo lectivo.
- **US-D03** (Alta de Alumnos): Como Docente, quiero dar de alta a mis alumnos en mi aula virtual (vía CSV o manual), para gestionar el grupo entero y que ellos vean la materia automáticamente al loguearse.
- **US-D04** (Dashboard Grupal): Como Docente, quiero ver un panel de estadísticas del grupo completo con un "semáforo de riesgo", para identificar rápidamente qué temas necesitan refuerzo general o qué alumno requiere intervención.

## Rol: Tutor Familiar (Backlog de evolución)

- **US-T01** (Carga Ágil de Material): Como Tutor Familiar, quiero subir fotos de las tareas o apuntes de mi hijo desde una interfaz sencilla, para que el sistema procese el material y genere actividades de repaso o juegos para él en casa.
- **US-T02** (Sugerencias de Apoyo): Como Tutor Familiar, quiero recibir sugerencias prácticas de la IA basadas en el progreso de mi hijo, para saber cómo motivarlo y apoyarlo en sus bloqueos sin necesidad de ser un experto en la materia.
- **US-T03** (Monitoreo Individual): Como Tutor Familiar, quiero visualizar un dashboard exclusivo con el progreso individual de mi hijo, para hacer un seguimiento de sus rachas de estudio y cumplimiento de metas.

## Rol: Alumno (Aprendizaje y Metacognición)

- **US-A01** (Carpetas EstudIA): Como Alumno, quiero crear carpetas de estudio vinculadas a mis aulas (del colegio) o temas cargados por mi familia, para centralizar mi aprendizaje y recibir cronogramas de repetición espaciada.
- **US-A02** (Tutor Socrático): Como Alumno, quiero hacer preguntas al tutor IA 24/7, para recibir pistas y analogías que me ayuden a resolver mis tareas por mí mismo (Active Recall).

# 3\. CASOS DE USO CORE (FLUJOS ARQUITECTÓNICOS)

### **UC-01: Gestión de Aula y Agenda Compuesta (Docente)**

- **Actor Principal:** Docente.
- **Sistemas Involucrados:** Interfaz UI, LLM Core, Base de Datos (Módulo de Calendario Institucional).
- **Precondición:** El Administrador de la institución (o el sistema por defecto) ya ha cargado el "Calendario Escolar Oficial" del año en curso.
- **Flujo Básico:**
  1. El Docente inicia sesión y visualiza su "Panel Académico".
  2. Crea un Aula Virtual e ingesta el plan de estudios en PDF.
  3. Ingresa a la sección "Agenda Docente". El sistema le renderiza un calendario mensual/semanal.
  4. El sistema superpone automáticamente bloqueos visuales en los días correspondientes a recesos de invierno, feriados y asuetos. También marca con distintivos visuales el inicio y fin del ciclo lectivo por nivel.
  5. El Docente visualiza que la próxima semana tiene un feriado el día jueves. Selecciona los días martes y miércoles, y utiliza el "Copiloto Pedagógico" para que la IA le sugiera una secuencia didáctica que se ajuste a esos dos días hábiles.
  6. El Docente aprueba la secuencia generada por la IA y queda agendada. El sistema actualiza los tableros de los alumnos indicando qué se verá en esas fechas.

## UC-02: Dinámica de Acompañamiento en Casa (Tutor Familiar - Evolución)

- **Actor Principal:** Tutor Familiar (Padre/Madre).
- **Precondición:** El Tutor tiene una cuenta vinculada al perfil de su hijo mediante un código de seguridad familiar.
- **Flujo Básico:**
  1. El Tutor inicia sesión desde su móvil o PC y accede a su "Panel de Hogar" (interfaz simplificada, sin herramientas de gestión masiva).
  2. Nota que su hijo tiene dificultades con fracciones. Hace clic en "Reforzar Tema" y toma una foto de la tarea de la escuela.
  3. La IA (motor de visión y texto) extrae el problema, y lo envía al entorno EstudIA del alumno convertido en un reto interactivo.
  4. Al día siguiente, el Tutor ingresa a la pestaña "Progreso de mi Hijo". El sistema le indica que su hijo completó el reto y le muestra una "Sugerencia Práctica": "Tu hijo respondió bien cuando usamos gráficos visuales. Intenta usar analogías con comida (como porciones de pizza) si le ayudas hoy".

## UC-03: Onboarding de Alumnos (Doble Vía)

- Actor Principal: Alumno y Docente.
- Precondición: El aula virtual ya está creada.
- Flujo Básico A (Registro por Link de Invitación):
  1. El Docente genera un link de invitación único desde su aula y lo comparte.
  2. El Alumno hace clic en el link, completa su registro (alta en el sistema) y queda automáticamente enrolado en esa materia específica.
- Flujo Básico B (Alta Transparente por el Docente):
  1. El Docente carga los datos del alumno (nombre, email/DNI) directamente en la configuración del aula.
  2. El sistema crea una cuenta placeholder si el alumno no existe, o lo vincula si ya existe.
  3. Cuando el alumno inicia sesión por primera vez, visualiza el aula de forma automática en su panel.

## UC-04: Gestión de Carpetas de Estudio en EstudIA (Metacognición)

- Actor Principal: Alumno.
- Precondición: El Alumno está registrado y tiene materias asignadas o temas de interés personal.
- Flujo Básico:
  1. El Alumno ingresa al módulo EstudIA y selecciona "Nueva Carpeta de Estudio".
  2. Asigna un nombre (ej. "Examen Final Historia") y sube apuntes o el plan de estudios.
  3. El sistema le pregunta si desea vincular esta carpeta a un aula virtual existente (para heredar el contexto del docente).
  4. El Alumno acepta la vinculación. La IA analiza las fechas clave y genera un cronograma de estudio inverso basado en repetición espaciada.

## UC-05: Dashboards de Progreso (Docente y Alumno)

- Flujo Docente: El Docente ingresa a la pestaña "Rendimiento". El sistema segmenta la vista por "Curso/Año". Selecciona "3er Año A" y visualiza el progreso global, el Semáforo de Riesgo (analítica predictiva) y las alertas de intervención temprana.
- Flujo Alumno: El Alumno ingresa a "Mi Progreso". El sistema renderiza un gráfico (diseñado para fomentar la mentalidad de crecimiento, sin rankings competitivos ) mostrando su avance en las diferentes materias, rachas de estudio y métricas de resiliencia.

## UC-06: ABM de Perfil Cognitivo y Accesibilidad (Datos Sensibles)

- Actor Principal: Alumno (autogestión) o Docente (gestión delegada).
- Flujo Básico:
  1. El usuario navega a "Configuración de Accesibilidad".
  2. El sistema solicita confirmación de identidad (medida de seguridad adicional).
  3. El usuario selecciona configuraciones específicas (ej. "Modo OpenDyslexic", "Lectura Fácil por defecto", "Subtitulación forzada").
  4. El usuario (o el docente, si tiene el diagnóstico validado) marca la presencia de una neurodivergencia específica (TDAH, TEA).
  5. El sistema encripta esta selección en la base de datos (AES-256). A partir de este momento, el motor DUA altera al vuelo todos los prompts de generación de contenido para este alumno, respetando sus necesidades.
