## **REGLAS DEL AGENTE (AGENT.MD) Y SCAFFOLDING**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](../Core/Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](../Core/Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](../Core/Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- Fuente funcional principal para construir features: [Detalle Rol Docente](../Core/Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](../Core/Detalle%20Rol%20Alumno.md).
- Fuente visual principal para UI/UX: [Desing system](../Core/Desing%20system.md).
- Los documentos tecnicos (00-09) definen restricciones de arquitectura, seguridad, testing y delivery para implementar esos flujos funcionales.

# 1\. STACK TECNOLÓGICO Y COMANDOS DE INICIALIZACIÓN

- **Frontend**: Next.js (React), TailwindCSS y componentes/tokens definidos por `../Core/Desing system.md` (MD3 puede usarse como referencia de patrones).
- **Backend**: Node.js (NestJS), TypeScript estricto.
- **Base de Datos & ORM**: Supabase (PostgreSQL administrado) \+ Prisma ORM.
- **Comandos Core** (Scaffolding):
  - **Inicializar**: npm install && npx prisma generate
  - **Levantar entorno local**: npm run dev
  - **Ejecutar suite actual**: npm run test
  - **Nota de estado**: `npm run test:e2e` todavia no forma parte del repo como comando consolidado; la cobertura E2E integral sigue siendo backlog prioritario del MVP.

# 2\. CONVENCIONES Y PROHIBICIONES INQUEBRANTABLES

- **Tipado estricto**: Prohibido el uso de any en TypeScript. Todas las interfaces deben mapear el Modelo de Dominio (Doc 4).
- **Seguridad cero-confianza**: PROHIBIDO almacenar secretos, tokens (JWT) o llaves de API (OpenAI/Anthropic) en texto plano. Usar exclusivamente variables de entorno (.env).
- **Límites de complejidad**: Ningún archivo debe superar las 200 líneas. Ninguna función debe superar las 20 líneas o tener una Complejidad Ciclomática mayor a 10\. Refactoriza inmediatamente si excedes esto.
- **Arquitectura limpia**: La capa de Dominio (Reglas de Negocio) NUNCA debe importar dependencias de la capa de Infraestructura (Base de datos, LLMs).

# 3\. REGLAS DE ORQUESTACIÓN (MODO PLAN VS. MODO BUILD)

- **Plan mode** (Análisis): Ante cualquier requerimiento complejo (ej. implementar la Agenda Docente o el Semáforo de Riesgo), el agente debe mapear el grafo de dependencias, estructurar la solución y DETENERSE.
- **Human approval gate**: El agente debe solicitar explícitamente aprobación humana (HITL) antes de modificar archivos físicos.
- **Build mode** (Ejecución): Solo tras la aprobación, el agente ejecutará los cambios físicos aplicando TDD (Fase RED \-\> GREEN \-\> REFACTOR).

# 4\. PROTOCOLO DE MEMORIA (ENGRAM)

Para evitar la amnesia agéntica entre sesiones, la interacción con la base de datos de contexto (SQLite) es OBLIGATORIA:

- Ejecuta el comando mem_save inmediatamente después de cada refactorización exitosa o corrección de bug crítico.
- Ejecuta mem_session_summary de forma obligatoria al finalizar tu sesión de trabajo para persistir el contexto arquitectónico para el siguiente agente.

# 5\. SKILLS REGISTRY (CARGA PEREZOSA)

Carga estos archivos .md complementarios SOLAMENTE bajo demanda para evitar Context Overload:

- **skill-dua-decorator**: Invócala SOLAMENTE cuando modifiques la UI/UX o la lógica para perfiles cognitivos (TDAH, Dislexia, Lectura Fácil).
- **skill-socratic-llm**: Invócala SOLAMENTE al alterar el LLM Gateway, los prompts del copiloto pedagógico o el módulo EstudIA.
- **skill-security-ferpa**: Invócala SOLAMENTE al programar flujos de autenticación, SSO o manipular datos personales (PII) de alumnos.
- **skill-clean-architecture**: Invócala SOLAMENTE al crear nuevas entidades o repositorios de base de datos.

# 6\. INTEGRACIÓN DE SERVIDORES MCP

Delega las siguientes operaciones a las herramientas conectadas vía Model Context Protocol (MCP):

- **Engram** (SQLite): Úsalo para buscar decisiones arquitectónicas previas o guardar el progreso.
- **Test-Sprite**: Úsalo para análisis de código base completo y generación automática de la suite de pruebas (TDD).
- **GitHub MCP**: Úsalo para crear Pull Requests, leer Issues o validar reglas de CI/CD.
- **Chrome DevTools MCP**: Úsalo exclusivamente para depurar la UI, medir la latencia LCP (Ley de inmediatez) y auditar el contraste de colores WCAG 2.1 AA.
- **Context-7**: Úsalo para buscar documentación actualizada de NestJS, Next.js o la API del LLM si detectas que tus datos de entrenamiento están obsoletos.
