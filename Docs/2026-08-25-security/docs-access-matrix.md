# Matriz de acceso por endpoint y rol

## 1. Alcance

Inventario de endpoints Express y definición de acceso por política, rol, dependencia, etc.

## 2. Resumen

| Métrica | Total |
| --- | ---: |
| Routers Express | 13 |
| Endpoints | 65 |
| Públicos | 13 |
| Condicionales | 5 |
| Protegidos | 45 |
| Internos/no externos | 2 |
| Activos | 61 |
| Legacy | 2 |

## 3. Roles

| Código | Rol |
| --- | --- |
| SA | `SuperAdministrador` |
| SUP | `Supervisor` |
| AD | `Administrador de Dependencia` |

Los nombres de rol son canónicos y sensibles a mayúsculas.

## 4. Políticas aprobadas

| Política | Autenticación | Roles | Alcance |
| --- | --- | --- | --- |
| `PUBLIC` | No requerida | No aplica | Público. |
| `PUBLIC_PUBLISHED` | Condicional | SA, SUP, AD | Anónimo si el recurso está publicado; recurso privado sujeto a autorización. |
| `AUTHENTICATED` | Requerida | SA, SUP, AD | Global. |
| `SUPER_ADMIN` | Requerida | SA | Global. |
| `NORM_ADMIN` | Requerida | SA, SUP, AD | SA global; SUP y AD limitados a su dependencia. |
| `PUBLISH_NORM` | Requerida | SA, SUP | SA global; SUP limitado a su dependencia. |
| `CONSEJO` | Requerida | SA, SUP, AD | SA global; SUP y AD pertenecientes a Consejo Superior. |
| `RESOURCE_UPLOAD` | Requerida | SA, SUP, AD | Política del recurso de destino. |
| `INTERNAL_REMOVE` | No externa | Ninguno | Retiro o conversión a operación interna. |

## 5. Estados del endpoint

| Estado | Significado |
| --- | --- |
| `active` | Vigente. |
| `legacy` | Vigente, sujeto a revisión. (Rutas duplicadas o no consumidas). |
| `remove` | Candidato a retirar o internalizar. |

## 6. Matriz completa de endpoints

`*`: acceso sujeto a una condición adicional de recurso o dependencia.

| Grupo | Método | Endpoint | Acceso | Política | Roles | Alcance | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| auditoria | POST | `/api/auditoria/search` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| auditoria | POST | `/api/auditoria/create` | Interna | `INTERNAL_REMOVE` | Ninguno | No externo | remove |
| auth | POST | `/api/auth/login` | Pública | `PUBLIC` | — | Público | active |
| auth | POST | `/api/auth/refresh-token` | Pública | `PUBLIC` | — | Público | active |
| auth | POST | `/api/auth/logout` | Pública | `PUBLIC` | — | Público | active |
| dashboard | GET | `/api/dashboard/resumen` | Protegida | `AUTHENTICATED` | SA/SUP/AD | Global | active |
| dependencia | GET | `/api/dependencia/datos/:id` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| dependencia | POST | `/api/dependencia/create` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| dependencia | POST | `/api/dependencia/edit` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| dependencia | GET | `/api/dependencia` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| dependencia | GET | `/api/dependencia/getDependencias` | Pública | `PUBLIC` | — | Público | active |
| dependencia | GET | `/api/dependencia/sesiones` | Protegida | `CONSEJO` | SA/SUP/AD* | Consejo Superior | active |
| dependencia | GET | `/api/dependencia/name` | Pública | `PUBLIC` | — | Público | active |
| dependencia | POST | `/api/dependencia/search` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| dependencia | DELETE | `/api/dependencia/eliminar/:id` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| emisores | GET | `/api/emisores/datos/:id` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| emisores | GET | `/api/emisores/name` | Pública | `PUBLIC` | — | Público | active |
| emisores | POST | `/api/emisores/edit` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| emisores | GET | `/api/emisores/getEmisores` | Pública | `PUBLIC` | — | Público | active |
| emisores | POST | `/api/emisores/create` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| emisores | POST | `/api/emisores/search` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| emisores | DELETE | `/api/emisores/eliminar/:id` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| file | GET | `/api/file/download` | Condicional | `PUBLIC_PUBLISHED` | SA/SUP/AD* | Publicado/recurso | active |
| file | POST | `/api/file/upload/:id` | Protegida | `RESOURCE_UPLOAD` | SA/SUP/AD* | Recurso destino | active |
| file | POST | `/api/file/upload` | Protegida | `RESOURCE_UPLOAD` | SA/SUP/AD* | Recurso destino | active |
| contacto | POST | `/api/contacto` | Pública | `PUBLIC` | — | Público | active |
| normativa | GET | `/api/normativa/datos/:id` | Condicional | `PUBLIC_PUBLISHED` | SA/SUP/AD* | Publicado/recurso | active |
| normativa | POST | `/api/normativa/edit` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| normativa | POST | `/api/normativa/create` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| normativa | GET | `/api/normativa/traer/:id` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| normativa | DELETE | `/api/normativa/eliminar/:id` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| normativa | POST | `/api/normativa/search` | Pública | `PUBLIC` | — | Público | active |
| normativa | POST | `/api/normativa/searchEliminadas` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| normativa | POST | `/api/normativa/searchDespublicadas` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| normativa | POST | `/api/normativa/publicar/:id` | Protegida | `PUBLISH_NORM` | SA/SUP | Propia/global | active |
| normativa | GET | `/api/normativa/yearNormativa` | Pública | `PUBLIC` | — | Público | active |
| normativa | GET | `/api/normativa/deleted` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| normativa | GET | `/api/normativa/mas-buscadas` | Pública | `PUBLIC` | — | Público | active |
| normativa | POST | `/api/normativa/restaurar/:id` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| relaciones | GET | `/api/relaciones/:id` | Condicional | `PUBLIC_PUBLISHED` | SA/SUP/AD* | Publicado/recurso | active |
| relaciones | GET | `/api/relaciones/complementaria/:id` | Condicional | `PUBLIC_PUBLISHED` | SA/SUP/AD* | Publicado/recurso | active |
| sesiones | DELETE | `/api/sesiones/eliminar/:id` | Protegida | `CONSEJO` | SA/SUP/AD* | Consejo Superior | active |
| sesiones | POST | `/api/sesiones/create` | Protegida | `CONSEJO` | SA/SUP/AD* | Consejo Superior | active |
| sesiones | GET | `/api/sesiones/:id` | Protegida | `CONSEJO` | SA/SUP/AD* | Consejo Superior | active |
| tag | DELETE | `/api/tag/eliminar/:id` | Protegida | `AUTHENTICATED` | SA/SUP/AD | Global | active |
| tag | GET | `/api/tag/datos/:id` | Protegida | `AUTHENTICATED` | SA/SUP/AD | Global | active |
| tag | GET | `/api/tag/tags` | Pública | `PUBLIC` | — | Público | active |
| tag | POST | `/api/tag/edit` | Protegida | `AUTHENTICATED` | SA/SUP/AD | Global | active |
| tag | POST | `/api/tag/create` | Protegida | `AUTHENTICATED` | SA/SUP/AD | Global | active |
| tag | GET | `/api/tag/tags/:id` | Condicional | `PUBLIC_PUBLISHED` | SA/SUP/AD* | Publicado/recurso | active |
| tag | POST | `/api/tag/tags/normativa/:id` | Protegida | `NORM_ADMIN` | SA/SUP/AD | Propia/global | active |
| tag | POST | `/api/tag/search` | Protegida | `AUTHENTICATED` | SA/SUP/AD | Global | active |
| tipo_normativa | GET | `/api/tipo_normativa/name` | Pública | `PUBLIC` | — | Público | active |
| usuarios | POST | `/api/usuarios/cambiar-estado` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| usuarios | POST | `/api/usuarios/create` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| usuarios | POST | `/api/usuarios/edit` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| usuarios | GET | `/api/usuarios` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| usuarios | GET | `/api/usuarios/:id` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| usuarios | GET | `/api/usuarios/datos/:id` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| usuarios | POST | `/api/usuarios` | Protegida | `SUPER_ADMIN` | SA | Global | legacy |
| usuarios | DELETE | `/api/usuarios/eliminar/:id` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| usuarios | PUT | `/api/usuarios/:id` | Protegida | `SUPER_ADMIN` | SA | Global | legacy |
| usuarios | GET | `/api/usuarios/filter/:id` | Protegida | `SUPER_ADMIN` | SA | Global | active |
| usuarios | POST | `/api/usuarios/userEmail` | Interna | `INTERNAL_REMOVE` | Ninguno | No externo | remove |
| usuarios | POST | `/api/usuarios/search` | Protegida | `SUPER_ADMIN` | SA | Global | active |

## 7. Fuentes y Validaciones

### Definiciones

- `Backend/security/roles.js`
- `Backend/security/policies.js`
- `Backend/security/accessMatrix.js`

### Pruebas

- `Backend/tests/security/accessMatrix.definition.test.js`
- `Backend/tests/security/accessMatrix.integrity.test.js`
- `Backend/tests/security/accessMatrix.routes.test.js`

### Ejecución

```bash
cd Backend
npm test
```

### Resultado

```text
Test Suites: 3 passed, 3 total
Tests:       31 passed, 31 total
```
