module.exports = function(app) {
	var Projecao = app.models.projecao;

	var controller = {};

	controller.salvarProjecao = function(req, res) {
		Projecao
			.findOne({ 
				objectIdLogin: req.body.objectIdLogin,
				metrica: req.body.metrica,
				vigencia: req.body.vigencia
			})
			.exec()
			.then(
				function (resultadoConsultaProjecao) {
					if (resultadoConsultaProjecao) {
						Projecao.findByIdAndUpdate(resultadoConsultaProjecao._id, req.body)
							.exec()
							.then(
								function (resultadoProjecao) {
									res.json(resultadoProjecao);
								},
								function (error) {
									console.log(error);
								});

					} else {
						Projecao.create(req.body)
							.then(
								function (projecao) {
									res.status(201).json(projecao);
								},
								function (error) {
									console.log(error);
								});
					}
				},
				function (error) {
					console.log(error);
				});	
	};

	controller.consultarProjecaoPorSemestre = function(req, res) {
		Projecao
			.find({ 
				objectIdLogin: req.params.objectId,
				vigencia: { 
					$gte: req.params.dataInicial, 
					$lte: req.params.dataFinal 
				}
			})
			.exec()
			.then(
				function (resultadoProjecao) {
					res.json(resultadoProjecao);
				},
				function (error) {
					console.log(error);
				});		
	};

	controller.consultarProjecaoPorSemestrePorMetrica = function(req, res) {
		Projecao
			.find({ 
				objectIdLogin: req.params.objectId,
				vigencia: { 
					$gte: req.params.dataInicial, 
					$lte: req.params.dataFinal 
				},
				metrica: req.params.metrica
			})
			.sort({
				vigencia: 1	
			})
			.exec()
			.then(
				function (resultadoProjecao) {
					res.json(resultadoProjecao);
				},
				function (error) {
					console.log(error);
				});		
	};	

	return controller;
}