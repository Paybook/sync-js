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
const prettyJs = require('pretty-js');
const Sync = require('../src/sync');
const APIKEY = {api_key: process.env.APIKEY};
const id_site = "5da784f1f9de2a06483abec1"  // SAT CIEC sandbox site
var id_user, id_credential;

const main = async () => {
    try {
        // List users
        let users = await Sync.run(
            APIKEY,
            '/users',
            {},
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
        let new_credential = await Sync.run(
            token,
            '/credentials',
            {
                id_site: id_site,
                credentials : {
                    "rfc" : "ACM010101ABC",
                    "password" : "test"
                }
            }
        );
        
        id_credential = new_credential.id_credential;
        let statusSocket = new_credential.ws;
        // 






        console.log('SAT CIEC FLOW UNIT TEST RUN:');
    } catch (error) {
        console.trace(error);
        process.exit();
    }
}

main();