module.exports = function(app) {
	var Login = app.models.login;
	var controller = {};

	controller.salvar = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			Login.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (resLogin) {
						res.json(resLogin);
					},
					function (error) {
						console.log(error);
					});
		}
		else {
			Login.create(req.body)
				.then(
					function (login) {
						res.status(201).json(login);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.login = function(req, res) {
		Login
			.findOne({ 
				login: req.params.login
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

	controller.retornarLoginObjectIdLogin = function(req, res) {
		Login
			.findOne({ 
				_id: req.params.objectIdLogin 
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

	controller.retornarLoginSiteinaMaaS = function(req, res) {
		Login
			.find({ 
				status: 'A',
				tipo: req.params.tipo				
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

	controller.retornarLoginsInativos = function(req, res) {
		Login
			.find({ 
				status: 'I'
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

	controller.retornarLoginsBriefing = function(req, res) {
		Login
			.find({ 
				status: 'B'
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

	return controller;
}