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
const WebSocketClient = require('websocket').client;
const prettyJs = require('pretty-js');
const Sync = require('../src/sync');
const APIKEY = {api_key: process.env.APIKEY};
const id_site = "5da784f1f9de2a06483abec1"  // SAT CIEC sandbox site
var id_user, id_credential;

const main = async () => {
    console.log('SAT CIEC FLOW UNIT TEST RUN:');
    try {
        // List users
        let users = await Sync.run(
            APIKEY,
            '/users',
            null,
            'GET'
        );
        
        // Create user
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
        let token = await Sync.auth(
            APIKEY,
            {id_user: id_user}
        );

        // Create SAT CIEC sandbox credential
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
        let client = new WebSocketClient();

        client.on('connectFailed', function(error) {
            console.log('Connect Error: ' + error.toString());
            throw error;
        });

        client.on('connect', function(connection) {
            console.log('WebSocket Client Connected');
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function() {
                console.log('Connection Closed');
            });
            connection.on('message', function(message) {
                console.log("Received: '" + message.utf8Data + "'");
            });
        });

        await client.connect(statusWsUrl);

        // Delete user
        let response = await Sync.run(
            APIKEY,
            `/users/${id_user}`,
            null,
            'DELETE'
        );
        console.log(`Response of /users/${id_user} via DELETE:`, response);
    } catch (error) {
        // console.trace(error.body || error);
        console.trace(error);
        // Delete user if error
        let response = await Sync.run(
            APIKEY,
            `/users/${id_user}`,
            null,
            'DELETE'
        );
        prettyJs(JSON.stringify(response));
        process.exit();
    }
}

main();