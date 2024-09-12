# Gu�a de Migraci�n a 2.0.0

## Introducci�n

En la versi�n `1.1.0`, hemos realizado un cambio significativo en la funci�n `run`, que ahora devuelve la respuesta completa de la API, incluyendo el `rid`, `code`, `status`, y otros metadatos. Anteriormente, esta funci�n solo devolv�a el campo `response`, lo que limitaba la informaci�n disponible para los desarrolladores. Este cambio mejora la flexibilidad y transparencia en las respuestas de la API.

Esta gu�a proporciona instrucciones para migrar a la nueva versi�n y asegura que la transici�n sea lo m�s fluida posible.

## Cambios Principales

### 1. **Cambios en la funci�n `run`**

#### Antes (v1.0.5)
En la versi�n anterior, la funci�n `run` solo devolv�a el contenido del campo `response`, como en el ejemplo siguiente:

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

#### Despu�s (v2.0.0)
A partir de la versi�n `1.1.0`, la funci�n `run` ahora devuelve el objeto completo de la respuesta de la API, incluyendo `rid`, `code`, `status`, y otros metadatos:

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

## Instrucciones para la Migraci�n
### 1. Verificar el c�digo que depende de la funci�n `run`
Si tu implementaci�n actual depende de acceder directamente a los datos del campo response (por ejemplo, `id_credential`, `id_job`, etc.), deber�s ajustar el c�digo para acceder a esos datos dentro de la nueva estructura de respuesta.
Ejemplo:
#### Ejemplo:
#### Antes (v1.0.5):
```javascript
let jobId = await run(AUTH, '/jobs', payload, 'POST');
console.log(jobId.id_job); // Acceso directo a `id_job`
```

#### Despu�s (v2.0.0):
```javascript
let fullResponse = await run(AUTH, '/jobs', payload, 'POST');
console.log(fullResponse.response.id_job); // Acceso desde `response`
```

### 2. Manejar la nueva estructura de respuesta
La nueva respuesta incluye los siguientes campos adicionales que podr�as utilizar para un manejo m�s detallado:

* `rid`: Un identificador �nico de la solicitud.
* `code`: El c�digo de estado HTTP de la respuesta.
* `errors`: Errores (si los hay).
* `status`: El estado de �xito de la operaci�n (booleano).
* `message`: Un mensaje de estado adicional, si es necesario.
Aseg�rate de manejar correctamente estos campos seg�n tus necesidades.

## Beneficios del Cambio
Este cambio permite:
* Mejorar la transparencia sobre el estado de las solicitudes a la API.
* Facilitar la depuraci�n y el seguimiento de errores mediante el rid y los c�digos de respuesta.
* Proporcionar m�s flexibilidad al acceder a metadatos relevantes en cada respuesta.