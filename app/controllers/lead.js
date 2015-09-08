module.exports = function(app) {
	var Lead = app.models.lead;

	var controller = {};

	controller.salvarLead = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			Lead.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (resultadoLead) {
						res.json(resultadoLead);
					},
					function (error) {
						console.log(error);
					});

		} else {
			Lead.create(req.body)
				.then(
					function (lead) {
						res.status(201).json(lead);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.excluirLead = function(req, res) {
		Lead.findOneAndRemove({
			_id: req.params.id
		}, function(ok){
		}, function(error){
		});
	};

	controller.consultarLeadPorID = function(req, res) {
		Lead
			.findOne({ 
				objectIdLogin: req.params.objectId,
				_id: req.params.idLead
			})
			.exec()
			.then(
				function (resultadoLead) {
					res.json(resultadoLead);
				},
				function (error) {
					console.log(error);
				});
	};

	controller.consultarLeads = function(req, res) {
		Lead
			.find({ 
				objectIdLogin: req.params.objectId,
				data: { 
					$gte: req.params.dataInicial, 
					$lte: req.params.dataFinal 
				}
			})
			.exec()
			.then(
				function (resultadoLead) {
					res.json(resultadoLead);
				},
				function (error) {
					console.log(error);
				});
	};

	controller.consultarLeadsMaaS = function(req, res) {
		if (req.params.pagina != '-')
		{
			Lead
				.find({ 
					objectIdLogin: req.params.objectId,
					data: { 
						$gte: req.params.dataInicial, 
						$lte: req.params.dataFinal 
					},
					pagina: req.params.pagina
				})
				.exec()
				.then(
					function (resultadoLead) {
						res.json(resultadoLead);
					},
					function (error) {
						console.log(error);
					});

		} else {
			Lead
				.find({ 
					objectIdLogin: req.params.objectId,
					data: { 
						$gte: req.params.dataInicial, 
						$lte: req.params.dataFinal 
					}
				})
				.exec()
				.then(
					function (resultadoLead) {
						res.json(resultadoLead);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.consultarVendas = function(req, res) {
		Lead
			.find({ 
				objectIdLogin: req.params.objectId,
				status: 4,
				dataFechamento: { 
					$gte: req.params.dataInicial, 
					$lte: req.params.dataFinal 
				}
			})
			.exec()
			.then(
				function (resultadoVendas) {
					res.json(resultadoVendas);
				},
				function (error) {
					console.log(error);
				});
	};	
 
	controller.salvarLeadFormulario = function(req, res) {
		Lead.create({

			objectIdLogin: req.query.objectIdLogin,
			dataEntrada: new Date(),
			nome: req.query.nome,
			empresa: req.query.empresa,
			email: req.query.email,
			cargo: req.query.cargo,
			telefone: req.query.telefone,
			interesse: req.query.interesse,
			quantidadeConversoes: 1,
			data: new Date(),
			status: 0,
			pagina: req.query.pagina,
			source: req.query.source,
			medium: req.query.medium,
			term: req.query.term,
			content: req.query.content,
			campaign: req.query.campaign,
			mql_sql: req.query.mql_sql,
			lat: req.query.lat,
			lng: req.query.lng
		})
		.then(
		function (lead) {
			res.status(201).json(lead);
		},
		function (error) {
			console.log(error);
		});
	};

	return controller;
}