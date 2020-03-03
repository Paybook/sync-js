var action = {};
var api = require("./api.js");
var store = require("./store.js");
var WebSocket = require('ws');

action.setTest = function(state, callback){
	api.setTest(state);
	action.catalogues(callback);
};

action.getAccounts = function(callback) {
	var st = store.getState();
	api.getAccounts(st.user.token,{}, function(err,resp){
		if(err){
			if(callback){ if(callback){ callback(err, undefined); } }
			return;
		}

		store.dispatch({
			type:"ACCOUNTS_SET",
			accounts: resp.response,
		});
		if(callback){ callback(undefined, resp.response); }
	});
};

action.getTransactions = function(callback) {
	var st = store.getState();
	api.getTransactions(st.user.token,{}, function(err,resp){
		if(err){
			if(callback){ if(callback){ callback(err, undefined); } }
			return;
		}

		store.dispatch({
			type:"TRANSACTIONS_SET",
			transactions: resp.response,
		});
		if(callback){ callback(undefined, resp.response); }
	});
};



action.submitTwofa = function(twofa, callback){
	var st = store.getState();

	api.submitTwofa(st.credentials.submit.twofa,st.user.token, st.credentials.site.id_site, twofa, function(err,resp){
		if(err){
			if(callback){ if(callback){ callback(err, undefined); } }
			return;
		}
		if(callback){ callback(undefined, resp); }
	});
};

action.waitForTwofa = function(twofa, callback) {
		store.dispatch({
			type:"CREDENTIALS_TWOFA",
			twofa: twofa,
		});
		if(callback){callback();}
};



action.checkCredentialsStatus = function(url, callback, twofaCallback) {
	var ws = new WebSocket(url);

	if(root.process){
		ws.on('message', function(data, flags) {
			data = JSON.parse(data);
			console.log("====code "+data.code);
			store.dispatch({
				type:"CREDENTIALS_STATE",
				state: data.code,
			});
			if(data.code >= 200 && data.code < 300){
				if(callback){callback(undefined, data.code);}
			}
			else if(data.code == 410) {
				action.waitForTwofa(data.twofa, twofaCallback);
			}
			else if(data.code >= 400){
				if(callback){callback(data.code, undefined);}
			}
		});
	}
	else{
		ws.onmessage = function(message, flags) {
			data = JSON.parse(message.data);
			console.log(data);
			console.log("====code "+data.code);
			store.dispatch({
				type:"CREDENTIALS_STATE",
				state: data.code,
			});
			if(data.code >= 200 && data.code < 300){
				if(callback){callback(undefined, data.code);}
			}
			else if(data.code == 410) {
				action.waitForTwofa(data.twofa, twofaCallback);
			}
			else if(data.code >= 400){
				if(callback){callback(data.code, undefined);}
			}
		};
	}
};


action.getCredentials = function(callback) {
	var st = store.getState();
	api.getCredentials(st.user.token, function(err,resp){
		if(err){
			if(callback){ if(callback){ callback(err, undefined); } }
			return;
		}

		store.dispatch({
			type:"CREDENTIALS_SITES",
			credentials: resp.response,
		});
		if(callback){ callback(undefined, resp.response); }
	});
};

action.submitCredentials = function(credentials, callback, twofaCallback) {
	var st = store.getState();
	api.credentials(st.user.token, st.credentials.site.id_site, credentials,function(err,resp){
		if(err){
			if(callback){ callback(err, undefined); }
			return;
		}

		store.dispatch({
			type:"CREDENTIALS_SUBMIT",
			credentials: resp,
		});
		action.checkCredentialsStatus(resp.ws, callback, twofaCallback );
	});
};

action.setSite = function(id_site) {
	var catalogues = store.getState().catalogues;
	var site = false;
	catalogues.forEach(function(s){
		if(s.id_site === id_site){
			site = s;
		}
	});
	store.dispatch({
		type:"CREDENTIALS_SITE",
		site: site,
	});

};

action.catalogues = function(callback) {
	var token = store.getState().user.toke;
	api.cataloguesSites(token, function(err,resp1){
			if(err){
				if(callback){ callback(err, undefined); }
				return;
			}
			api.cataloguesSiteOrganizations(token, function(err,resp2){
					if(err){
						if(callback){ callback(err, undefined); }
						return;
					}
					var sites = resp1.response;
					var sitesOrg = resp2.response;
					sites.forEach(function(site){
						sitesOrg.forEach(function(si){
							if(site.id_site_organization == si.id_site_organization) {
								site.avatar = si.avatar;
							}
						});
					});
					store.dispatch({
						type:"CATALOGUES_SET",
						catalogues: sites,
					});
					if(callback){callback(undefined, sites);}
			});
	});
};

action.signup = function(username, password, callback) {

	api.createUser(username,password,function(err,resp){
			if(err){
				if(callback){ callback(err, undefined); }
				return;
			}			
			if(callback){callback(undefined, resp);}
	});
};


action.login = function(username, password, callback) {

	api.getUsers({}, function(err,resp){
		if(err){
			if(callback){ callback(err, undefined); }
			return;
		}
		var users = resp.response;
		var user = false;
		users.forEach(function(us){
			if(us.name === username && us.id_external === password ) {
				user = us;
			}
		});
		if(user === false) {
			if(callback){ callback(err, undefined); } return;
		}

		api.createSession(user.id_user,function(err,resp){
			if(err){
				if(callback){ callback(err, undefined); }
				return;
			}
			store.dispatch({
				type:"USER_LOGIN",
				token:resp.token,
				username: username,
			});
			if(callback){callback(undefined, resp);}		
		});

	});
};

action.error = function(error, type) {

};

action.loading = function(state) {

};

module.exports = action;