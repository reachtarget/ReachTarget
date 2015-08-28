module.exports = function(app) {
	var Investimento = app.models.investimento;

	var controller = {};

	controller.salvarInvestimento = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			Investimento.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (resultadoInvestimento) {
						res.json(resultadoInvestimento);
					},
					function (error) {
						console.log(error);
					});

		} else {
			Investimento.create(req.body)
				.then(
					function (investimento) {
						res.status(201).json(investimento);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.consultarInvestimentoObjectIdVigencia = function(req, res, next) {
		Investimento
			.findOne({ 

				objectIdLogin: req.params.objectId,
				vigencia: req.params.vigencia,
				projetadoRealizado: req.params.projetadoRealizado

			})
			.exec()
			.then(
				function (resultadoInvestimento) {

					if (resultadoInvestimento) {
						res.json(resultadoInvestimento);
					}
					else {
						if (req.params.projetadoRealizado == 'P') {
							Investimento
								.findOne({ 

									objectIdLogin: req.params.objectId,
									vigenciaAuxiliar: { $lte: req.params.vigenciaAuxiliar },
									projetadoRealizado: req.params.projetadoRealizado

								})
								.sort({

									vigenciaAuxiliar: -1	

								})
								.exec()
								.then(
									function (resultado) {
										res.json(resultado);
									},
									function (error) {
										console.log(error);
								});	
						} else {
							res.json('');
						}
					}
				},
				function (error) {
					console.log(error);
				});		
	};

	controller.consultarInvestimentos = function(req, res) {
		Investimento
			.findOne({ 

				objectIdLogin: req.params.objectId,
				vigenciaAuxiliar: { $lte: req.params.vigenciaInicial },
				projetadoRealizado: req.params.projetadoRealizado

			})
			.sort({

				vigenciaAuxiliar: -1	
				
			})
			.exec()
			.then(
			function (resultadoUltimaVigencia) {
				Investimento
					.find({ 
						objectIdLogin: req.params.objectId,
						vigenciaAuxiliar: { 
							$gte: resultadoUltimaVigencia.vigenciaAuxiliar, 
							$lte: req.params.vigenciaFinal 
						},
						projetadoRealizado: req.params.projetadoRealizado
					})
					.sort({
						vigenciaAuxiliar: 1
					})
					.exec()
					.then(
						function (resultadoInvestimentos) {
							res.json(resultadoInvestimentos);
						},
						function (error) {
							console.log(error);
						});
			},
			function (error) {
				console.log(error);
			});
	};

	return controller;
}