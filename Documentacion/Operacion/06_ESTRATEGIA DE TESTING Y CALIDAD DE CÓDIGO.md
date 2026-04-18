## **ESTRATEGIA DE TESTING Y CALIDAD DE CÓDIGO**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](../Core/Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](../Core/Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](../Core/Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- La priorización de testing debe cubrir primero los recorridos críticos definidos en los detalles de rol Docente y Alumno.
- Los criterios visuales y de accesibilidad de tests de UI deben validar tokens y componentes de [Desing system](../Core/Desing%20system.md).

# 0\. ESTADO ACTUAL DEL REPO

La estrategia original de testing define el target de calidad del proyecto, pero el estado actual del repositorio es mas acotado:

- Hay tests unitarios e integracion fuertes en backend para `auth`, `classroom`, `enrollment` y `activity`.
- Hay tests puntuales en frontend web para logica especifica, pero NO una suite E2E integral cerrada para los flujos criticos del producto.
- Los modulos mas exigidos por esta estrategia (`EstudIA`, riesgo, DUA runtime, LLM Gateway) todavia no estan implementados en runtime y, por lo tanto, tampoco tienen la cobertura prometida.

El objetivo inmediato es cerrar primero E2E del core academico actual antes de exigir la matriz completa prevista para fases futuras.

# 1\. ESTRATEGIA DE TEST-DRIVEN DEVELOPMENT (TDD) AGÉNTICO

Para garantizar que el código cumpla con las especificaciones del negocio, los agentes de IA deberán operar bajo un ciclo TDD adaptado al Spec-Driven Development (SDD):

1. **Definición del contrato** (Humano): El arquitecto o desarrollador define los edge cases (casos límite) y el comportamiento esperado. Ejemplo: "Si el alumno tiene perfil de TDAH y falla 3 veces, la tarea debe devolver el Decorator visual".
2. **Fase RED** (Agente IA): El agente escribe primero la prueba automatizada (Unit/Integration Test) basándose en la especificación. La prueba debe fallar al ejecutarse.
3. **Fase GREEN** (Agente IA): El agente escribe el código mínimo de implementación en el dominio de FoxMind para que la prueba pase exitosamente.
4. **Fase REFACTOR** (Humano \+ IA): Se optimiza el código generado para cumplir con las métricas de calidad sin romper la prueba en verde.

# 2\. MATRIZ DE PRIORIZACIÓN DE PRUEBAS (RISK-BASED TESTING)

No todo el código tiene el mismo impacto. El agente de IA priorizará la cobertura de pruebas según la siguiente jerarquía:

- **Lo crítico** (Cobertura 90%+ obligatoria): Lógica central del negocio implementada en runtime. Hoy esto incluye autenticación (SSO/Roles), permisos de aulas, enrollment, activities/submissions/grading y sus contratos server-driven. A medida que entren `Semáforo de Riesgo`, DUA runtime y LLM Gateway, pasan a esta misma categoría.
- **Lo importante** (Cobertura 70%+): Código generado por IA que gestiona reglas complejas (ej. el algoritmo de repetición espaciada de las StudyFolders) y los casos límite sufridos históricamente.
- **Lo delegable** (Cobertura básica automatizada): Happy paths (caminos felices) de la interfaz de usuario, utilidades menores y formateadores de texto. El agente usará mocks básicos para estas pruebas.

# 3\. MÉTRICAS DE CALIDAD DE CÓDIGO Y PREVENCIÓN DE "CODE SMELLS"

Para evitar que el agente de IA genere código ilegible, frágil o monstruoso, se establecen los siguientes límites estrictos (Guardrails) en el linter y analizador estático (ej. SonarQube / ESLint):

## 3.1. Prevención de "Bloaters" (Clases y métodos gigantes)

La IA tiende a escupir bloques de código masivos si no se la restringe.

- **Límite de clase/archivo**: Ninguna clase o archivo de dominio (ej. ClassroomService o CognitiveProfileManager) puede superar las 200 líneas de código. Si lo hace, el agente está obligado a refactorizar y extraer responsabilidades.
- **Límite de método/función**: Ninguna función individual puede superar las 20 líneas. Debe cumplir el Principio de Responsabilidad Única (SRP).

## 3.2. Límites de complejidad

- **Complejidad ciclomática** (Max 10): Limita la cantidad de caminos independientes a través del código fuente. Si un método tiene más de 10 if/else/switch anidados, será rechazado automáticamente por el pipeline de CI/CD.
- **Complejidad cognitiva** (Max 8): Penaliza el código que es difícil de leer para un humano (ej. bucles anidados dentro de condicionales dentro de otros bucles). El agente debe utilizar cláusulas de guarda (Guard Clauses) y retornos tempranos (Early Returns) en lugar de anidamientos profundos.

# 4\. PRIORIDAD INMEDIATA DE QA

Antes de abrir nuevos modulos grandes, el backlog de calidad debe cerrar:

1. E2E reales de autenticacion.
2. E2E reales de onboarding/enrollment.
3. E2E reales del flujo docente/alumno de actividades, entregas, correccion y re-entrega.
4. Tests UI adicionales para acknowledgement y estados criticos del frontend.

# 5\. AUDITORÍA Y HUMAN-IN-THE-LOOP (HITL)

El código de los tests y la lógica principal serán revisados por agentes de auditoría (ej. herramientas tipo CodeRabbit o Cursor Rules configuradas con nuestros parámetros) en cada Pull Request. Sin embargo, la regla final es inquebrantable: el desarrollador/arquitecto humano debe validar que los contratos de entrada/salida y los edge cases del negocio estén cubiertos correctamente. La IA verifica la sintaxis; el humano valida la intención de negocio.
