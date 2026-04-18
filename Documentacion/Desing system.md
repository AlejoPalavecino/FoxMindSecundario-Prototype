Design System & UI Guidelines: FoxMind EdTech

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Este documento [Desing system](Desing%20system.md) es la fuente prioritaria para decisiones de UI del MVP.

1. Filosofía de Diseño
   El diseño de FoxMind está construido bajo el principio de "Baja Carga Cognitiva y Cero Fatiga Visual". Al ser una plataforma educativa de uso prolongado (varias horas al día), se ha erradicado el uso del color blanco puro (#FFFFFF) y el negro puro (#000000).
   La interfaz utiliza tintes sutiles de la familia de los verdes y esmeraldas para evocar calma, concentración y reducir el deslumbramiento de la pantalla (glare).
2. Paleta de Colores (Color System)
   La paleta está centralizada mediante variables CSS globales y extendida en la configuración de Tailwind CSS.
   2.1. Fondos y Superficies (Background & Surfaces)
   Reemplazan al blanco tradicional para evitar la vista cansada.
   🟢 Background Base (--color-fox-bg): #E4EFEA
   Uso: Fondo general de la aplicación (body) y áreas inactivas.
   🟢 Superficies (--color-fox-surface): #F0F7F4
   Uso: Reemplazo del "blanco" para tarjetas, modales, menús laterales y contenedores de contenido.
   🟢 Bordes (--color-fox-border): #CDE0D8
   Uso: Divisores, bordes de tarjetas suaves e inputs inactivos.
   2.2. Tipografía y Textos (Text Colors)
   Textuales conformados por la misma matriz cromática (teal oscuro) para mantener armonía y suavizar el contraste brusco del texto negro sobre fondo claro.
   🌑 Texto Principal (--color-fox-text-main): #1A332A
   Uso: Títulos (H1-H6), texto de énfasis y datos clave.
   🌘 Texto Secundario/Muteado (--color-fox-text-muted): #4A665D
   Uso: Párrafos explicativos, subtítulos, placeholders y textos de interface pasivos.
   2.3. Colores de Marca y Acción (Brand & Action)
   🦊 Naranja Foxy (--color-fox-orange): #F68D2C
   Uso: Color corporativo de la mascota. Usado para CTAs (Call to Actions) primarios en el login, notificaciones de alto nivel, sistema de rachas (streaks) y acentos de marca.
   🦚 Teal Pacífico (--color-fox-primary): #489980
   Uso: Identificador del Rol Docente. Botones principales, gráficos, navegación activa e interacciones clave del profesor.
   🪻 Lavanda Pacífico (--color-fox-purple): #827397
   Uso: Identificador del Rol Alumno. Acentos principales, interacciones del chat con la IA, módulos predeterminados del estudiante. Transmite creatividad y tranquilidad.
   2.4. Colores Semánticos (Feedback & Status)
   Tonos pastelizados para no romper la armonía visual de la plataforma.
   ✅ Éxito (--color-fox-green): #52A874 (Tareas entregadas, respuestas correctas, crecimiento).
   ❌ Error/Alerta Altas (--color-fox-red): #D96C63 (Alertas de intervención temprana, estudiantes en riesgo, entregas no realizadas).
   ⚠️ Advertencia (--color-fox-yellow): #E5B842 (Calificaciones medias, fechas de entrega próximas).
   🏆 Logros (--color-fox-gold): #E5A030 (Gamificación, trofeos, medallas y subidas de nivel).
3. Tipografía (Typography)
   El sistema utiliza Google Fonts con una combinación de tipografía Serif moderna para lectura y Sans-Serif geométrica para destacar.
   3.1. Familia de Títulos (Heading Font)
   Fuente: Montserrat (Sans-Serif geométrica).
   Variable Tailwind: font-heading
   Pesos (Weights): Regular (400), Medium (500), SemiBold (600), Bold (700).
   Comportamiento: Se aplica exclusivamente a etiquetas H1, H2, H3, H4, números de métricas grandes (KPIs) y títulos de tarjetas. Tiene un espaciado entre letras (tracking) ligeramente ajustado (tracking-tight en títulos grandes).
   3.2. Familia de Cuerpo (Body Font)
   Fuente: Roboto (Sans-Serif humanista, alta legibilidad).
   Variable Tailwind: font-sans
   Pesos (Weights): Regular (400), Medium (500), Bold (700).
   Comportamiento: Párrafos, textos de botones, interfaces conversacionales del chat, menús. Optimizado para lectura en pantallas con antialiased habilitado.
4. Estilos Estructurales (Formas y Sombras)
   El producto se aleja de los bordes rectos tradicionales (estilo ofimático) y abraza un estilo "App-like" y orgánico.
   4.1. Radios de Borde (Border Radius)
   Tarjetas y Contenedores Mayores: rounded-3xl (24px) o rounded-2xl (16px). Otorga un aspecto moderno y amigable.
   Botones y Text Inputs: rounded-xl (12px).
   Etiquetas Píldora (Badges): rounded-full para estados y categorías.
   Burbujas de Chat IA: Borde asimétrico (rounded-tl-sm o rounded-tr-sm) junto con rounded-2xl para indicar de dónde proviene el mensaje.
   4.2. Sombras y Profundidad (Elevation)
   La profundidad se logra combinando fondos tintados con sombras extremadamente sutiles, huyendo del "drop shadow" duro.
   Paneles reposo: shadow-sm (Junto con border-fox-border).
   Hover sobre tarjetas: Transición a shadow-md combinada con un desplazamiento hover:-translate-y-1 para sensación de elevación táctil.
   Modales Dropdowns y Modales Flotantes: shadow-xl o shadow-2xl (para separarlos claramente de la capa del dashboard).
5. Patrones de Interacción Modulares (Components)
   5.1. Botones Primarios
   Cuerpo sólido usando el color de rol (bg-fox-primary o bg-fox-purple).
   Texto blanco (text-white), font-weight Bold.
   Hover: Disminución sutil de opacidad (hover:bg-opacity-90).
   Sombra pequeña o resplandor.
   5.2. Botones Secundarios / Fantasma (Ghost)
   Fondo transparente o igual a la superficie (bg-fox-surface).
   Borde visible (border-fox-border).
   Texto del color principal de la marca (text-fox-primary).
   Hover: Fondo coloreado a un 5% u 10% de opacidad (hover:bg-fox-primary/5). Se usa extensamente en tarjetas iterables.
   5.3. Inputs y Áreas de Texto
   Fondos re-hundidos (bg-fox-bg dentro de una tarjeta de bg-fox-surface).
   Ring de focus activo para accesibilidad (focus:ring-2 focus:ring-fox-primary/20 focus:border-fox-primary). Siempre deben indicar claramente cuándo están siendo seleccionados.
   5.4. Data Display (Badges y Etiquetas)
   Patrón constante: Fondo del color principal al 10% de opacidad combinado con texto al 100% de color.
   Ejemplo: <span className="bg-fox-primary/10 text-fox-primary px-2 py-1 rounded-md">Activo</span>.
   Aporta color sin sobrecargar visualmente la pantalla con bloques sólidos.
6. Iconografía
   Librería: lucide-react.
   Estilo: Íconos lineales (stroke de 2px), bordes redondeados.
   Comportamiento base: El set de iconos acompaña los textos sin opacarlos. Al activarse o en estado hover, escalan sutilmente de tamaño (group-hover:scale-110) o se trasladan (group-hover:translate-x-1 en flechas direccionales).
