"use strict";
const request = require('request-promise')
const SYNC_HEAD_URL = 'https://sync.paybook.com/v1'
const Sync = require('./sync');

exports.auth = function auth(AUTH, id_user) {
    return new Promise(async function (resolve,reject) {
        try {
            let authentication = await Sync.run(AUTH, '/sessions', id_user, 'POST')
            if('token' in authentication) {
                let response = {};
                response['token'] = authentication.token;
                resolve(response);
            } else {
                reject(authentication);
            }   
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

exports.run = function run(AUTH, route, payload, method) {
    return new Promise(async function(resolve, reject) {
        try {
            // BUILD URI
            let uri = `${SYNC_HEAD_URL}${route}`;
            // INIT OPTIONS
            let options = {
                url: uri,
                method: 'POST',
            }
            // SET HEADERS
            let headers = {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            };
            // CHECK AUTH TYPE
            let authKey = Object.keys(AUTH)[0];
            if(authKey === 'api_key') {
                headers['Authorization'] = `api_key api_key=${AUTH[authKey]}`
            }else if(authKey === 'token') {
                headers['Authorization'] = `TOKEN token=${AUTH[authKey]}`
            }
            // ASSIGN HTTP METHOD
            switch (method) {
                case 'GET':
                    headers['X-Http-Method-Override'] = 'GET';
                    options['body'] = JSON.stringify(payload);
                    break;
                case 'POST':
                    options['body'] = JSON.stringify(payload);
                    break;
                case 'DELETE':
                    headers['X-Http-Method-Override'] = 'DELETE';
                    break;
                case 'PUT':
                    headers['X-Http-Method-Override'] = 'PUT';
                    options['body'] = JSON.stringify(payload);
                    break;
            }
            options['headers'] = headers;
            // AWAIT RESPONSE 
            let result = await request(options);
            if(!result.startsWith('<?xml')) {
                result = JSON.parse(result);
                // RESOLVE RESPONSE
                let response = (Array.isArray(result.response) || typeof result.response !== "boolean") ? result.response : result;
                resolve(response); 
            }else {
                resolve(result);
            }
        } catch (error) {
            console.trace(error);
            reject(error)
        }
    });
}