var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

module.exports = function(app) {
	var Google = app.models.google;
	var controller = {};
	var oauth2Client = null;	

	controller.salvar = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			Google.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (resultadoInvestimento) {
						res.json(resultadoInvestimento);
					},
					function (error) {
						console.log(error);
					});
		}
		else {
			Google.create(req.body)
				.then(
					function (login) {
						res.status(201).json(login);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.excluir = function(req, res) {
		Google.findOneAndRemove({
			_id: req.params.id
		}, function(resultado){
		}, function(error){
		});
	};

	controller.retornarDadosGoogle = function(req, res) {
		Google
			.findOne({ 
				objectIdLogin: req.params.objectIdLogin,
				unbouncePageId: null,
				campaignId: null
			})
			.exec()
			.then(
				function (login) {
					res.json(login);
				},
				function (error) {
					console.log(error);
				});
	};

	controller.retornarDadosGooglePorUnbouncePageID = function(req, res) {
		Google
			.findOne({ 
				objectIdLogin: req.params.objectIdLogin,
				unbouncePageId: req.params.unbouncePageId 
			})
			.exec()
			.then(
				function (login) {
					res.json(login);
				},
				function (error) {
					console.log(error);
				});
	};

	controller.retornarDadosGooglePorIDCampaign = function(req, res) {
		Google
			.findOne({ 
				objectIdLogin: req.params.objectIdLogin,
				campaignId: req.params.campaignId 
			})
			.exec()
			.then(
				function (login) {
					res.json(login);
				},
				function (error) {
					console.log(error);
				});
	};


	controller.getToken = function(req, res) {
		popuparOauth2Client(req.headers.host);

		oauth2Client.getToken(req.params.code, function(err, tokens) {
			Google.create({
				objectIdLogin: req.params.objectIdLogin,
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token
			})
			.then();
		});
	};

	controller.refreshToken = function(req, res) {
		popuparOauth2Client(req.headers.host);

		oauth2Client.setCredentials({
  			access_token: req.params.accessToken,
  			refresh_token: req.params.refreshToken
		});

		oauth2Client.refreshAccessToken(function(err, tokens) {
			Google.findByIdAndUpdate(
				req.params.id, 
				{
					accessToken: tokens.access_token,
					refreshToken: tokens.refresh_token
				})
			.exec()
			.then(function (resultadoToken) {
				res.json(resultadoToken);
			},
			function (error) {
				console.log(error);
			});  
		});
	};

	popuparOauth2Client = function(host) {
		if (host == 'app.marketingasaservice.com.br') {

			oauth2Client = 
				new OAuth2('863929293926-fejn11qs6o2nmlmu78asmtlog5ovjupq.apps.googleusercontent.com', 'i1pf3CSeD8fPClFqfsOH6SBl', 'postmessage');

		} else if (host == 'app.siteina.com.br') {

			oauth2Client = 
				new OAuth2('863929293926-tphcv8l06anerpb3pp3j2l7qmpd3el7i.apps.googleusercontent.com', '0tvPEJOtfB73Xx5wAZJb_tNS', 'postmessage');

		} else if (host == 'app.reachtarget.com.br') {

			oauth2Client = 
				new OAuth2('863929293926-e6jsrke6hh3olpps5b04a1a515lt8586.apps.googleusercontent.com', 'btSSS0N7x0dGgfYq1FDpQwM', 'postmessage');

		} else if (host == 'homologacao.marketingasaservice.com.br') {

			oauth2Client = 
				new OAuth2('863929293926-mdjncleikusp23iukjip8c3cthb3lu1v.apps.googleusercontent.com', 'vPToXTnMnVGp1nW86RBGzvb6', 'postmessage');

		} else {

			oauth2Client = 
				new OAuth2('863929293926-e0vpdck7kc9tgo3eoqgemrrdm5jludg9.apps.googleusercontent.com', 'eAoscMWb7lWWfeKIBwxko9lM', 'postmessage');

		}
	};

	return controller;
}


