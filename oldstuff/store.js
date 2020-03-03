var redux = require('redux');
var createStore = redux.createStore;
var combineReducers = redux.combineReducers;

var initialState = {
	user: {
		username: false,
		token: false,
	},
	catalogues: [], //array of catalogues (avaible sites)
	credentials: {
		submit: false, //the submitted credentials
		site:false, //the current site for credentials
		state: false, //store the sattus code for the credentials
		twofa: false, //Array with the twofa fields
	},
	credentialsSites:[],
	accounts:[],
	transactions:[],
};

var cataloguesReducer = function(state, action) {
    if (state === undefined) {
		return initialState.catalogues;
	}
	if (action.type === 'CATALOGUES_SET') {
		var newArray = action.catalogues.slice(0);
		return newArray;
	}
	return state;
};
var accountsReducer = function(state, action) {
    if (state === undefined) {
		return initialState.catalogues;
	}
	if (action.type === 'ACCOUNTS_SET') {
		var newArray = action.accounts.slice(0);
		return newArray;
	}
	return state;
};
var transactionsReducer = function(state, action) {
    if (state === undefined) {
		return initialState.catalogues;
	}
	if (action.type === 'TRANSACTIONS_SET') {
		var newArray = action.transactions.slice(0);
		return newArray;
	}
	return state;
};

var credentialsSitesReducer = function(state, action) {
    if (state === undefined) {
		return initialState.catalogues;
	}
	if (action.type === 'CREDENTIALS_SITES') {
		var newArray = action.credentials.slice(0);
		return newArray;
	}
	return state;
};

var credentialsReducer = function(state, action) {
    if (state === undefined) {
		return Object.assign({}, state, initialState.credentials);
	}
	if (action.type === 'CREDENTIALS_CLEAR') {
	    return Object.assign({}, state, {submit:false, site:false, state:false, twofa: false});
	}
	if (action.type === 'CREDENTIALS_SUBMIT') {
	    return Object.assign({}, state, {submit: action.credentials});
	}
	if (action.type === 'CREDENTIALS_STATE') {
	    return Object.assign({},state, {state: action.state});
	}
	if (action.type === 'CREDENTIALS_SITE') {
	    return Object.assign({}, state, {site: action.site});
	}
	if (action.type === 'CREDENTIALS_TWOFA') {
	    return Object.assign({}, state, {twofa: action.twofa});
	}
	return state;
};



var userReducer = function(state, action) {
    if (state === undefined || action.type === 'USER_LOGOUT' ) {
		return Object.assign({}, state, initialState.user);
	}
	if (action.type === 'USER_LOGIN') {
	    return Object.assign({}, state, {username:action.username, token: action.token});
	}
	return state;
};


var reducers = combineReducers({
  catalogues: cataloguesReducer,
  credentials: credentialsReducer,
  user: userReducer,
  credentialsSites: credentialsSitesReducer,
  accounts: accountsReducer,
  transactions: transactionsReducer
});

store = createStore(reducers, initialState);

module.exports = store;