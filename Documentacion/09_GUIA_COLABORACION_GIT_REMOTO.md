# GUIA DE COLABORACION - 2 DEV FULL STACK (GIT REMOTE COMPARTIDO)

## 1. Objetivo

Esta guia define como trabajar 2 personas full stack sobre un remote compartido sin pisarse cambios, manteniendo velocidad y calidad.

## Alineación operativa con el prototipo

- Para implementar alcance MVP, el equipo debe tomar como referencia funcional obligatoria: `Detalle Rol Docente.md` y `Detalle Rol Alumno.md`.
- Para decisiones de UI/UX y componentes, la referencia obligatoria es `Desing system.md`.
- Los documentos técnicos `00` a `09` gobiernan el "como" (arquitectura, testing, seguridad, colaboración) de esa implementación.

Resultado esperado:

- Cambios chicos y trazables.
- Integracion continua sin romper `main`.
- Flujo de informacion claro entre producto, codigo y despliegue.

## 2. Modelo de trabajo recomendado

Para un equipo de 2 devs full stack, conviene usar **Trunk-Based Development liviano**:

- Una rama estable: `main`.
- Ramas cortas por tarea: `feat/...`, `fix/...`, `docs/...`.
- PR obligatoria para mergear a `main`.
- Nadie pushea directo a `main`.

## 3. Reglas de Git (obligatorias)

### 3.1 Branch naming

Usar formato:

`type/descripcion-corta`

Ejemplos:

- `feat/aulas-kanban-actividades`
- `fix/oauth-refresh-token`
- `docs/guia-colaboracion`

Tipos sugeridos:

- `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`.

### 3.2 Commits

Usar Conventional Commits:

`type(scope): descripcion`

Ejemplos:

- `feat(auth): agregar login con google`
- `fix(aulas): corregir filtro de entregas`
- `docs(workflow): definir reglas de PR`

### 3.3 Pull Requests

Toda PR debe incluir:

1. Issue o tarea vinculada.
2. Resumen corto de cambio.
3. Lista de archivos tocados.
4. Como probarlo.
5. Riesgos conocidos.

Regla de oro:

- Minimo 1 aprobacion del otro dev antes de merge.

## 4. Configuracion del remote compartido

### 4.1 Unica fuente de verdad

- Repositorio remoto unico (GitHub/GitLab/Bitbucket).
- `origin/main` es la rama canonica.
- Repo oficial del proyecto: `https://github.com/AlejoPalavecino/FoxMindSecundario-Prototype`.

### 4.2 Proteccion de rama `main`

Activar en el remote:

1. Bloquear push directo.
2. Requerir PR para merge.
3. Requerir al menos 1 review.
4. Requerir checks en verde (lint/test).
5. Bloquear merge si hay conflictos.

## 5. Flujo diario de trabajo (paso a paso)

### 5.1 Inicio del dia

Cada dev:

1. Revisa si hubo cambios en remoto (commits a `main`, PRs abiertas y comentarios de review pendientes).
2. Actualiza `main` local.
3. Valida con el otro dev si hay superposicion de archivos/modulos.
4. Crea rama nueva desde `main`.
5. Toma una tarea concreta (ticket pequeno).

Comandos base:

```bash
git checkout main
git fetch origin
git pull origin main
git checkout -b feat/mi-cambio
```

Checklist operativo (obligatorio):

- [ ] Revise commits nuevos en `origin/main`.
- [ ] Revise PRs abiertas y comentarios pendientes.
- [ ] Sincronicé `main` local antes de crear rama.
- [ ] Validé con el otro dev posibles cruces de archivos/modulos.
- [ ] La rama creada responde a una sola tarea acotada.

### 5.2 Durante el desarrollo

- Cambios chicos, commits frecuentes.
- Si toca backend y frontend, hacerlo en vertical por feature (no por capa separada) para cerrar valor rapido.
- Sincronizar con el otro dev cuando ambos toquen el mismo modulo.

### 5.3 Antes de abrir PR

1. Rebase o merge de `main` a la rama.
2. Resolver conflictos localmente.
3. Ejecutar pruebas/lint.
4. Push de rama y apertura de PR.

Ejemplo:

```bash
git checkout feat/mi-cambio
git fetch origin
git rebase origin/main
git push -u origin feat/mi-cambio
```

### 5.4 Review y merge

1. El otro dev revisa PR (codigo + comportamiento).
2. Si aprueba, merge.
3. Borrar rama remota.
4. Ambos actualizan `main`.

## 6. Como repartir trabajo entre 2 full stack

No dividir por tecnologia fija ("vos backend, yo frontend").

Dividir por **slice funcional**:

- Dev A: "Aulas > Actividades > Entrega" (UI + API + DB).
- Dev B: "Agenda > Eventos > Notificaciones" (UI + API + DB).

Ventajas:

- Menos handoff.
- Menos bloqueos.
- Cada feature sale completa.

## 7. Flujo de informacion (quien informa que y donde)

### 7.1 Fuente de verdad por nivel

1. **Producto/alcance**: docs funcionales en `Documentacion/`.
2. **Trabajo operativo**: tablero de issues/tickets.
3. **Implementacion**: ramas + PRs.
4. **Decision tecnica**: comentario en PR y/o mini-ADR en docs.

### 7.2 Circuito de informacion

`Requisito -> Issue -> Rama -> Commit -> PR -> Review -> Merge -> Deploy`

Regla:

- Si no esta en issue o PR, "no existe" como decision de equipo.

### 7.3 Ritual minimo semanal

- Daily corta (10-15 min): que hice, que hare, bloqueos.
- Sync tecnico (2 veces por semana): revisar deuda tecnica y proximas features.
- Retro quincenal: que funciono y que ajustar del flujo.

## 8. Estrategia para evitar conflictos

1. PRs chicas (ideal: < 400 lineas netas).
2. Evitar ramas largas (> 2 dias sin merge).
3. Si ambos tocan mismo archivo, coordinar primero por chat.
4. Mantener contratos API claros (DTOs y tipos compartidos).
5. Integrar temprano, no al final.

## 9. Checklist rapido (operativo)

Antes de abrir PR:

- [ ] Estoy actualizado con `origin/main`.
- [ ] Commits con convención.
- [ ] Lint/test en verde.
- [ ] Cambios documentados en la PR.
- [ ] Solicite review del otro dev.

Antes de mergear:

- [ ] PR aprobada.
- [ ] Checks en verde.
- [ ] Sin conflictos pendientes.
- [ ] Impacto funcional validado.

## 10. Convencion minima sugerida para FoxMind

- Rama principal: `main`.
- Modo de integracion: PR obligatoria.
- Politica de release: merge continuo a `main` + tags por hito (`v0.1.0`, `v0.2.0`).
- Regla de ownership: quien abre PR sigue responsable hasta que quede en produccion.

---

Si el equipo crece a 3+ personas, evolucionar esta guia agregando:

- CODEOWNERS por carpetas.
- Ambientes `dev` / `staging` / `prod` con gates.
- Pipeline de CI con calidad y seguridad obligatoria.
