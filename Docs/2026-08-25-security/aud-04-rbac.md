# AUD-04 — Implementación de autorización RBAC

## 1. Objetivo

Implementar autorización basada en roles y alcance de recurso sobre las rutas administrativas y recursos sensibles incluidos en el alcance de AUD-04.

La autorización se aplica exclusivamente en backend y utiliza la identidad autenticada disponible en `req.user`.

La implementación mantiene el esquema definido previamente en la matriz de acceso de AUD-00 y el contrato de autenticación establecido en AUD-01/AUD-02.

---

## 2. Flujo de autorización

El flujo aplicado es:

```text
Request
→ autenticación JWT
→ req.user
→ política RBAC
→ validación de rol/alcance
→ endpoint
```

Los datos utilizados para autorización provienen del JWT:

```text
req.user.sub
req.user.roles
req.user.dependenciaId
```

No se utilizan roles, identificadores de usuario ni dependencias enviados por el cliente como fuente de autoridad.

Cuando una operación recibe una dependencia destino desde `body` o `query`, dicho valor se utiliza únicamente como recurso solicitado y se compara contra la dependencia autorizada del JWT.

---

## 3. Estructura implementada

La implementación mantiene una estructura reducida:

```text
Middleware/authMiddleware.js
    autenticación e identidad

Middleware/rbacMiddleware.js
    autorización

security/roles.js
    roles canónicos

security/policies.js
    definición de políticas

security/accessMatrix.js
    matriz endpoint/política
```

La autorización se centraliza mediante:

```js
authorizePolicy(policy, resolvers)
```

Los resolvers se utilizan únicamente cuando una política necesita información del recurso almacenada en base de datos.

---

## 4. Roles

Se mantienen los roles canónicos existentes:

```text
SuperAdministrador
Supervisor
Administrador de Dependencia
```

---

## 5. Políticas utilizadas

### `SUPER_ADMIN`

Acceso exclusivo para:

```text
SuperAdministrador
```

Alcance global.

Aplicada principalmente a administración de usuarios, auditoría y administración de dependencias.

---

### `NORM_ADMIN`

Roles admitidos:

```text
SuperAdministrador
Supervisor
Administrador de Dependencia
```

Reglas:

```text
SuperAdministrador
→ alcance global

Supervisor
→ propia dependencia

Administrador de Dependencia
→ propia dependencia
```

La dependencia se obtiene desde `req.user.dependenciaId`.

---

### `PUBLISH_NORM`

Roles admitidos:

```text
SuperAdministrador
Supervisor
```

Reglas:

```text
SuperAdministrador
→ alcance global

Supervisor
→ únicamente normativas de su dependencia
```

Un `Administrador de Dependencia` no puede publicar normativas mediante esta política.

---

### `CONSEJO`

Roles admitidos:

```text
SuperAdministrador
Supervisor
Administrador de Dependencia
```

Reglas:

```text
SuperAdministrador
→ alcance global

Supervisor
→ únicamente si pertenece a Consejo Superior

Administrador de Dependencia
→ únicamente si pertenece a Consejo Superior
```

La pertenencia a Consejo Superior se determina a partir de la dependencia identificada por el JWT y resuelta contra base de datos.

---

### `PUBLIC_PUBLISHED`

Autenticación condicional.

Permite acceso a usuarios que no inician sesion cuando el recurso se encuentra en estado publicado.

Para recursos no públicos:

```text
SuperAdministrador
→ alcance global

Normativa
→ acceso según dependencia

Recurso de Consejo Superior
→ acceso según política de Consejo
```

Se incorporó autenticación opcional para permitir que una misma ruta pueda atender tanto recursos públicos como recursos protegidos.

---

### `RESOURCE_UPLOAD`

La autorización depende del recurso destino.

#### Normativas

```text
SuperAdministrador
→ cualquier dependencia

Supervisor
→ propia dependencia

Administrador de Dependencia
→ propia dependencia
```

#### Actas y órdenes del día

```text
SuperAdministrador
→ alcance global

Supervisor
→ Consejo Superior

Administrador de Dependencia
→ Consejo Superior
```

---

## 6. Rutas protegidas en la implementación

### Usuarios

Las operaciones administrativas de usuarios quedan restringidas mediante:

```text
SUPER_ADMIN
```

Incluye las operaciones de creación, edición, consulta, cambio de estado y eliminación contempladas por el router de usuarios.

---

### Auditoría

La búsqueda administrativa de auditoría queda protegida mediante:

```text
SUPER_ADMIN
```

---

### Dependencias

Se aplicó `SUPER_ADMIN` sobre las operaciones administrativas de dependencia:

```text
GET    /api/dependencia/datos/:id
POST   /api/dependencia/create
POST   /api/dependencia/edit
GET    /api/dependencia
POST   /api/dependencia/search
DELETE /api/dependencia/eliminar/:id
```

Se mantiene acceso público en:

```text
GET /api/dependencia/getDependencias
GET /api/dependencia/name
```

La consulta:

```text
GET /api/dependencia/sesiones
```

queda protegida mediante:

```text
CONSEJO
```

---

### Normativas

Se aplicaron las políticas correspondientes según operación.

#### Consulta de recurso

```text
GET /api/normativa/datos/:id
→ PUBLIC_PUBLISHED
```

Una normativa publicada puede consultarse sin iniciar sesion.

Una normativa no publicada requiere autorización.

#### Administración

```text
POST   /api/normativa/edit
POST   /api/normativa/create
GET    /api/normativa/traer/:id
DELETE /api/normativa/eliminar/:id
POST   /api/normativa/searchEliminadas
POST   /api/normativa/searchDespublicadas
GET    /api/normativa/deleted
POST   /api/normativa/restaurar/:id
```

Política:

```text
NORM_ADMIN
```

#### Publicación

```text
POST /api/normativa/publicar/:id
```

Política:

```text
PUBLISH_NORM
```

#### Rutas públicas conservadas

No se agregó autenticación a las operaciones definidas como públicas:

```text
POST /api/normativa/search
GET  /api/normativa/yearNormativa
GET  /api/normativa/mas-buscadas
```

---

### Sesiones

Las operaciones de sesiones del Consejo Superior quedan protegidas mediante:

```text
CONSEJO
```

Rutas:

```text
DELETE /api/sesiones/eliminar/:id
POST   /api/sesiones/create
GET    /api/sesiones/:id
```

El `SuperAdministrador` conserva acceso global.

Los demás roles requieren pertenecer a Consejo Superior.

---

### Archivos

#### Upload de recurso existente

```text
POST /api/file/upload/:id
```

Política:

```text
RESOURCE_UPLOAD
```

La autorización se determina de acuerdo con el tipo de recurso:

```text
normativa
consejo
acta
```

#### Upload para creación de normativa

```text
POST /api/file/upload
```

Política:

```text
RESOURCE_UPLOAD
```

Para usuarios no globales se compara:

```text
req.user.dependenciaId
```

contra:

```text
req.body.id_dependencia
```

El valor recibido desde el cliente no se considera una fuente de autorización.

#### Download

```text
GET /api/file/download
```

Política:

```text
PUBLIC_PUBLISHED
```

Antes de autorizar la descarga se determina mediante base de datos a qué recurso pertenece el archivo.

Para archivos de normativa se utiliza:

```text
estado
id_dependencia
```

Para actas y órdenes del día se aplica el alcance correspondiente a Consejo Superior.

La existencia física del archivo no determina por sí sola que el usuario pueda descargarlo.

---

## 7. Resolución de dependencia

Para operaciones limitadas por dependencia se utiliza:

```text
req.user.dependenciaId
```

como fuente de autoridad.

Los identificadores provenientes de:

```text
req.body
req.query
req.params
```

representan únicamente el recurso o destino solicitado.

La autorización compara estos valores contra la identidad autenticada.

Ejemplo:

```text
JWT dependenciaId = 4
recurso dependenciaId = 4
→ permitido

JWT dependenciaId = 4
recurso dependenciaId = 7
→ 403
```

El `SuperAdministrador` omite esta restricción por poseer alcance global.

---

## 8. Códigos de respuesta

Las políticas implementadas mantienen la separación entre autenticación y autorización:

```text
401
→ usuario no autenticado
→ token ausente cuando es obligatorio
→ token inválido o vencido

403
→ usuario autenticado
→ rol o alcance insuficiente
```

Las rutas públicas mantienen su comportamiento sin autenticación obligatoria.

---

## 9. Cambios auxiliares

### Autenticación opcional

Se incorporó:

```js
optionalAuthenticateToken
```

para recursos `PUBLIC_PUBLISHED`.

Comportamiento:

```text
sin token
→ continúa como usuario sin iniciar sesion

token válido
→ carga req.user

token inválido
→ 401
```

Esto permite mantener recursos publicados accesibles públicamente sin perder autorización sobre recursos privados servidos desde la misma ruta.

### Contexto de acceso de normativa

La consulta de contexto de normativa expone exclusivamente los datos requeridos para autorización:

```text
estado
dependenciaId
resourceType
```

### Contexto de acceso de archivos

Los archivos se asocian primero con su recurso registrado en base de datos.

Un archivo no adquiere permisos únicamente por encontrarse físicamente dentro del directorio de almacenamiento.

---

## 10. Validación realizada durante el desarrollo

Durante la implementación se validaron los casos relevantes de las políticas incorporadas:

```text
sin token
→ 401

token válido + rol/alcance insuficiente
→ 403

token válido + autorización suficiente
→ acceso permitido

SuperAdministrador
→ alcance global

dependencia propia
→ acceso cuando corresponde

dependencia ajena
→ 403

Consejo Superior
→ acceso a recursos Consejo cuando corresponde

recurso publicado
→ acceso anónimo
```

Se validaron además los escenarios específicos de:

```text
normativas privadas
publicación de normativas
listados por dependencia
sesiones
uploads
downloads
Consejo Superior
```
---

## 11. Fuera de alcance de AUD-04

Esta rama no intenta resolver otros hallazgos de la auditoría.

No forman parte de esta implementación:

### Seguridad física de uploads

No se resuelve en AUD-04:

```text
validación de PDF por firma
límites de tamaño
path traversal
nombres de archivo
archivos temporales huérfanos
limpieza ante errores
```

Estas medidas corresponden al bloque específico de seguridad de archivos/uploads.

### Auditoría de actor

No se modifica en esta rama la obtención del actor utilizado para registrar eventos de auditoría.

La eliminación de fuentes como:

```text
x-user-id
body.userId
```

y la utilización exclusiva del actor proveniente del JWT corresponde al issue específico de integridad de auditoría.

### Secretos y datos sensibles

No se corrigen en AUD-04 logs que puedan exponer:

```text
hashes
tokens
credenciales
```

Estos cambios pertenecen al hallazgo específico de exposición de información sensible.

### Manejo global de errores

No se modifica la arquitectura general de `errorHandler` ni el tratamiento global de errores fuera de lo estrictamente requerido por RBAC.

### Seguridad de archivos

La autorización implementada determina quién puede acceder a un recurso.

No sustituye los controles posteriores requeridos para seguridad del filesystem.

### Rutas fuera del alcance operativo acordado

No se extendió en esta rama la implementación RBAC hacia grupos que no forman parte del alcance operativo definido para AUD-04, entre ellos:

```text
emisores
dashboard
tags
relaciones
tipo_normativa
contacto
```

Las rutas públicas existentes tampoco fueron convertidas artificialmente en rutas autenticadas.

La cobertura completa y automatizada de la matriz se realizará en el issue de pruebas correspondiente.

---

## 12. Criterio de diseño

La implementación se mantiene deliberadamente simple.

La solución utiliza únicamente:

```text
roles
políticas
alcances
middleware
resolvers puntuales de recurso
```
---

## 13. Resultado

AUD-04 deja implementado el flujo:

```text
Request
→ JWT
→ req.user
→ authorizePolicy(...)
→ validación de rol
→ validación de alcance
→ endpoint
```

Las operaciones cubiertas por esta rama ya no dependen únicamente de que el usuario se encuentre autenticado.

Cada operación protegida valida además que el actor autenticado posea el rol y alcance requeridos sobre el recurso solicitado.

-Se corrigue un bug visual en el visor de PDF. 
