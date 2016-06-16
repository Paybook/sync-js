# Paybook

Isomorphic JS, integrated with redux to work with [Paybook](https://www.paybook.com) API

# Install
Install the dependencies
```
npm install paybook
```
# Server

### Import paybook and set the apikey
First you need to import paybook and set the api key.
```js
var pb = require("paybook");
pb.api.setApiKey("YOUR_API_KEY_HERE");
// You can set the test paybook enviroment to use dummy banks
pb.api.setTest(true); 
```
### Use API method
Each method has a callback as last argument, the first parameter in these function is an error, and the second is the api response, this response is the same as the one listend in the [Paybook Sync Rest API](https://www.paybook.com/sync/docs).
````js
pb.api.createUser("myUserNam","externalId",function(err,resp){
		if(err){
			console.log(err); 
			return;
		}
		console.log(resp);
});
````
# API methods list
This the list of api methods to simplify the use of the [Paybook Sync Rest API](https://www.paybook.com/sync/docs).


## Users

| Action         | REST API ENDPOINT                                 | SDK METHOD                                 |
| -------------- | ---------------------------------------- | ------------------------------------ |
| Creates a user | POST https://sync.paybook.com/v1/users   | ```createUser(userName, external_id, callback)```          |
| Deletes a user | DELETE https://sync.paybook.com/v1/users | ```deleteUser(id_user,callback)```|
| Get users      | GET https://sync.paybook.com/v1/users    | ```getUsers(options, callback)```|


## Sessions

| Action         | REST API ENDPOINT                                 | SDK METHOD                                  |
| -------------- | ---------------------------------------- | ------------------------------------ |
| Creates a session | POST https://sync.paybook.com/v1/sessions   | ```createSession(id_user, callback)```          |
| Verify a session | GET https://sync.paybook.com/v1/sessions/:token/verify | ```verifySession(session, callback)```                  |
| Deletes a session     | DELETE https://sync.paybook.com/v1/sessions/:token    | ```deleteSession(session, callback)```|

## Catalogues

| Action         | REST API ENDPOINT                                 | SDK METHOD                                  |
| -------------- | ---------------------------------------- | ------------------------------------ |
| Request account types | GET https://sync.paybook.com/v1/catalogues/account_types   | ```cataloguesAccountTypes(session,callback)```          |
| Request attachment types | GET https://sync.paybook.com/v1/catalogues/attachment_types   | ```cataloguesAttachmentTypes(session,callback)```          |
| Request available countries | GET https://sync.paybook.com/v1/catalogues/countries   | ```cataloguesAccountCountries(session,callback)```          |
| Request available sites | GET https://sync.paybook.com/v1/catalogues/sites   | ```cataloguesSites(session,callback)```          | 
| Request site organizations | GET https://sync.paybook.com/v1/catalogues/site_organizations   | ```cataloguesSiteOrganizations(session,callback)```          |

## Credentials

| Action         | REST API ENDPOINT                                 | SDK METHOD                                  |
| -------------- | ---------------------------------------- | ------------------------------------ |
| Creates or updates credentials | POST https://sync.paybook.com/v1/credentials | ```credential(token,id_site,credentials_data, callback)```          |
| Deletes credentials | DELETE https://sync.paybook.com/v1/credentials/:id_credential | ```deleteCredentials(token, id_credential, callback)```          |
| Request register credentials | GET https://sync.paybook.com/v1/credentials | ```getCredendtials(session, callback)```          |

# Accounts

| Action         | REST API ENDPOINT                                 | SDK METHOD                                  |
| -------------- | ---------------------------------------- | ------------------------------------ |
| Requests accounts of a user | GET https://sync.paybook.com/v1/accounts | ```getAccounts(session,options,callback)```          |

# Transactions

| Action         | REST API ENDPOINT                                 | SDK METHOD                                  |
| -------------- | ---------------------------------------- | ------------------------------------ |
| Requests number of transactions | GET https://sync.paybook.com/v1/transactions/count | ```getTRansactionsCount(session, options, callback)```          |
| Requests transactions | GET https://sync.paybook.com/v1/transactions | ```getTransactions(session,options, callback)```          |

# Attachments

| Action         | REST API ENDPOINT                                 | SDK METHOD                                  |
| -------------- | ---------------------------------------- | ------------------------------------ |
| Requests attachments | GET https://sync.paybook.com/v1/attachments | ```getAttachments(session,options, callback)```          |
| Request an attachments | GET https://sync.paybook.com/v1/attachments/:id_attachment | ```getAttahcment(session,id_attachment, callback)```          |
| Request the extracted data from attachment | GET https://sync.paybook.com/v1/attachments/:id_attachment/extra | ```getAttachmentExtra(session,id_attachment, callback)```          |
| Request the number of attachments | GET https://sync.paybook.com/v1/attachments/counts | ```agetAttachmentCount(session,options, callback)```          |





