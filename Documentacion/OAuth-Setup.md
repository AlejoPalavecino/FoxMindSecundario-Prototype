# OAuth 2.0 Authentication Setup

## Aclaraciones transversales del MVP

- **Base de datos del MVP**: La implementación del MVP se realizará sobre **Supabase** (PostgreSQL administrado), no sobre una instalación convencional/autogestionada de PostgreSQL.
- **Alcance funcional validado en prototipo**: El prototipo actual cubre en profundidad los dos perfiles principales, **Rol Docente** y **Rol Alumno**. El detalle funcional oficial está en [Detalle Rol Docente](Detalle%20Rol%20Docente.md) y [Detalle Rol Alumno](Detalle%20Rol%20Alumno.md).
- **Sistema de diseño de referencia**: Las decisiones de UI deben alinearse con [Desing system](Desing%20system.md). Si hay diferencias con lineamientos previos, prevalece este documento de diseño para el MVP.

## Configuración Completada

Se ha implementado autenticación OAuth 2.0 con los siguientes proveedores:

- **Google OAuth 2.0**
- **Microsoft Azure AD / Office 365**

## Estructura Creada

```
apps/api/src/auth/
├── auth.module.ts                 # Módulo principal de autenticación
├── auth.controller.ts             # Endpoints OAuth y tokens
├── auth.service.ts                # Lógica de negocio (validación, tokens)
├── strategies/
│   ├── google.strategy.ts         # Estrategia Passport para Google
│   ├── microsoft.strategy.ts      # Estrategia Passport para Microsoft/Azure AD
│   └── jwt.strategy.ts            # Estrategia Passport para JWT
├── guards/
│   ├── jwt-auth.guard.ts          # Guard global JWT (con soporte @Public)
│   └── roles.guard.ts             # Guard para verificar roles de usuario
├── decorators/
│   ├── current-user.decorator.ts  # @CurrentUser() extrae usuario del request
│   ├── public.decorator.ts        # @Public() marca endpoints sin auth
│   └── roles.decorator.ts         # @Roles(...) restringe por rol
└── dto/
    ├── auth-response.dto.ts       # DTO de respuesta (tokens + user)
    ├── token-payload.dto.ts       # Payload del JWT
    └── refresh-token.dto.ts       # DTO para renovar tokens
```

## Endpoints Disponibles

| Method | Endpoint                   | Descripción                            |
| ------ | -------------------------- | -------------------------------------- |
| GET    | `/auth/google`             | Inicia flujo OAuth con Google          |
| GET    | `/auth/google/callback`    | Callback de Google (genera tokens)     |
| GET    | `/auth/microsoft`          | Inicia flujo OAuth con Microsoft       |
| GET    | `/auth/microsoft/callback` | Callback de Microsoft (genera tokens)  |
| POST   | `/auth/refresh`            | Renueva access token con refresh token |
| POST   | `/auth/logout`             | Cierra sesión (limpia refresh token)   |
| GET    | `/auth/me`                 | Obtiene usuario actual (requiere auth) |

## Variables de Entorno Requeridas

Las siguientes variables están en `.env.example` y deben configurarse en `apps/api/.env`:

```env
# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_REFRESH_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"

# Microsoft OAuth
MICROSOFT_CLIENT_ID="your-microsoft-client-id"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"
MICROSOFT_TENANT_ID="common"
MICROSOFT_CALLBACK_URL="http://localhost:4000/auth/microsoft/callback"

# App URLs
APP_URL="http://localhost:3000"
API_URL="http://localhost:4000"
```

## Cómo Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services > Credentials**
4. Haz clic en **Create Credentials > OAuth 2.0 Client ID**
5. Configura la pantalla de consentimiento si es necesario
6. Selecciona **Web application** como tipo
7. Agrega las siguientes URIs autorizadas:
   - **Authorized JavaScript origins**: `http://localhost:4000`
   - **Authorized redirect URIs**: `http://localhost:4000/auth/google/callback`
8. Copia el **Client ID** y **Client Secret** a tu `.env`

## Cómo Configurar Microsoft OAuth

1. Ve a [Azure Portal](https://portal.azure.com/)
2. Ve a **Azure Active Directory > App registrations**
3. Haz clic en **New registration**
4. Configura:
   - **Name**: FoxMind Development
   - **Supported account types**: Accounts in any organizational directory (Any Azure AD directory - Multitenant)
   - **Redirect URI**: Web → `http://localhost:4000/auth/microsoft/callback`
5. En la app registrada:
   - Copia el **Application (client) ID** → `MICROSOFT_CLIENT_ID`
   - Copia el **Directory (tenant) ID** → `MICROSOFT_TENANT_ID` (o usa "common" para multi-tenant)
6. Ve a **Certificates & secrets**
7. Crea un **New client secret**
8. Copia el **Value** → `MICROSOFT_CLIENT_SECRET` (¡solo se muestra una vez!)
9. Ve a **API permissions** y agrega:
   - Microsoft Graph → Delegated permissions
   - `openid`, `profile`, `email`

## Migración de Esquema en Supabase

Los siguientes campos deben existir en la entidad de usuario dentro de Supabase PostgreSQL. En este MVP, Prisma se mantiene como capa ORM en backend, por lo que la referencia de modelo es:

```prisma
model User {
  // ... campos existentes

  // OAuth IDs
  googleId      String?    @unique
  microsoftId   String?    @unique

  // Refresh token (hasheado)
  refreshToken  String?

  // ... resto de campos
}
```

**Aplicar migración (Prisma sobre Supabase):**

```bash
cd apps/api
npx prisma migrate deploy
# O si es desarrollo:
npx prisma migrate dev
```

## Flujo de Autenticación

### 1. Usuario hace clic en "Login with Google/Microsoft"

```
Frontend → GET http://localhost:4000/auth/google
```

### 2. API redirige a Google/Microsoft

El usuario se autentica en el proveedor OAuth.

### 3. Proveedor redirige de vuelta al callback

```
Google/Microsoft → GET http://localhost:4000/auth/google/callback?code=...
```

### 4. API genera tokens y redirige al frontend

```
API → Redirect http://localhost:3000/auth/callback?accessToken=...&refreshToken=...
```

### 5. Frontend guarda tokens y los envía en requests

```
Authorization: Bearer <accessToken>
```

## Uso en el Código

### Proteger Endpoints

Por defecto, **todos los endpoints requieren autenticación** (JwtAuthGuard global).

Para permitir acceso público:

```typescript
@Controller('public')
@Public()  // Todos los endpoints de este controller son públicos
export class PublicController {}

// O en un endpoint específico:
@Get('some-public-endpoint')
@Public()
getSomething() {}
```

### Obtener Usuario Actual

```typescript
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

### Restringir por Rol

```typescript
@Get('admin-only')
@Roles(UserRole.ADMIN)
getAdminData() {
  // Solo accesible por ADMIN
}

@Get('teachers-and-admins')
@Roles(UserRole.ADMIN, UserRole.TEACHER)
getTeacherData() {
  // Accesible por ADMIN o TEACHER
}
```

## Renovar Tokens

Cuando el `accessToken` expira (15 minutos por defecto):

```typescript
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

Respuesta:

```json
{
  "tokens": {
    "accessToken": "nuevo-access-token",
    "refreshToken": "nuevo-refresh-token",
    "expiresIn": 900
  },
  "user": {
    "id": "...",
    "email": "user@example.com",
    ...
  }
}
```

## Cerrar Sesión

```typescript
POST /auth/logout
Authorization: Bearer <accessToken>
```

Esto limpia el `refreshToken` de la base de datos, invalidando futuras renovaciones.

## Seguridad

1. **Refresh tokens son hasheados** con bcrypt antes de guardarse en DB
2. **JWT secret debe cambiarse** en producción
3. **Tokens en query params** es menos seguro que cookies httpOnly, pero más simple para desarrollo
4. **HTTPS requerido** en producción
5. **JwtAuthGuard global** protege todos los endpoints por defecto

## Próximos Pasos (No Implementados)

- [ ] Enviar tokens en cookies httpOnly en lugar de query params
- [ ] Implementar rate limiting en endpoints de auth
- [ ] Agregar 2FA (autenticación de dos factores)
- [ ] Implementar registro con email/password
- [ ] Verificación de email
- [ ] Reset de contraseña
- [ ] Sesiones activas y revocación
- [ ] Audit log de eventos de autenticación

## Troubleshooting

### Error: "Usuario no autorizado"

- Verifica que el usuario tenga `status: ACTIVE` en la DB
- Verifica que el token JWT sea válido

### Error: "Refresh token inválido"

- El refresh token puede haber expirado (7 días por defecto)
- El usuario puede haber cerrado sesión
- Re-autenticarse con Google/Microsoft

### Error: OAuth callback falla

- Verifica que las URLs de callback coincidan exactamente en el proveedor OAuth
- Verifica las credenciales en `.env`
- Revisa los logs del servidor

## Verificación

```bash
# Compilar
npm run build

# Linter
npm run lint

# Iniciar servidor
npm run dev
```

Visita `http://localhost:4000/auth/google` para probar el flujo OAuth.
