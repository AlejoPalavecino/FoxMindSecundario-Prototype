## **SEGURIDAD (DEVSECOPS) Y CI/CD**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](../Core/Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](../Core/Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](../Core/Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- Las políticas de seguridad y CI/CD deben cubrir primero los flujos críticos implementados de Docente y Alumno.
- Cualquier control asociado a módulos fuera del prototipo validado se mantiene como roadmap de endurecimiento progresivo.

# 1\. FLUJO DE DESPLIEGUE (CI/CD) Y GUARDIAS DE ARQUITECTURA

El repositorio YA cuenta con un flujo base de Integración Continua en GitHub Actions (`.github/workflows/ci.yml` y `.github/workflows/pr-checks.yml`). Este documento diferencia entre lo que hoy esta implementado y lo que sigue siendo objetivo de madurez.

## 1.1. Reglas de oro del repositorio (Branch protection)

El objetivo operativo sigue siendo aplicar las siguientes politicas estrictas en el repositorio:

- **Prohibición de push directo**: Ningún desarrollador ni agente de IA puede hacer push directo a la rama main. Todo cambio de código debe ingresar obligatoriamente a través de un Pull Request (PR).
- **Main protegida** (Solo lectura): La rama principal (main) es un destino de solo lectura para el pipeline de CI/CD.
- **Bloqueo de merge determinista**: El botón de "Merge" se deshabilitará automáticamente si falla un solo check del pipeline (Linter, Tests, o Seguridad).

## 1.2. Fases del pipeline de CI/CD

Hoy cada Pull Request ejecuta checks de instalacion, lint, tests y build. El target completo de madurez es que toda PR dispare secuencialmente:

1. **Build & dependencias**: Instalación y compilación del proyecto para detectar errores de sintaxis catastróficos.
2. **Linter estricto**: Validación de formato y convenciones estéticas (previniendo los "Code Smells" del Documento 6).
3. **Ejecución de tests**: Paso exitoso del 100% de la suite de pruebas unitarias y de integración.
4. **Security scan**: Auditoría de vulnerabilidades.

# 2\. PRÁCTICAS DEVSECOPS Y AUDITORÍA AGÉNTICA

Dado el cumplimiento normativo exigido (COPPA / FERPA 2025), la seguridad no puede ser una validación manual de fin de mes.

## 2.1. Code review inteligente

Utilizaremos agentes específicos (como CodeRabbit o Cursor Rules) para auditar cada PR bajo tres ejes:

- **Consistencia**: ¿El agente anterior siguió el patrón Decorator para el motor DUA o los Singletons exigidos en el Documento 3?
- **Rendimiento**: Detección de bucles ineficientes en llamadas a la base de datos.
- **Lógica**: Validación de que el código cumple la intención del ticket original.

## 2.2. Seguridad estática (SAST) y escaneo de secretos

Hoy el repo ya ejecuta `npm audit` y `trufflehog` en CI. La siguiente etapa es incorporar una GitHub Action de review de seguridad mas profunda (o un SAST equivalente de grado empresarial) para bloquear:

- **Inyecciones**: SQL Injection y Cross-Site Scripting (XSS), críticos al procesar prompts de estudiantes en el módulo EstudIA.
- **Secretos expuestos**: Fugas de credenciales, llaves de API (ej. la clave de OpenAI/Anthropic) en texto plano.
- **Lógica insegura**: Fallos en la validación de tokens (JWT) o exposición de datos sensibles (como el CognitiveProfile).

# 3\. VERSIONADO AUTOMÁTICO Y ESTRATEGIA DE LIBERACIÓN

Para eliminar la burocracia de versionado y mantener una trazabilidad mas fuerte, el objetivo de mediano plazo es aplicar el flujo Release Please de Google.

## 3.1. Automatización del ciclo de vida

1. **Merge a main**: Al aprobarse un PR y fusionarse con main, se dispara la creación de una Release PR.
2. **Generación de changelog**: La IA genera automáticamente el changelog basándose en los mensajes de los commits y actualiza la versión semántica en el package.json.
3. **Aprobación de release**: Al hacer merge de esta Release PR, el sistema crea automáticamente el Git Tag (ej. v1.2.0), publica la versión en GitHub y lanza el despliegue al entorno de Producción.
