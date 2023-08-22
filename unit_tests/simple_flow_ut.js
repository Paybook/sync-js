/* 
* TEST: General tests of the local package:
* Simple credential flow
* SAT Credential flow
*/

"use strict";
require('dotenv').config();
const prettyJs = require('pretty-js');
const Sync = require('../src/sync');
const APIKEY = process.env.APIKEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const ID_SITE_NORMAL = "56cf5728784806f72b8b4568";

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

// LISTAR USUARIOS
async function getUsers(filter) {
    let users = await Sync.run({api_key: APIKEY}, '/users', filter, 'GET');
    return users;
}

// CREAR USUARIO
async function createUser(payload) {
    let user = await Sync.run({api_key: APIKEY}, '/users', payload, 'POST');
    return user;
}

// ACTUALIZAR USUARIO
async function updateUser(id_user, payload) {
    let user = Sync.run({api_key: APIKEY}, `/users/${id_user}`, payload, 'PUT');
    return user;
}

// ELIMINAR USUARIO
async function deleteUser(id_user) {
    let response = Sync.run({api_key: APIKEY}, `/users/${id_user}`, {}, 'DELETE');
    return response;
}

// CREAR SESION
async function createSession(id_user) {
    let session = Sync.auth({api_key: APIKEY}, {id_user: id_user});
    return session;
}

// VERIFICAR SESION
async function verifySession(token) {
    let session = Sync.run({}, `/sessions/${token}/verify`, {}, 'GET');
    return session;
}

// ELIMINAR SESION
async function deleteSession(token) {
    let response = Sync.run({}, `/sessions/${token}`, {}, 'DELETE');
    return response;
}

// CONSULTAR CATALOGO
async function getCatalogs(token, payload) {
    let catalog = await Sync.run({token: token}, '/catalogues/organizations/sites', payload, 'GET');
    return catalog;
}

// CREAR CREDENCIALES NORMALES
async function createCredentials(token, payload) {
    let normalCredentials = await Sync.run({token: token}, '/credentials', payload, 'POST');
    return normalCredentials;
}

// CONSULTA CREDENCIALES
async function getCredentials(token) {
    let resp = await Sync.run({token: token}, '/credentials', {}, 'GET');
    return resp;
}

// CONSULTA ESTADO DE CREDENCIALES
async function getCredentialsStatus(token, id_job) {
    let resp = await Sync.run({token: token}, `/jobs/${id_job}/status`, {token: token}, 'GET');
    return resp;
}

// ELIMINA CREDENCIALES
async function deleteCredential(token, id_credential) {
    let resp = await Sync.run({token: token}, `/credentials/${id_credential}`, {}, 'DELETE');
    return resp;
}
// CONSULTA CUENTAS
async function getAccounts(token, payload) {
    let accounts = Sync.run({token: token}, '/accounts', payload, 'GET');
    return accounts;
}

// CONSULTA TRANSACCIONES
async function getTransactions(token, payload) {
    let accounts = Sync.run({token: token}, '/transactions', payload, 'GET');
    return accounts;
}

// CONSULTA DOCUMENTOS LIGADOS A LA CUENTA
async function getAttachments(token, payload) {
    let attachments = Sync.run({token: token}, '/attachments', payload, 'GET');
    return attachments;
}

// DESCARGA DOCUMENTO
async function downloadAttachment(token, url) {
    let documentAttached = Sync.run({token: token}, url, {}, 'GET');
    return documentAttached;
}

// CREAR WEBHOOK
async function createWebhook(payload) {
    let resp = Sync.run({api_key: APIKEY}, '/webhooks', payload, 'POST');
    return resp;
}

// CONSULTAR WEBHOOKS
async function getWebhooks() {
    let resp = Sync.run({api_key: APIKEY}, '/webhooks', {}, 'GET');
    return resp;
}

// ELIMINAR WEBHOOK
async function deleteWebhook(id_webhook) {
    let resp = Sync.run({api_key: APIKEY}, `/webhooks/${id_webhook}`, {}, 'DELETE');
    return resp;
}

async function main() {
    try {
        // Consultar un usuario por id_externo
        console.log('-> Consulta usuario');
        let users = await getUsers({id_external: 'EOOA989602'});
        debug(users);
        // Crear un usuario nuevo
        console.log('-> Crea usuario');
        let newUser = await createUser({
            id_external: 'ORTO7890',
            name: 'Randy Ort'
        });
        debug(newUser);
        // Actualizar el ususario previamente creado
        console.log('-> Actualiza usuario');
        let id_user = newUser.id_user;
        newUser = await updateUser(id_user, {name: 'Randy Orton'});
        debug(newUser);
        // Crear una sesión para ese usuario
        console.log('-> Crea sesion');
        id_user = newUser.id_user;
        let session = await createSession(id_user);
        debug(session);
        // Verificar la sesión
        console.log('-> Verificar sesion');
        let token = session.token;
        let resp = await verifySession(token);
        debug(resp);
        // Consultar catalogos
        console.log('-> Consultar catalogo');
        let catalogs = await getCatalogs(token, { id_site: ID_SITE_NORMAL });
        debug(catalogs);
        // Crear credenciales normal
        console.log('-> Crear credeciales normales');
        let siteNormal = catalogs[0].sites[0];
        let payload = {}; 
        payload['id_site'] = siteNormal.id_site;
        let credentials = {};
        credentials[siteNormal.credentials[0].name] = 'test';
        credentials[siteNormal.credentials[1].name] = 'test';
        payload['credentials'] = credentials;
        let credenciales = await createCredentials(token, payload);
        debug(credenciales);
        let id_credentialNormal = credenciales.id_credential;
        await sleep(30000);
        // Consultar Credenciales normal
        console.log('-> Consulta credenciales normal');
        let checkCredentials = await getCredentials(token);
        debug(checkCredentials);
        // Consulta Status Credenciales normal
        console.log('-> Consulta Status de credenciales');
        let id_job = credenciales.id_job;
        let status = await getCredentialsStatus(token, id_job);
        debug(status);
        // Consultar cuentas normal
        console.log('-> Consulta cuentas normal');
        let accounts = await getAccounts(token, {id_credential: id_credentialNormal});
        //debug(accounts);
        // Consulta transacciones Normal
        console.log('-> Consulta transacciones Normal');
        let normalTranssactions = await getTransactions(token, {id_credential: id_credentialNormal, limit: 5});
        debug(normalTranssactions);
        // Eliminar Credenciales Normal
        console.log('-> Elimina credenciales normal');
        resp = await deleteCredential(token, id_credentialNormal)
        debug(resp);
        // Eliminar la sesión
        console.log('-> Elimina sesion');
        resp = await deleteSession(token);
        debug(resp);
        // Eliminar usuario
        console.log('-> Elimina usuario');
        resp = await deleteUser(id_user);
        debug(resp);
    } catch (error) {
        console.trace(error);
        process.exit();
    }
}

function debug(code) {
    let toPrint = prettyJs(JSON.stringify(code));
    if(toPrint === {}) { 
        console.error(code);
    }else{
        console.log(toPrint);
    }
}
main();