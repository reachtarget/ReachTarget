module.exports = function(app) {
	var controller = app.controllers.investimento;

	app.route('/investimento')
		.post(controller.salvarInvestimento);

	app.route('/investimento/:objectId/:vigencia/:vigenciaAuxiliar/:projetadoRealizado')
		.get(controller.consultarInvestimentoObjectIdVigencia)

	app.route('/investimento/consultarInvestimentos/:objectId/:vigenciaInicial/:vigenciaFinal/:projetadoRealizado')
		.get(controller.consultarInvestimentos);	
}
