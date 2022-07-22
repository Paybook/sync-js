/* 
* Reqs:
    * Syncfy Sandbox API Key.
* Unit testing of the local package for:
* SAT CIEC Credential flow
    * List users
    * Create user
    * Create session token
    * Create SAT CIEC sandbox credential
    * Create credential status socket
    * List transactions
    * Get attachments
    * Delete credential
    * Delete user
*/

"use strict";
require('dotenv').config();
const wtf = require('wtfnode');
const WebSocketClient = require('websocket').client;
const prettyJs = require('pretty-js');
const Sync = require('../src/sync');
const APIKEY = {api_key: process.env.APIKEY};
const id_site = "5da784f1f9de2a06483abec1"  // SAT CIEC sandbox site
var id_user, id_credential;

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

const main = async () => {
    console.log('SAT CIEC FLOW UNIT TEST RUN:');
    try {
        // List users
        console.log('List users');
        let users = await Sync.run(
            APIKEY,
            '/users',
            null,
            'GET'
        );
        
        // Create user
        console.log('Create user');
        let new_user = await Sync.run(
            APIKEY,
            '/users',
            {
                name: "sat_ciec_unit_test",
                id_external: "ACM010101ABC"
            },
            'POST'
        );

        id_user = new_user.id_user;

        // Create session token
        console.log('Create session token');
        let token = await Sync.auth(
            APIKEY,
            {id_user: id_user}
        );

        // Create SAT CIEC sandbox credential
        console.log('Crete credential');
        let payload = {
            id_site: id_site,
            credentials : {
                "rfc" : "ACM010101ABC",
                "password" : "test"
            }
        };
        let new_credential = await Sync.run(
            token,
            '/credentials',
            payload,
            'POST'
        );
        id_credential = new_credential.id_credential;
        
        //  Create credential status websocket
        let statusWsUrl = new_credential.ws;
        console.log("Create Socket:", statusWsUrl);
        let connect = async (url) => {
            const client = new WebSocketClient();
            const promise = new Promise((resolve, reject) => {
                client.on('connectFailed', error => reject(error));
                client.on('connect', connection => resolve(connection));
            });
            client.connect(url);
            return promise;
        }
        let connection = await connect(statusWsUrl);
        sleep(100);
        const message = async () => {
            return new Promise((resolve, reject) => {
                connection.on('message', message => {
                    console.log("Received: '" + message.utf8Data + "'");
                    let code = JSON.parse(message.utf8Data).code;
                    if(code >= 200 && code < 300) {
                        connection.close();
                        resolve();
                    }
                });
            });
        }
        await message();
        
        // Delete user
        let response = await Sync.run(
            APIKEY,
            `/users/${id_user}`,
            null,
            'DELETE'
        );
        console.log(`Response of /users/${id_user} via DELETE:`, response);
        wtf.dump();
    } catch (error) {
        console.trace(error.error, error.options || error);
        //console.trace(error);
        // Delete user if error
        if(id_user) {
            let response = await Sync.run(
                APIKEY,
                `/users/${id_user}`,
                null,
                'DELETE'
            );
            prettyJs(JSON.stringify(response));
        }
        process.exit();
    }
}

main();