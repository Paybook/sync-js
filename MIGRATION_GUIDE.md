# Guía de Migración a 2.0.0

## Introducción

En la versión `1.1.0`, hemos realizado un cambio significativo en la función `run`, que ahora devuelve la respuesta completa de la API, incluyendo el `rid`, `code`, `status`, y otros metadatos. Anteriormente, esta función solo devolvía el campo `response`, lo que limitaba la información disponible para los desarrolladores. Este cambio mejora la flexibilidad y transparencia en las respuestas de la API.

Esta guía proporciona instrucciones para migrar a la nueva versión y asegura que la transición sea lo más fluida posible.

## Cambios Principales

### 1. **Cambios en la función `run`**

#### Antes (v1.0.5)
En la versión anterior, la función `run` solo devolvía el contenido del campo `response`, como en el ejemplo siguiente:

```json
{
    "id_credential": "5ff5a6ec804fa4566c5c5fe5",
    "id_job_uuid": "5ff5a6ecc1b77b0683239143",
    "id_job": "5ff5a6ecc1b77b0683239142",
    "is_new": 1,
    "username": "A**********A",
    "ws": "wss://sync.paybook.com//v1/status/5ff5a6ecc1b77b0683239142",
    "status": "https://sync.paybook.com/v1/jobs/5ff5a6ecc1b77b0683239142/status",
    "twofa": "https://sync.paybook.com/v1/jobs/5ff5a6ecc1b77b0683239142/twofa"
}
```

#### Después (v2.0.0)
A partir de la versión `1.1.0`, la función `run` ahora devuelve el objeto completo de la respuesta de la API, incluyendo `rid`, `code`, `status`, y otros metadatos:

```json
{
    "rid": "81ee5ac7-7224-41f6-8e9f-4a350d2cefff",
    "code": 200,
    "errors": null,
    "status": true,
    "message": null,
    "response": {
        "id_credential": "5ff5a6ec804fa4566c5c5fe5",
        "id_job_uuid": "5ff5a6ecc1b77b0683239143",
        "id_job": "5ff5a6ecc1b77b0683239142",
        "is_new": 1,
        "username": "A**********A",
        "ws": "wss://sync.paybook.com//v1/status/5ff5a6ecc1b77b0683239142",
        "status": "https://sync.paybook.com/v1/jobs/5ff5a6ecc1b77b0683239142/status",
        "twofa": "https://sync.paybook.com/v1/jobs/5ff5a6ecc1b77b0683239142/twofa"
    }
}
```

## Instrucciones para la Migración
### 1. Verificar el código que depende de la función `run`
Si tu implementación actual depende de acceder directamente a los datos del campo response (por ejemplo, `id_credential`, `id_job`, etc.), deberás ajustar el código para acceder a esos datos dentro de la nueva estructura de respuesta.
Ejemplo:
#### Ejemplo:
#### Antes (v1.0.5):
```javascript
let jobId = await run(AUTH, '/jobs', payload, 'POST');
console.log(jobId.id_job); // Acceso directo a `id_job`
```

#### Después (v2.0.0):
```javascript
let fullResponse = await run(AUTH, '/jobs', payload, 'POST');
console.log(fullResponse.response.id_job); // Acceso desde `response`
```

### 2. Manejar la nueva estructura de respuesta
La nueva respuesta incluye los siguientes campos adicionales que podrías utilizar para un manejo más detallado:

* `rid`: Un identificador único de la solicitud.
* `code`: El código de estado HTTP de la respuesta.
* `errors`: Errores (si los hay).
* `status`: El estado de éxito de la operación (booleano).
* `message`: Un mensaje de estado adicional, si es necesario.
Asegúrate de manejar correctamente estos campos según tus necesidades.

## Beneficios del Cambio
Este cambio permite:
* Mejorar la transparencia sobre el estado de las solicitudes a la API.
* Facilitar la depuración y el seguimiento de errores mediante el rid y los códigos de respuesta.
* Proporcionar más flexibilidad al acceder a metadatos relevantes en cada respuesta.