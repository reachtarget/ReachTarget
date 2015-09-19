module.exports = function(app) {
	var ComplementoLogin = app.models.complementoLogin;

	var controller = {};

	controller.salvar = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			ComplementoLogin.findByIdAndUpdate(_id, req.body)
				.exec()	
				.then(
					function (resultado) {
						res.json(resultado);
					},
					function (error) {
						console.log(error);
					});
		} else {
			ComplementoLogin.create(req.body)
				.then(
					function (complementoLogin) {
						res.status(201).json(complementoLogin);
					},
					function (error) {
						console.log(error);
					});
		}
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