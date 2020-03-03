# Ejemplos NodeJs



### Entorno

<table>
    <thead>
        <tr>
            <th>Base</th>
            <th>Nombre</th>
            <th>Versión</th>
            <th>Referencia</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Lenguaje / Entorno</td>
            <td>NodeJs</td>
            <td>10.15.3 LTS</td>
            <td><i>https://nodejs.org/</i></td>
        </tr>
        <tr>
            <td>Package Manager</td>
            <td>npm</td>
            <td>6.4.1</td>
            <td><i>https://www.npmjs.com/</i></td>
        </tr>
        <tr>
            <td>Librería HTTP Request</td>
            <td>request</td>
            <td>2.88.0</td>
            <td><i>https://www.npmjs.com/package/request</i></td>
        </tr>
    </tbody>
</table>



### Estructura de las Peticiones

Todas las peticiones se construyen de la siguiente forma:

<table>
    <thead>
        <tr>
            <th colspan="1">Elemento</th>
            <th colspan="5"></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>URL</b></td>
            <td colspan="4">El URL base para todos los recursos es <i>https://sync.paybook.com/v1/</i></td>
        </tr>
        <tr>
            <td><b>Autenticación</b></td>
            <td colspan="4">Usuarios y Sesiones:
                <i>Authorization: api_key api_key={API_KEY}, id_user={ID_USER}</i>
Otros Recursos:
                <i>Authorization: TOKEN token={TOKEN}</i></td>
        </tr>
        <tr>
            <td><b>Método</b></td>
            <td>POST</td>
            <td>GET</td>
            <td>PUT</td>
            <td>DELETE</td>
        </tr>
        <tr>
            <td><b>Media Type</b></td>
            <td><i>Content-Type: application/json</i></td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
        <tr>
            <td><b>Parámetros</b></td>
            <td>Payload Body</td>
            <td>Query String</td>
            <td>Query String</td>
            <td>Query String</td>
        </tr>
    </tbody>
</table>    

```bash
curl URL \
-H AUTH \
-X METHOD \
-H MEDIA_TYPE \
-d PARAMS \
```



### Ejemplos

<table>
    <thead>
        <tr>
            <th width="25%">Recurso</th>
          	<th width="25%">Acción</th>
            <th width="25%">Script</th>
          	<th width="25%">Options</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="4">Usuario</td>
          	<td>Creación</td>
            <td><i>examples/user/create.js</i></td>
          	<td>--api_key</td>
        </tr>
        <tr>
            <td>Listar</td>
            <td><i>examples/user/get.js</i></td>
          	<td>--api_key</td>
        </tr>
      	<tr>
            <td>Actualización</td>
            <td><i>examples/user/update.js</i></td>
          	<td>--api_key<br>--id_user</td>
        </tr>
        <tr>
          	<td>Eliminar</td>
            <td><i>examples/user/delete.js</i></td>
          	<td>--api_key<br>--id_user</td>
        </tr>
        <tr>
            <td rowspan="3">Session</td>
          	<td>Creación</td>
            <td><i>examples/session/create.js</i></td>
          	<td>--api_key<br>--id_user</td>
        </tr>
        <tr>
            <td>Validación</td>
            <td><i>examples/session/verify.js</i></td>
          	<td>--token</td>
        </tr>
      	<tr>
          	<td>Eliminar</td>
            <td><i>examples/session/delete.js</i></td>
          	<td>--token</td>
        </tr>
      	<tr>
            <td>Catalogo</td>
          	<td>Listar Sitios agrupados por Organización</td>
            <td><i>examples/catalogues/get_organizations_sites.js</i></td>
          <td>--token<br><i>--is_test</i></td>
        </tr>
        <tr>
          	<td rowspan="5">Credenciales</td>
            <td rowspan="2">Creación</td>
          	<td><a href="../widget/README.md">Widget</a>
          	<ul>
              	<li>Se recomienda hacer uso del Widget para cubrir éste caso de uso, ya que considera los escenarios listados a continuación:
                  <ul>
                    <li>Credenciales con Token</li>
                    <li>Credenciales sin autenticación de dos factores</li>
                    <li>Credenciales con Captcha (ó QRCode)</li>
                    <li>Credenciales con Selección Múltiples de Imágenes</li>
                    <li>Credenciales con Selección Múltiple de Texto</li>
                  </ul>
              	</li>
             </ul>
          	</td>
          	<td></td>
        </tr>
      	<tr>
          	<td><i>examples/create_credentials.js</i>
              	<ul>
                  <li>Simula los Escenarios de Twofa</li>
              	</ul>
          	</td>
          	<td>--token<br>--id_site<br>--credentials</td>
        </tr>
      	<tr>
            <td>Obtener Credenciales</td>
            <td><i>examples/credential/get.js</i></td>
          	<td>--token</td>
        </tr>
      	<tr>
            <td>Actualizar Credencial</td>
            <td><i>examples/credential/update.js</i></td>
          	<td>--token<br>--id_credential</td>
        </tr>
      	<tr>
            <td>Eliminar Credencial</td>
            <td><i>examples/credential/delete.js</i></td>
          	<td>--token<br>--id_credential</td>
        </tr>
        <tr>
            <td>Cuenta</td>
          	<td>Listado</td>
            <td><i>examples/get_accounts.js</i></td>
          	<td>--token<br>--id_credential</td>
        </tr>
        <tr>
          	<td>Transacción</td>
            <td>Listado</td>
            <td><i>examples/get_transactions.js</i></td>
          	<td>--token<br>--id_credential<br>--id_account</td>
        </tr>
        <tr>
           	<td rowspan="2">Archivo Adjunto</td>
            <td>Listado</td>
            <td><i>examples/get_attachments.js</i>
          		<ul>
                  <li>Obtener el listado de archivos adjuntos disponibles para descarga</li>
               </ul>
          	</td>
          	<td>--token<br>--id_credential<br>--id_account</td>
        </tr>
      	<tr>
            <td>Descarga</td>
            <td><i>examples/download_attachments.js</i>
              <ul>
                  <li>Descargar un archivo adjunto seleccionado</li>
               </ul>
              </td>
          	<td>--token<br>--id_attachment</td>
        </tr>
    </tbody>
</table>




### Pruebas

**IMPORTANTE.** Ya sea que las pruebas se realicen con una máquina virtual o no, te recomiendo ampliamente que bajo ninguna circunstancia almacenes el API KEY en un archivo de texto plano, en los ejemplos mostrados se accede al API KEY mediante la lectura de Variables de Entorno, y te aconsejo que definas ésta variable cada que comiences una sesión de trabajo.



Si tienes instalado Docker, puedes probar los scripts de la siguiente manera:

#### Instalación de dependencias

```bash
docker run \
--name sync-node \
-it \
--rm \
-v "$PWD":/usr/src/app \
-w /usr/src/app \
node:10.15.3-alpine npm install
```



#### Ejecución de scripts

```bash
docker run \
--name sync-node \
-it \
--rm \
-v "$PWD":/usr/src/app \
-w /usr/src/app \
node:10.15.3-alpine node examples/{resource}/{action}.js [options]
```
