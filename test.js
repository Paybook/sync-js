var paybook = require('./index.js');

paybook.setApiKey("b7e57daf2b782bee22f05e38a1823c3a");
paybook.setTest(true);
var store = {
	id_user: false,
	users: [],
	token:false,
	site:false,
	credentials: false,
	newCredentials: false,
};
var deleteUsers = function(user_id){
	console.log("===deleteUsers");	
	store.users.forEach(function(user){
		if(user.name == "miguel719"){
			deleteUser(user.id_user);
		}
	});
}; 
var deleteUser = function(user_id){
	console.log("===deleteUser");
	paybook.deleteUser(user_id,function(err,resp){
		if(err){
			console.log("====deleteUser Error");
			console.log(err);
			return;
		}
		console.log(resp);
	});
};
var deleteSession = function(token){
	console.log("===deleteSession");
	paybook.deleteSession(token,function(err,resp){
		if(err){
			console.log("====deleteSession Error");
			console.log(err);
			return;
		}
		console.log(resp);
	});
};

var getCredentials = function() {
	console.log("===getCredentials");
	paybook.getCredentials(store.token, function(err,resp){
		if(err){
			console.log("====getCredentials Error");
			console.log(err);
			return;
		}
		console.log(resp);
		store.credentials = resp.response;
		deleteUsers();
		deleteSession(store.token);
	});
};

var setCredentials = function() {
	console.log("===setCredentials");
	var credentials = {};
	store.site.credentials.forEach(function(cred){
		credentials[cred.name] = "test";
	});
	console.log(credentials);
	paybook.credentials(store.token, store.site.id_site,credentials,function(err,resp){
		if(err){
			console.log("====setCredentials Error");
			console.log(err);
			return;
		}
		console.log(resp);
		store.newCredentials = resp;
		getCredentials();
		
	});
};

var getCatalogues = function() {
	console.log("===getCatalogues");
	paybook.getCatalogues(function(err,resp){
		if(err){
			console.log("====getCatalogues Error");
			console.log(err);
			return;
		}
		console.log(resp);
		var sites = resp.response;
		store.site = sites[0];
		console.log(store.site); 
		setCredentials();
	});
};

var validateSession = function(){
	console.log("===validateSession");
	paybook.validateSession(store.token,function(err,resp){
		if(err){
			console.log("====validateSession Error");
			console.log(err);
			return;
		}
		console.log(resp);
		getCatalogues();
		
	});
};

var createSession = function(){
	console.log("===createSession");
	paybook.createSession(store.id_user,function(err,resp){
		if(err){
			console.log("====createSession Error");
			console.log(err);
			return;
		}
		store.token = resp.token;
		validateSession();
		
	});
};

var getUsers = function() {
	console.log("===getUsers");
	paybook.getUsers(function(err,resp){
		if(err){
			console.log("====getUsers Error");
			console.log(err);
			return;
		}
		store.users = resp.response;
		createSession();

	});
};

var createUser = function(name, id_external){
	console.log("===createUser");
	paybook.createUser(name,id_external,function(err,resp){
		if(err){
			console.log("====createUser Error");
			console.log(err);
			return;
		}
		store.id_user = resp.id_user;
		getUsers();
	});
};


createUser("miguel719","miguel");
