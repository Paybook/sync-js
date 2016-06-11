//                     dP     dP   oo                            
//                     88     88                                 
// .d8888b. .d8888b. d8888P d8888P dP 88d888b. .d8888b. .d8888b. 
// Y8ooooo. 88ooood8   88     88   88 88'  `88 88'  `88 Y8ooooo. 
//       88 88.  ...   88     88   88 88    88 88.  .88       88 
// `88888P' `88888P'   dP     dP   dP dP    dP `8888P88 `88888P' 
//                                                  .88          
//                                              d8888P           

var request = require('superagent');
var api = {};
api.apiKey = false;
api.baseUri = "https://sync.paybook.com/v1";
api.is_test = false;


// dP                dP                                     
// 88                88                                     
// 88d888b. .d8888b. 88 88d888b. .d8888b. 88d888b. .d8888b. 
// 88'  `88 88ooood8 88 88'  `88 88ooood8 88'  `88 Y8ooooo. 
// 88    88 88.  ... 88 88.  .88 88.  ... 88             88 
// dP    dP `88888P' dP 88Y888P' `88888P' dP       `88888P' 
//                      88                                  
//                      dP                                  


var handleError = function(error) {
	console.log("======ERROR");
	//console.log(error);
	if(error.response){
		//console.log(error.response.body);
		return error.response.body;
	}
	else{
		console.log(error);
		return error;
	}
	
};

var handleResponse = function(response) {
	return response;
};

var apiPost = function(url, data, response, external) {
	data.api_key = api.apiKey;

	if(external === true){
		dataUrl = url;
	}
	else{
		dataUrl = api.baseUri+url;
	}

	request
	.post(dataUrl)
	.type('json')
	.send(data)
	.set('Content-Type', '')
	.set('Accept', 'application/json')
	.end(function(err, res){
			if(err){
				if(response){response(handleError(err),undefined);}
				else{ handleError(err);}
				return;
			}
	   
			//console.log("==BODY POST");
			//console.log(res.body.response);
			response(undefined,res.body.response);
	});
};

var apiDelete = function(url, data, response) {
	data.api_key = api.apiKey;
	request
	.del(api.baseUri+url)
	.query(data)
	.set('Accept', 'application/json')
	.end(function(err, res){
			if(err){
				response(handleError(err),undefined);
				return;
			}
	   
			console.log("==BODY DEL");
			console.log(res.body);
			response(undefined,res.body);
	});
};

var apiGet = function(url, data, response) {
	data.api_key = api.apiKey;
	data.is_test = api.is_test;
	request
	.get(api.baseUri+url)
	.query(data)
	.set('Accept', 'application/json')
	.end(function(err, res){
			
			if(err){
				response(handleError(err),undefined);
				return;
			}
	   
			console.log("==BODY GET");
			console.log(res.body);
			response(undefined,res.body);
	});
};




//                   oo 
					 
// .d8888b. 88d888b. dP 
// 88'  `88 88'  `88 88 
// 88.  .88 88.  .88 88 
// `88888P8 88Y888P' dP 
//          88          
//          dP          

api.setApiKey = function(apiKey){
	this.apiKey = apiKey;
};
api.setTest = function(state){
	this.is_test = state;
};



//=====================USER
api.createUser = function(name, id_external, response){
	var data = {
		name: name,
		id_external: id_external
	};
	apiPost("/users", data, response);
};
api.getUsers = function(options, response){
	apiGet("/users", {}, response);
};

api.deleteUser = function(id_user, response){
	var data = {
		id_user: id_user,
	};
	apiDelete("/users"+"/"+id_user, data, response);
};


//=====================SESSION
api.createSession = function(id_user, response){
	apiPost("/sessions", {id_user:id_user}, response);
};
api.login = api.createSession;

api.verifySession = function(token, response){
	apiGet("/sessions/"+token+"/verify", {}, response);
};
api.deleteSession = function(token, response){
	apiDelete("/sessions/"+token, {}, response);
};

api.signup = function(name,  response){
	apiPost("/users", {name:name}, response);
};


//=====================CREDENTIALS
api.credentials = function(token,id_site, credentials, response){
	var data = {
			token: token,
			id_site: id_site,
			credentials: credentials
	};
	apiPost("/credentials", data, response);
};

api.submitTwofa = function(url, token, id_site, twofa, response){
	var data = {
			token: token,
			id_site: id_site,
			twofa: twofa
	};
	console.log(data);
	apiPost(url, data, response, true);
};

api.getCredentials = function(token, response){
	apiGet("/credentials", {token: token}, response);
};
api.deleteCredentials = function(token, id_credentials, response){
	apiDelete("/credentials/"+id_credentials, {}, response);
};


//=====================ACCOUNTS
api.getAccounts = function(token, options, response){
	var data = {
		token: token
	};
	for(var prop in options){
		data[prop] = options[prop];
	}
	apiGet("/accounts", data, response);
};
//=====================TRANSACTIONS
api.getTransactions = function(token, options, response){
	var data = {
		token: token
	};
	for(var prop in options){
		data[prop] = options[prop];
	}
	apiGet("/transactions", data, response);
};
api.getTransactionsCount = function(token, options, response){
	var data = {
		token: token
	};
	for(var prop in options){
		data[prop] = options[prop];
	}
	apiGet("/transactions/count", data, response);
};

//=====================ATTACHMENT
api.getAttahcments = function(token, options, response){
	var data = {
		token: token
	};
	for(var prop in options){
		data[prop] = options[prop];
	}
	apiGet("/attachments", data, response);
};
api.getAttahcmentsCount = function(token, options, response){
	var data = {
		token: token
	};
	for(var prop in options){
		data[prop] = options[prop];
	}
	apiGet("/attachments/counts", data, response);
};

api.getAttahcment = function(token, id_attachment, response){
	var data = {
		token: token,
	};
	apiGet("/attachments/"+id_attachment, data, response);
};
api.getAttahcmentExtra = function(token, id_attachment, response){
	var data = {
		token: token,
	};
	apiGet("/attachments/"+id_attachment+"/extra", data, response);
};


//=====================CATALOGS
api.cataloguesAccountTypes = function(token, response){
	apiGet("/catalogues/account_types", {token: token}, response);
};
api.cataloguesAttachmentTypes = function(token, response){
	apiGet("/catalogues/attachment_types", {token: token}, response);
};
api.cataloguesAccountCountries = function(token, response){
	apiGet("/catalogues/countries", {token: token}, response);
};
api.cataloguesSites = function(token, response){
	apiGet("/catalogues/sites", {token: token}, response);
};
api.cataloguesSiteOrganizations = function(token, response){
	apiGet("/catalogues/site_organizations", {token: token}, response);
};

module.exports = api;