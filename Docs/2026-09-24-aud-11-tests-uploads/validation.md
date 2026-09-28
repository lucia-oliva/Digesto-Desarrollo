# Validation — Criterios de aceptación (AUD-11)

La feature se considera exitosa (y mergeable) cuando se cumplan todos los siguientes criterios:

1. Existe un test unitario que cubre `isPdfMagicBytes`: `%PDF-1.4 …` y `%PDF-` → `true`;
   texto, binario, buffer vacío, buffer de menos de 5 bytes y valor no-Buffer → `false`.
2. Existen tests de integración contra `POST /api/file/upload` y `POST /api/file/upload/:id`
   que usan el `fileMiddleware` real (sin mockearlo).
3. **PDF real** → aceptado (`201` en `/upload`, `200` en `/upload/:id`).
4. **`.txt` renombrado** a `.pdf` → rechazado con `415`.
5. **MIME falso** → un archivo que declara `application/pdf` pero cuyo contenido no es PDF
   es rechazado con `415`; y un PDF válido con `mimetype` distinto es aceptado (el mimetype
   no es criterio).
6. **Archivo vacío** → rechazado con `415`. Caso extra: `/upload` sin campo `file` → `400`.
7. **Demasiado grande** (> 10 MB) → rechazado con `413`, sin archivo residual.
8. **Usuario sin permiso** (dependencia distinta a la del recurso/destino) → `403`, sin
   archivo residual.
9. **Upload sin token** → `401`.
10. **Filename malicioso** → el archivo se guarda con nombre aleatorio (`crypto.randomUUID()`),
    nunca con `file.originalname`, y no se crea ningún archivo fuera de `FILES_ROOT`;
    un nombre sin extensión `.pdf` es rechazado con `415`.
11. No quedan archivos residuales en `archivos/` al finalizar la suite.
12. La suite completa queda en verde con `docker compose exec -T backend npm test`.
13. Documentación actualizada: `plan.md`, `requirements.md`, `validation.md`,
    `Constitucion/roadmap.md`, `README.md`, `contexto.md` y `Constitucion/techStack.md`.

## Archivos de test

- `Backend/tests/unit/pdfMagicBytes.test.js`
- `Backend/tests/integration/fileUpload.security.test.js`

## Verificación

```bash
docker compose exec -T backend npm test
```

Resultado: la suite existente (11 suites / 329 tests) más los casos nuevos,
todos en verde y sin archivos residuales en `archivos/`.

```text
Test Suites: 13 passed, 13 total
Tests:       350 passed, 350 total
Snapshots:   0 total
```

- Suites nuevas: `Backend/tests/unit/pdfMagicBytes.test.js` (8 tests) y
  `Backend/tests/integration/fileUpload.security.test.js` (13 tests) → 21 tests nuevos.
- Códigos HTTP observados en los 13 casos de integración: `201`, `200`, `415` (x4),
  `400`, `413`, `403` (x2), `401`, `201`, `415`; todos coinciden con lo esperado.
- Verificación de no-residuo dentro del contenedor:
  `find archivos -type f -newermt '-30 minutes'` → sin archivos nuevos.
