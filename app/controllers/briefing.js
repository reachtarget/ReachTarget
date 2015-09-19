module.exports = function(app) {
	var Briefing = app.models.briefing;

	var controller = {};

	controller.salvar = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			Briefing.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (resultado) {
						res.json(resultado);
					},
					function (error) {
						console.log(error);
					});
		} else {
			Briefing.create(req.body)
				.then(
					function (briefing) {
						res.status(201).json(briefing);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.briefingPorLogin = function(req, res) {
		Briefing
			.findOne({ 
				objectIdLogin: req.params.objectIdLogin
			})
			.exec()
			.then(
				function (campanha) {
					res.json(campanha);
				},
				function (error) {
					console.log(error);
				});
	};

	controller.briefingPorLoginEOferta = function(req, res) {
		Briefing
			.findOne({ 

				objectIdLogin: req.params.objectIdLogin,
				objectIdCampanha: req.params.objectIdCampanha

			})
			.exec()
			.then(
				function (campanha) {
					res.json(campanha);
				},
				function (error) {
					console.log(error);
				});
	};


	return controller;
}