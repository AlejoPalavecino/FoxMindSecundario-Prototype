## **ARQUITECTURA DE LA EXPERIENCIA (UX/UI)**

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Alineación operativa con el prototipo

- Esta arquitectura UX/UI implementa los flujos definidos en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- La guía visual canónica para tokens, color, tipografía y componentes es [Desing system](Desing%20system.md).

# 1\. SISTEMA DE DISEÑO BASE

Para garantizar la coherencia visual, la accesibilidad nativa y acelerar el desarrollo del MVP, el agente de IA deberá basar la construcción de la interfaz en **[Desing system](Desing%20system.md)**. Material Design 3 puede utilizarse como referencia de patrones, pero no reemplaza los tokens y decisiones canónicas del Design System del proyecto.

- Justificación: Material Design 3 ofrece un sistema de color dinámico y responsivo que se alinea perfectamente con nuestra necesidad de "Accesibilidad Nativa" (DUA). Permite adaptar paletas de alto contraste dinámicamente según el perfil del alumno y cuenta con componentes optimizados tanto para Desktop (Docentes) como para Mobile (Tutores Familiares).
- Jerarquía cromática: Se aplicará estrictamente la regla 60-30-10 (60% fondo neutro, 30% color secundario de soporte, 10% color de acento para Call to Actions o alertas del Semáforo de Riesgo) para evitar la sobreestimulación sensorial, crucial para alumnos con TEA o TDAH.

# 2\. LEYES DE LA PSICOLOGÍA COGNITIVA APLICADAS

## 2.1. Gestión de la elección (Ley de Hick)

El tiempo para tomar una decisión aumenta logarítmicamente con el número de opciones: _T \= b . log2 (n \+ 1\)_.

- **Aplicación en el tutor familiar**: El panel del padre/madre no debe tener menús anidados complejos. La acción principal ("Subir tarea para repasar") debe ser el foco absoluto, reduciendo **_n_** (opciones) al mínimo indispensable.
- **Aplicación en el copiloto docente**: En lugar de presentar un formulario masivo de 20 campos para crear una secuencia didáctica, se utilizará el patrón Progressive Disclosure (Asistente paso a paso), solicitando primero el tema, luego el objetivo, y finalmente generando el contenido.

## 2.2. Precisión y alcance (Ley de Fitts)

El tiempo para alcanzar un objetivo depende de la distancia y el tamaño: _ID \= log2 (D/W \+ 1\)_.

- **Aplicación Mobile-First** (Alumnos y Tutores): Todos los botones críticos, como el micrófono para hablar con EstudIA o el botón de tomar foto a la tarea, deben ubicarse en la "Zona del Pulgar" inferior y tener un tamaño táctil mínimo de 44x44px. Esto previene frustración en niños desarrollando motricidad fina y en interfaces móviles.

# 3\. HEURÍSTICAS DE USABILIDAD CRÍTICAS (JAKOB NIELSEN)

El agente frontend debe auditar su propio código contra estas reglas:

1. **Visibilidad del estado del sistema**: Dada la latencia natural de los LLMs, el usuario siempre debe saber qué pasa. Se prohíbe dejar la pantalla estática tras enviar un prompt. Se usarán Skeleton Screens (1-3s) o Barras de progreso con texto explicativo (ej. "Analizando plan de estudios...").
2. **Control y libertad del usuario**: En el módulo del Docente, siempre debe existir un botón de "Regenerar/Deshacer" visible antes de publicar una secuencia generada por IA, permitiendo corregir "alucinaciones" del modelo fácilmente.
3. **Prevención de errores**: El botón de "Asignar al Aula" permanecerá deshabilitado (disabled) hasta que el Docente haga scroll o marque un checkbox de "Revisado", forzando el Human-in-the-Loop.
4. **Reconocimiento vs. recuerdo**: El tutor socrático EstudIA debe mantener a la vista el contexto de la tarea original en una tarjeta superior, para que el alumno no tenga que memorizar el problema matemático mientras chatea con la IA.

# 4\. MICROINTERACCIONES (MODELO DE DAN SAFFER)

Definimos la "conversación" entre el sistema y el usuario para detalles críticos.

## Microinteracción 1: Adaptación DUA al vuelo (Lectura Fácil)

- **Disparador** (Trigger): El motor de IA detecta 3 fallos consecutivos de un alumno en un problema de texto abstracto, o el alumno presiona el botón "Simplificar".
- **Reglas** (Rules): El LLM procesa el texto a Nivel 2 (Lectura Fácil) o Gráfico.
- **Feedback**: El texto original se desvanece suavemente (fade-out) y el nuevo contenido aparece con un sutil destello verde o icono de "Varita mágica" indicando que FoxMind lo ha adaptado.
- **Bucles/Modos** (Loops/Modes): El sistema entra en "Modo Visual" para el resto de la sesión de esa materia.

## Microinteracción 2: Alerta de semáforo de riesgo (Docente)

- **Disparador** (Trigger): El Event Bus recibe un cálculo donde el riesgo de un alumno pasa de "Bajo" a "Medio/Alto".
- **Reglas** (Rules): El dashboard docente se actualiza en tiempo real sin recargar la página.
- **Feedback**: El indicador junto al nombre del alumno cambia de color (ej. de verde a amarillo). Si el riesgo es Alto, la fila del alumno sube al inicio de la lista con una animación sutil para captar la atención.
- **Bucles/Modos** (Loops/Modes): Se mantiene el modo de alerta hasta que el docente hace clic y agenda una intervención.

# 5\. ACCESIBILIDAD (WCAG 2.1)

- **Contraste obligatorio**: Nivel AA garantizado. Textos normales con ratio de 4.5:1.
- **Tipografía inclusiva**: Opción nativa en el perfil del alumno para cambiar globalmente la fuente a OpenDyslexic o tipografías Sans-Serif de alta legibilidad (tamaño base mínimo de 16px, line-height de 1.5).
