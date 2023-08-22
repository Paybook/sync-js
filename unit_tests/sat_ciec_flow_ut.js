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

function sleep(ms){
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
        let connect = async (url) => {
            const client = new WebSocketClient();
            const promise = new Promise((resolve, reject) => {
                client.on('connectFailed', error => reject(error));
                client.on('connect', connection => resolve(connection));
            });
            client.connect(url);
            return promise;
        }
        await sleep(100); // Sleep to ensure always find the job
        console.log("Create Socket:", statusWsUrl);
        let connection = await connect(statusWsUrl);
        const message = async () => {
            return new Promise((resolve, reject) => {
                connection.on('message', message => {
                    let code = JSON.parse(message.utf8Data).code;
                    console.log("Received: '" + code + "'");
                    if(code >= 200 && code < 300) {
                        connection.close();
                        resolve();
                    }
                });
            });
        }
        // Await to websocket connection finish
        await message();
        // Tolerance time to sleep while transactions are ready
        await sleep(19999); 
        console.log('List all transactions');
        // List Transactions
        let transactions = await Sync.run(
            token,
            '/transactions',
            {
                id_credential: id_credential,
                limit: 10,
                has_attachment: 1
            },
            'GET'
        );
        if(transactions) console.log(transactions[0]);
        
        // Get Attachments
        for (let transaction of transactions) {
            let attachment = transaction.attachments[0];
            let id_attachment = attachment.id_attachment;
            let attachment_url = attachment.url;
            let attachmentXML = await Sync.run(
                token,
                attachment_url,
                null,
                'GET'
            );
            if(attachmentXML) console.log('Attachment ok for:', id_attachment, attachmentXML.substring(0,18));
        }
        
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
        // Delete user if error
        if (error instanceof SyntaxError) {
            process.exit(0);
        }
        if(id_user) {
            console.log('-----------X_X--------');
            console.log('OnError: User elimination action running...');
            let response = await Sync.run(
                APIKEY,
                `/users/${id_user}`,
                null,
                'DELETE'
            );
        }
        process.exit();
    }
}

main();