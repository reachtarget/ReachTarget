
module.exports = function() {
	var _apiKey = "";
	var _clienteID = "";
	var _clientSecret = "";
	var _scopes = "https://www.googleapis.com/auth/analytics.readonly";
	var _redirectUri = "";

	definirVariaveis = function(tipo) {

		if (tipo == "H") { // Homologação

			_apiKey = "AIzaSyDUOhF8MLsDonJgYk9Q6vRWi9dyJd8pNEo";
			_clienteID = "863929293926-e0vpdck7kc9tgo3eoqgemrrdm5jludg9.apps.googleusercontent.com";
			_clientSecret = "eAoscMWb7lWWfeKIBwxko9lM";
			_redirectUri = "http://localhost:3000/oauth2callback";

		} else if (tipo == "M") { // MaaS
		
			_apiKey = "AIzaSyA5L6mZ0dHDEDLqNAghtbPbv-PJHNgQZpU";
			_clienteID = "863929293926-fejn11qs6o2nmlmu78asmtlog5ovjupq.apps.googleusercontent.com";
			_clientSecret = "i1pf3CSeD8fPClFqfsOH6SBl";
			_redirectUri = "http://app.marketingasaservice.com.br/oauth2callback";

		} else if (tipo == "S") { // Siteina

			_apiKey = "AIzaSyCAdyjjMHGNEjrYBsGSJ2i5Hds8ITWxy3Y";
			_clienteID = "863929293926-tphcv8l06anerpb3pp3j2l7qmpd3el7i.apps.googleusercontent.com";
			_clientSecret = "0tvPEJOtfB73Xx5wAZJb_tNS";
			_redirectUri = "https://app.siteina.com.br/oauth2callback";

		} else if (tipo == "R") { // ReachTarget

			_apiKey = "AIzaSyCaNF8bF-q_HtKcZRniQ6u5ErP1S0Ol-C0";
			_clienteID = "863929293926-e6jsrke6hh3olpps5b04a1a515lt8586.apps.googleusercontent.com";
			_clientSecret = "btSSS0N7x0dGgfYq1FDpQwM-";
			_redirectUri = "https://app.reachtarget.com.br/oauth2callback";

		}
	}
}