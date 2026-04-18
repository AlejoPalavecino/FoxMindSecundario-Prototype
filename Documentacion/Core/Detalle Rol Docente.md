Documentación Funcional: Perfil Docente (FoxMind EdTech)

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

1. Visión General del Sistema
   El perfil Docente en FoxMind está diseñado como un ecosistema de gestión escolar potenciado por Inteligencia Artificial (Copiloto Foxy). Su objetivo principal es reducir la carga administrativa, optimizar la planificación mediante herramientas generativas y proveer analíticas predictivas basadas en el Diseño Universal para el Aprendizaje (DUA) e indicadores de riesgo.
   Arquitectura de UI: Single Page Application (SPA) basada en React. Navegación por estado (sin router tradicional en el prototipo) gestionada vía Context API.
   Diseño Visual: Utiliza una paleta cromática de baja fatiga visual (fondos #E4EFEA, acentos en teal #489980) orientada a interfaces de uso prolongado.
2. Estructura de Navegación y Layout principal
   El sistema utiliza un layout de navegación lateral (Sidebar) colapsable en escritorio y una barra de navegación inferior (Bottom Nav) en dispositivos móviles.
   Componentes Globales:
   Menú Lateral: Gestión de navegación a los 6 módulos principales.
   Perfil Rápido: Indicador de sesión activa con iniciales y rol.
   Selector de Rol: Capacidad de alternar al portal del Alumno (funcionalidad exclusiva de demo).
3. Módulos y Funcionalidades Principales
   3.1. Dashboard (Panel Principal)
   Vista: DashboardDocente.tsx
   Propósito: Centro de comando operativo. Proporciona un vistazo rápido de las métricas clave del día y accesos directos a las herramientas más utilizadas.
   Métricas Rápidas KPI:
   Total de alumnos activos.
   Alertas de intervención temprana (alumnos en riesgo).
   Tareas pendientes de corrección.
   Índice general de asistencia.
   Widget AI (Foco Rápido): Input directo para interactuar con "Foxy" desde la página de inicio (ej. "¿Qué temas doy en Biología hoy?").
   Cronograma del Día: Línea de tiempo cronológica con las clases del día en curso.
   Distribución DUA (Diseño Universal para el Aprendizaje): Gráfico resumen radial que muestra los perfiles de aprendizaje predominantes en todas sus aulas (Visual, Auditivo, Kinestésico).
   3.2. Gestión de Aulas
   Vista: AulasDocente.tsx
   Propósito: Módulo central (Core) para la administración académica, interacción con alumnos y evaluación. Pantalla dividida en modalidad "Lista de Aulas" y "Detalle de Aula" multifuncional.
   Vista General (Directorio): Tarjetas resumen por materia/curso indicando progreso general, entregas pendientes y promedio. Botones de acción rápida: Ir al Aula, Ajustes, Reportes AI.
   Detalle de Aula (5 Pestañas Gestionales):
   Alumnos: Tabla de gestión de lista. Muestra Nombre, Riesgo Académico (Alto, Medio, Bajo), Perfil DUA y última conexión. Incluye botón de acciones por alumno.
   Actividades:
   Tablero de tareas divididas en Activas y Cerradas.
   Modal de Corrección/Edición: Permite ver entregas.
   Integración Foxy AI: Capacidad de generar consignas o rúbricas de evaluación automáticamente utilizando la IA interactuando a través de un panel lateral colapsable.
   Currícula: Seguimiento del programa de estudios dividido por unidades y subtemas, con indicadores de estado (Completado, En curso, Pendiente).
   Rendimiento: Analíticas específicas del aula. Gráficos de distribución de notas, asistencia promedio y evolución del promedio histórico.
   Muro (Comunidad): Espacio tipo foro para anuncios generales, debates y publicaciones. Permite comentarios de alumnos e indicador de "vistos".
   3.3. Agenda y Planificación
   Vista: AgendaDocente.tsx
   Propósito: Organización temporal e integración de la IA en la planificación curricular ("Lesson Planning").
   Calendario (Grid View): Vista mensual interactiva de lunes a domingo.
   Tipología de Eventos: Diferenciación visual de eventos: Académico, Evaluación, Junta, etc.
   Planificador AI (Copiloto): Botón flotante para invocar la "Generación de Secuencia Didáctica". Foxy puede crear automáticamente una secuencia completa a partir de un tema (ej. Introducción a la Biología Celular), dividiéndola en:
   Apertura interactiva.
   Desarrollo teórico (con adaptaciones DUA).
   Cierre y evaluación formativa.
   3.4. Progreso de Clase (Analíticas Multi-Aula)
   Vista: ProgresoDocente.tsx
   Propósito: Panel analítico de alto nivel ("High-level overview") para decisiones pedagógicas fundamentadas en datos.
   Comparativa Matricial: Tabla dinámica que compara el rendimiento (Promedio general y Progreso del programa) entre las distintas aulas que maneja el docente.
   Sistema de Alertas Tempranas (Intervenciones AI): Motor predictivo (simulado). Identifica automáticamente a alumnos con caída abrupta en rendimiento (ej. "Valentina bajó 20% su rendimiento en Matemáticas") y sugiere planes de acción específicos mediante Foxy.
   Distribución Metodológica (DUA): Análisis detallado de los perfiles de los alumnos, sugiriendo al docente qué recursos (videos, lecturas, audios) debe preparar en base a cómo aprenden sus cursos.
   3.5. Foxy IA (Copiloto Pedagógico Standalone)
   Vista: CopilotoIADocente.tsx
   Propósito: Interfaz conversacional dedicada (Chatbot IA) para consultas pedagógicas avanzadas, creación de recursos y análisis de documentos.
   Chat Conversacional: Interfaz tipo LLM con historial de mensajes.
   Sugerencias de Prompt: Botones rápidos para funciones comunes (Planificar Clase, Crear Rúbrica, Adaptar texto para Dislexia).
   Generador Contextual (Panel Lateral): Cuando Foxy genera un recurso estructurado (ej. una rúbrica o un examen), no solo lo devuelve en texto, sino que abre un previsualizador de documentos interactivo con opciones de Copiar, Exportar PDF e Insertar en Aula.
   3.6. Configuración de Cuenta y Accesibilidad
   Vista: ConfiguracionDocente.tsx
   Propósito: Personalización de la experiencia de usuario y datos del perfil.
   Perfil Profesional: Edición de datos personales, descripción profesional e información de contacto.
   Preferencias Visuales (Accesibilidad):
   Tamaño de fuente (Pequeño, Mediano, Grande).
   Densidad de la interfaz (Cómoda vs Compacta).
   Modo de color (Claro, Oscuro, Automático).
   Notificaciones: Switches para gestionar correos electrónicos sobre entregas tardías, resúmenes semanales y alertas generadas por la IA.
   Seguridad: Modificación de contraseña y gestión de dispositivos.
4. Diferenciadores Clave para la Arquitectura del Producto
   AI como "Layer" y no como destino: La funcionalidad de LLM (Foxy) no está aislada solo en un chat, sino que está embebida en el flujo natural de trabajo (dentro de la Agenda, dentro de la corrección de Actividades, y en el sistema de alertas tempranas).
   Enfoque nativo en Accesibilidad y DUA: El sistema registra de manera nativa cómo aprende el estudiante y utiliza esos datos en el dashboard del docente para influir activamente en la manera en que el profesor debe planificar su clase.
   Filosofía "Zero-setup": Gran parte de las herramientas (como evaluaciones o secuencias) se diseñaron asumiendo que el docente requiere generación en 1-clic a partir del contexto del aula, minimizando la necesidad de escribir "prompts" complejos manualmente.
