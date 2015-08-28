var mcapi = require('mailchimp-api');

module.exports = function(app) {
	var MailChimp = app.models.mailchimp;

	var controller = {};
	
	controller.salvar = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			MailChimp.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (mc) {
						res.json(mc);
					},
					function (error) {
						console.log(error);
					});
		}
		else {
			MailChimp.create(req.body)
				.then(
					function (mc) {
						res.status(201).json(mc);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.retornarMailChimpPorIDLogin = function(req, res) {
		MailChimp
			.findOne({ 
				objectIdLogin: req.params.objectIdLogin
			})
			.exec()
			.then(
				function (mc) {
					res.json(mc);
				},
				function (error) {
					console.log(error);
				});
	};

	controller.retornarListas = function(req, res) {
		var _mailChimp = new mcapi.Mailchimp(req.params.apikey);

		_mailChimp.campaigns.list({
			limit: 999
		}, function(data){
			res.json(data.data);
		});
	};

	controller.retornarCampanhaPorID = function(req, res) {
		var _mailChimp = new mcapi.Mailchimp(req.params.apikey);

		_mailChimp.campaigns.list({
			filters: {
				campaign_id: req.params.cid
			}
		}, function(data){

			res.json(data.data);

		});
	};

	return controller;
}