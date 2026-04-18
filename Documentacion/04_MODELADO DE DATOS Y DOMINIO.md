## **MODELADO DE DATOS Y DOMINIO (ESTRUCTURA ESTÁTICA)**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- El modelado de dominio debe cubrir primero los módulos visibles en los detalles funcionales de Docente y Alumno.
- Entidades relacionadas con actores o productos no presentes en el prototipo validado se mantienen como extensiones planificadas.

# 1\. ENTIDADES PRINCIPALES (OBJETOS DE DOMINIO) Y RESPONSABILIDADES

Para estructurar el ecosistema FoxMind, el modelo se divide en tres subdominios lógicos: Identidad/Roles, Ecosistema Académico y Motor Cognitivo/EstudIA.

## 1.1. Subdominio de Identidad y Roles

- **User** (Clase Abstracta / Entidad Base): Gestiona credenciales, autenticación SSO, tokens y auditoría básica (creación/modificación).
- **Student** (Hereda de User): Almacena las métricas de resiliencia, rachas de estudio y el progreso gamificado intrapersonal (no competitivo).
- **Teacher** (Hereda de User): Posee métodos para la instanciación de aulas y vinculación al InstitutionalCalendar (Agenda).
- **FamilyTutor** (Hereda de User): Entidad ligera diseñada para la carga ágil de materiales en el hogar y lectura de sugerencias de apoyo.
- **Tenant / Institution:** Entidad que agrupa a los usuarios en el modelo B2B/B2G, garantizando el aislamiento de datos.

## 1.2. Subdominio Académico

- **Classroom** (Aula Virtual): El contenedor lógico donde interactúan docentes y alumnos. Almacena el plan de estudios y el contexto de la materia.
- **Activity / Task**: Representa una tarea, cuestionario o secuencia didáctica generada por el Copiloto Pedagógico.
- **GlobalEvent**: Representa feriados, recesos o inicio/fin del ciclo lectivo.
- **TeacherSchedule** (Agenda Docente): Representa la planificación específica de un profesor, la cual hereda visualmente los bloqueos de GlobalEvent.

## 1.3. Subdominio Cognitivo y EstudIA

- **CognitiveProfile** (Perfil DUA): Entidad fuertemente cifrada que almacena los requerimientos de accesibilidad del alumno (ej. necesidad de lectura fácil, dislexia, TDAH). Es la "fuente de verdad" para el patrón Decorator de la UI.
- **StudyFolder** (Carpeta de Estudio): Contenedor de apuntes creado por el alumno que orquesta los recordatorios de repetición espaciada.
- **RiskDashboard** (Semáforo de Riesgo): Entidad proyectada (materialized view) que calcula en tiempo real el nivel de riesgo de deserción cruzando entregas, login y rendimiento.

# 2\. RELACIONES, MULTIPLICIDADES Y CICLOS DE VIDA (UML)

Para que el ORM o la base de datos mantenga la integridad referencial, el agente de IA debe aplicar las siguientes reglas de ciclo de vida:

## 2.1. Relaciones de Composición (Relación Fuerte \- Cascada Estricta)

La Composición implica que si el objeto "Padre" se destruye, el objeto "Hijo" también debe ser destruido (ciclo de vida dependiente).

- **Student → CognitiveProfile** (1 a 1): Si el alumno es eliminado del sistema por políticas de retención de datos, su perfil cognitivo médico/sensible debe eliminarse inmediatamente.
- **Student → StudyFolder** (1 a 0..\*): Las carpetas de estudio pertenecen exclusivamente al alumno que las creó.
- **Classroom → Activity** (1 a 0..\*): Si un docente elimina una materia/aula específica de un año lectivo pasado, las actividades y tareas exclusivas de esa aula se eliminan (o se archivan en cascada).
- **Institution → TeacherProfile** (1 a 1..\*): El rol de docente le pertenece a la institución. Si la institución desactiva o elimina la cuenta del docente, este perfil se destruye o bloquea irrevocablemente. El usuario físico pierde automáticamente todo acceso a las entidades Classroom y Student asociadas a ese Tenant.

## 2.2. Relaciones de Agregación (Relación Débil \- Independencia)

La Agregación implica que los objetos están relacionados, pero pueden existir de forma independiente.

- **Classroom → Student** (1.. a 0..\*):\* Relación de muchos a muchos (gestionada por una tabla intermedia Enrollment). Si el Classroom (Aula) se elimina al final de año, el Student (Alumno) no se elimina de la base de datos, ya que pertenece a la institución y pasará de año.
- **User → TeacherProfile / FamilyTutorProfile**: Un usuario base (identidad/email) puede tener distintos perfiles. Si es desvinculado de un colegio (pierde su TeacherProfile), su cuenta base sigue existiendo y puede crearse un FamilyTutorProfile nuevo, pero este será un entorno "en blanco" (Tenant aislado),
- **FamilyTutor → Student** (1 a 1..\*): Un tutor familiar (Padre/Madre) puede estar vinculado a uno o varios alumnos (hermanos).

## 2.3. Asociaciones Estratégicas

- **StudyFolder → Classroom** (0.. a 1):\* Un alumno puede vincular su StudyFolder personal a un Classroom específico para heredar el plan de estudios del docente. Si el aula se cierra, la carpeta de estudio simplemente pierde la referencia (null), pero no se borra, protegiendo el PLE (Entorno Personal de Aprendizaje) del estudiante.
- **Activity → CognitiveProfile** (Asociación dinámica): Al momento de renderizar una actividad, el sistema consulta el CognitiveProfile del alumno en sesión para adaptar dinámicamente el contenido mediante IA (ej. cambiar texto a pictogramas).
