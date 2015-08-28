module.exports = function(app) {
	var ComplementoLogin = app.models.complementoLogin;

	var controller = {};

	controller.salvar = function(req, res) {
		ComplementoLogin.create(req.body)
			.then(
				function (login) {
					res.status(201).json(login);
				},
				function (error) {
					console.log(error);
				});
	};

	controller.complementoLoginPorID = function(req, res) {
		ComplementoLogin
			.findOne({ 
				objectIdLogin: req.params.objectIdLogin
			})
			.exec()
			.then(
				function (complementoLogin) {
					res.json(complementoLogin);
				},
				function (error) {
					console.log(error);
				});
	};

	return controller;
}