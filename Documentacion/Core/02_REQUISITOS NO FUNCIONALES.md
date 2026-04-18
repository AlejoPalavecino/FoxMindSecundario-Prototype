## **REQUISITOS NO FUNCIONALES (ATRIBUTOS DE CALIDAD ISO/IEC 25010\)**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- Estas métricas no funcionales aplican de forma prioritaria a los flujos implementados del MVP en Docente y Alumno.
- Requisitos adicionales para perfiles no incluidos en el prototipo validado se toman como objetivos de evolución.

# 1\. EFICIENCIA DE RENDIMIENTO (PERFORMANCE)

Dado que FoxMind opera en entornos escolares (alta concurrencia matutina) y utiliza modelos de IA generativa (LLM), la latencia debe ser controlada estrictamente para no romper la experiencia de usuario (Ley de la inmediatez cognitiva).

- **PER-01** (Latencia de Interfaz): El tiempo de carga del Elemento Principal (LCP \- Largest Contentful Paint) del dashboard del alumno y del docente debe ser inferior a 2.5 segundos en redes 4G/WIFI escolar estándar.
- **PER-02** (Calidad vs Latencia \- Tutor Socrático): Las respuestas del chat EstudIA priorizarán la exactitud y el modelado socrático. Si la respuesta requiere más de 1 segundo en procesarse, la UI debe desplegar indicadores visuales que humanicen la espera (ej. indicadores de "EstudIA está analizando tu respuesta..." o Skeleton Screens temporales).
- **PER-03** (Calidad vs Latencia \- Copiloto Pedagógico): La generación de secuencias didácticas complejas no tiene un límite de tiempo estricto que fuerce la interrupción del LLM, priorizando la precisión curricular. Para manejar tiempos de espera prolongados, la interfaz debe implementar obligatoriamente la siguiente matriz de estados de carga:
  - 1 a 3 segundos: Skeleton Screens (Ilusión de que el esqueleto del contenido ya está estructurándose).
  - 3 a 10 segundos: Barra de progreso determinada (Aporta certeza sobre el avance de la generación).
  - Más de 10 segundos: Barra de progreso acompañada de descripciones dinámicas de las subtareas activas (ej. "Cruzando datos con el diseño curricular provincial...", "Generando rúbricas de evaluación...") para reducir la ansiedad del docente.

# 2\. SEGURIDAD (SECURITY) Y PRIVACIDAD

Al operar bajo esquemas B2B/B2G y manejar perfiles cognitivos de menores (discapacidades, TDAH, TEA), el sistema asume una postura de "Seguridad por Diseño".

- **SEC-01** (Cumplimiento Normativo): El sistema debe cumplir estrictamente con normativas de protección infantil y de datos educativos (COPPA y FERPA 2025).
- **SEC-02** (Cifrado de Datos en Reposo): Todos los datos sensibles, especialmente los tableros de riesgo, diagnósticos de neurodivergencias y configuraciones DUA, deben estar cifrados en la base de datos utilizando el algoritmo AES-256.
- **SEC-03** (Cifrado en Tránsito): Toda comunicación entre el cliente, los servidores de FoxMind y los proveedores de LLM debe estar cifrada mediante TLS 1.3.
- **SEC-04** (Autenticación y Sesiones): Implementación de OAuth 2.0 / OIDC para el Single Sign-On (SSO) en colegios, y JWT (JSON Web Tokens) con expiración corta (máximo 1 hora) y refresh tokens rotativos para mitigar secuestros de sesión.

# 3\. FIABILIDAD Y DISPONIBILIDAD (RELIABILITY & AVAILABILITY)

El módulo EstudIA promete estar disponible 24/7. Una caída del sistema en época de exámenes rompe la propuesta de valor.

- **REL-01** (SLA de Disponibilidad): El sistema debe garantizar un Uptime (Tiempo de actividad) del 99.9% mensual (permitiendo no más de \~43 minutos de inactividad al mes).
- **REL-02** (Tolerancia a Fallos del LLM): Si el proveedor principal del modelo de lenguaje (ej. OpenAI, Anthropic) sufre una caída o rate limit, el sistema debe implementar un patrón de Circuit Breaker y hacer un fallback automático a un modelo secundario en menos de 3 segundos sin mostrar errores crípticos al usuario.

# 4\. USABILIDAD Y ACCESIBILIDAD (USABILITY)

La accesibilidad no es un "parche" en FoxMind, es su núcleo (Diseño Universal para el Aprendizaje \- DUA).

- **USA-01** (Cumplimiento WCAG 2.1): La interfaz completa debe cumplir con el nivel WCAG 2.1 AA de forma nativa, escalando a AAA para usuarios con perfiles de discapacidad visual activados.
- **USA-02** (Contraste Funcional): Los textos normales deben tener un ratio de contraste mínimo de 4.5:1 respecto al fondo. Los componentes interactivos (botones) deben tener un contraste mínimo de 3:1.
- **USA-03** (Soporte Multi-dispositivo): La interfaz debe ser completamente operativa en Desktop (monitores escolares), Tablets y Smartphones (para el Tutor Familiar y alumnos en el hogar), aplicando la regla táctil de la Ley de Fitts: objetivos de clic interactivos de mínimo 44x44px.

# 5\. ESCALABILIDAD (SCALABILITY)

- **SCA-01** (Elasticidad B2B/B2G): La arquitectura de microservicios o serverless debe ser capaz de auto-escalar (auto-scaling groups) en menos de 1 minuto para soportar picos de concurrencia de hasta 10,000 usuarios concurrentes (horarios de ingreso escolar a las 08:00 AM).
- **SCA-02** (Aislamiento Multi-Tenant): Los datos de cada institución (Colegio A vs Colegio B) o de Tutores Independientes deben estar lógicamente aislados a nivel de base de datos (mediante Tenant IDs obligatorios en cada consulta) para evitar fugas de información cruzada.

# 6\. MANTENIBILIDAD (MAINTAINABILITY)

- **MAI-01** (Límites de Complejidad): El código fuente generado no debe superar una Complejidad Ciclomática de 10 por método o función.
- **MAI-02** (Trazabilidad y Logs): Todas las decisiones algorítmicas de la IA (ej. por qué se activó un "Semáforo de Riesgo" o por qué se adaptó un contenido) deben dejar un registro de auditoría (audit log) explicable, permitiendo a los ingenieros y docentes depurar el sistema en cumplimiento con las leyes de transparencia algorítmica.
