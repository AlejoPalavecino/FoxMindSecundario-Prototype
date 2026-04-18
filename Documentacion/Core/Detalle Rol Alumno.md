Documentación Funcional: Perfil Alumno (FoxMind EdTech)

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

1. Visión General del Sistema
   El perfil Alumno en FoxMind está enfocado en la autonomía, la gamificación y el acompañamiento constante. Fue diseñado no solo como un repositorio de tareas, sino como un "Tutor Inteligente" que fomenta la metacognición. La Inteligencia Artificial (Foxy) interactúa de manera socrática, guiando al alumno hacia las respuestas en lugar de dárselas hechas.
   Arquitectura de UI: Single Page Application (SPA) basada en React.
   Identidad Visual Alumno: Utiliza la paleta global de baja fatiga visual (fondos #E4EFEA "Fox Surface"), pero los acentos interactivos principales y el Copiloto AI destacan en Lavanda Paz / Violeta (#827397), diferenciándolo claramente del área docente (teal/azul).
   Paradigma de UX: Centrado en la recompensa continua (dopamina positiva), claridad de próximos pasos y reducción de la carga cognitiva.
2. Estructura de Navegación y Layout principal
   Comparte la estructura base con el docente (Sidebar en desktop, Bottom Nav en mobile) para garantizar consistencia tecnológica, pero adapta los módulos a las necesidades del estudiante.
   Componentes Globales:
   Menú Lateral (5 Módulos Core): Dashboard, Aulas, EstudIA (Tutor AI), Mi Progreso y Configuración.
   Widget de Racha Global (Streak): Indicador visual constante en la navegación que fomenta el hábito de estudio diario.
3. Módulos y Funcionalidades Principales
   3.1. Dashboard (Inicio Rápido)
   Vista: DashboardAlumno.tsx
   Propósito: Hub de aterrizaje que responde a la pregunta inmediata: "¿Qué tengo que hacer hoy?"
   Panel de Bienvenida Gamificado: Muestra Nivel actual, Puntos de Experiencia (XP) y racha de días de estudio.
   KPIs de Rendimiento: Resumen rápido de Progreso general, Tareas pendientes y Precisión global en quizzes.
   Asistente Proactivo (Foco Diario): Un widget destacado donde la IA (Foxy) sugiere directamente el "Siguiente paso óptimo" (ej. "Tienes una tarea de matemática para mañana, ¿empezamos?").
   Accesos Rápidos (Bento Grid): Tarjetas grandes para saltar directo a Aulas, EstudIA o Calendario.
   Resumen de Cursos Activos: Tarjetas simplificadas por asignatura mostrando la barra de progreso general y la próxima entrega.
   3.2. Aulas (Entorno Académico)
   Vista: AulasAlumno.tsx
   Propósito: El espejo de la vista docente. Mantiene total paridad arquitectónica para que cuando el profesor dé una indicación de navegación, la pantalla del alumno coincida exactamente.
   Vista General: Cuadrícula de asignaturas con sus respectivos profesores y porcentajes de completitud.
   Detalle de Aula (5 Pestañas de Consumo):
   Compañeros: Tabla de la lista de clase (excluyendo estrictamente metadatos sensibles como Riesgo o Perfil DUA por privacidad).
   Actividades: Tablero Kanban simplificado (Pendientes / Completadas). Permite abrir el Task Workspace para ver consignas, entregar archivos o revisar calificaciones retrospectivas.
   Currícula: Mapa de ruta de la asignatura (Syllabus) marcando qué temas ya se dieron y cuáles faltan.
   Mi Rendimiento: Analíticas "Single-Player". Muestra solo los datos del propio alumno en esa materia: Promedio, asistencia, histórico de notas y evolución en el tiempo.
   Muro: Feed oficial de la clase para ver anuncios del docente y comentar (sistema de foros).
   3.3. EstudIA (Tutor Socrático y Área de Estudio)
   Vista: EstudiaAlumno.tsx
   Propósito: La "Killer Feature" del alumno. Un entorno seguro donde la IA actúa como tutor privado basándose estrictamente en el material escolar.
   Sistema de Carpetas (Study Sets): Organización de materiales en carpetas. El sistema diferencia entre carpetas generadas por el docente ("Clase") y carpetas creadas por el alumno ("Personales").
   Visor de Documentos Integrado: Previsualización en pantalla dividida de apuntes, PDFs o textos al lado del chat.
   Chatbot Socrático (Foxy): Interfaz conversacional.
   Guardrails Socráticos: El agente está pre-configurado para no dar respuestas directas a ejercicios, sino hacer preguntas guía.
   Herramientas de Prompt Rápido (One-Click AI): Acciones predefinidas sobre el documento actual:
   "Explicámelo como si tuviera 5 años".
   "Generar Resumen".
   "Crear Flashcards".
   "Dificultar texto" / "Simplificar texto" (Adaptación DUA accionable por el alumno).
   Modo Quiz Generativo: Pantalla modal interactiva donde la IA crea un examen de opción múltiple al vuelo basado en los apuntes de la carpeta para autoevaluación.
   3.4. Mi Progreso (Analíticas Deportivas y Gamificación)
   Vista: ProgresoAlumno.tsx
   Propósito: Un motor de retención estructurado como el perfil de una app de fitness o videojuegos (estilo Duolingo/Strava). Totalmente rediseñado con el flujo: Acción Inmediata -> Estadísticas -> Análisis.
   Cabecera de Nivel: Indicador superior de progreso RPG (Role-Playing Game) con nivel visible y XP total.
   Análisis Predictivo de Foxy: Caja de texto superior con un insight verbal (ej. "Tu dominio en Literatura es excelente, pero ajustemos Matemáticas") acoplado a un botón de Acción Directa (ej. "Iniciar Quiz de Refuerzo").
   Próximos Repasos (Tarjetas de Acción): Tarjetas horizontales de alta prioridad indicando qué sesión de estudio debe realizar "Hoy" o "Mañana", con duración estimada y botón de "Comenzar".
   Tarjetas de Tendencia: KPIs con comparativas temporales (ej. "+12% vs. mes pasado" en repasos hechos, Racha de días).
   Dominio por Materia: Barras de progreso que asimilan cada asignatura a un "Skill Tree" de videojuegos, mostrando el Nivel específico alcanzado en Biología, Historia, etc.
   Actividad Semanal: Gráfico de barras indicando los minutos de estudio por día contra un objetivo/target (línea de base de 60 mins).
   Vitrina de Logros (Achievements): Cuadrícula inferior de medallas desbloqueables (obtenidas vs. bloqueadas/escala de grises) que recompensan comportamientos sistémicos (entregas tempranas, uso de DUA, rachas largas).
   3.5. Configuración y Accesibilidad DUA
   Vista: ConfiguracionAlumno.tsx
   Propósito: Empoderar al alumno para que la plataforma se adapte a su neurodiversidad o preferencias visuales/cognitivas.
   Incluye las mismas opciones estructurales que el docente (contraseñas, notificaciones, perfil).
   Fuerte énfasis en el panel de Accesibilidad Integrada (Tamaño de fuente, contraste, modo de concentración para dislexia, etc.), permitiendo que el alumno determine cómo consume la información sin etiquetarlo frente a sus pares.
4. Diferenciadores Clave para la Arquitectura del Producto
   Motor Socrático Restringido: Técnicamente, el promting del Copiloto del Alumno es fundamentalmente diferente al del Docente. Mientras el Docente actúa como generador (creando contenido), el Alumno actúa en un entorno guiado restrictivo (para evitar "trampas" y fomentar el aprendizaje genuino).
   Economía de la Atención Positiva: La UI de la sección "Mi Progreso" prioriza métricas de esfuerzo (tiempo de estudio, rachas, repasos hechos) por encima de métricas de resultado puro (la nota del examen), alineándose con enfoques pedagógicos modernos de mentalidad de crecimiento (Growth Mindset).
   Privacidad por Diseño (Privacy by Design): El alumno tiene paridad de vistas con el profesor (como en las Aulas), pero los adaptadores de datos (mock o backend futuro) filtran estructuralmente cualquier anotación privada del docente (perfiles de riesgo, observaciones de gabinete psicopedagógico).
