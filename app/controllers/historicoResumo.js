module.exports = function(app) {
	var HistoricoResumo = app.models.historicoResumo;

	var controller = {};

	controller.salvar = function(req, res) {
		HistoricoResumo.create(req.body)
			.then(
				function (resultadoHistoricoResumo) {
					res.status(201).json(resultadoHistoricoResumo);
				},
				function (error) {
					console.log(error);
				});
	};

	controller.historicoResumoPorID = function(req, res) {
		HistoricoResumo
			.find({ 
				objectIdLogin: req.params.objectIdLogin
			})
			.exec()
			.then(
				function (resultadoHistoricoResumo) {
					res.json(resultadoHistoricoResumo);
				},
				function (error) {
					console.log(error);
				});
	};

	return controller;
};