var pb = require("./index.js");

pb.api.setApiKey("b7e57daf2b782bee22f05e38a1823c3a");
pb.api.setTest(true);

var showStore = function(){
	console.log("=====SHOW STORE");
	console.log(store.getState());
};


var getTransactions = function() {
	console.log("======GET TRANSACTIONS");
	pb.action.getTransactions(function(err,res){
		if(err){
			console.log("===error catalogues");
			console.log(err);
		}
		console.log(res);
		showStore();
		
	});
};


var getAccounts = function() {
	console.log("======GET ACCOUNTS");
	pb.action.getAccounts(function(err,res){
		if(err){
			console.log("===error catalogues");
			console.log(err);
		}
		console.log(res);
		getTransactions();
		
	});
};


var getCredentials = function() {
	console.log("======GET CREDENTIALS");
	pb.action.getCredentials(function(err,res){
		if(err){
			console.log("===error catalogues");
			console.log(err);
		}
		console.log(res);
		getAccounts();
	});
};

var submitToken = function(){
	console.log("======SUBMIT TOKEN");
	var st = pb.store.getState();
	var fields = st.credentials.twofa;
	var twofa = {};
	fields.forEach(function(field){
		twofa[field.name] = "test";
	});

	pb.action.submitTwofa(twofa, function(err,res){
		if(err){
			console.log("===error submitToken");
			console.log(err);
		}
		console.log(res);

	});
};


var submitCredentialsToken = function() {
	console.log("======SUBMIT CREDENTIALS TOKEN");

	var sites = pb.store.getState().catalogues;
	pb.action.setSite(sites[1].id_site);

	var credentials = {};
	var st = pb.store.getState();
	st.credentials.site.credentials.forEach(function(cred){
		credentials[cred.name] = "test";
	});

	pb.action.submitCredentials(credentials, function(err,res){
		if(err){
			console.log("===error submitCredentialsToken");
			console.log(err);
		}
		console.log(res);
		getCredentials();
	}, function twofaCallback(){
		submitToken();
	});
};

var submitCredentialsNormal = function() {
	console.log("======SUBMIT CREDENTIALS NORMAL");

	var sites = pb.store.getState().catalogues;
	pb.action.setSite(sites[0].id_site);

	var credentials = {};
	var st = pb.store.getState();
	st.credentials.site.credentials.forEach(function(cred){
		credentials[cred.name] = "test";
	});

	pb.action.submitCredentials(credentials, function(err,res){
		if(err){
			console.log("===error submitCredentialsNormal");
			console.log(err);
		}
		console.log(res);
		submitCredentialsToken();
	});
};



var catalogues = function() {
	console.log("======CATALOGUES");
	pb.action.catalogues(function(err,res){
		if(err){
			console.log("===error catalogues");
			console.log(err);
		}
		console.log(res);
		submitCredentialsNormal();
		
	});
};

var login = function() {
	console.log("======LOGIN");
	pb.action.login("miguel719","miguel",function(err,res){
		if(err){
			console.log("===error login");
			console.log(err);
		}
		console.log(res);
		catalogues();
	});
};

var signup = function() {
	console.log("======SIGNUP");
	pb.action.signup("miguel719","miguel",function(err,res){
		if(err){
			console.log("===error signup");
			console.log(err);
		}
		console.log(res);
		login();
	});
};

signup();