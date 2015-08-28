module.exports = function(app) {
	var controller = app.controllers.projecao;	

	app.route('/projecao')
		.post(controller.salvarProjecao);

	app.route('/projecao/:objectId/:dataInicial/:dataFinal')
		.get(controller.consultarProjecaoPorSemestre);

	app.route('/projecao/:objectId/:dataInicial/:dataFinal/:metrica')
		.get(controller.consultarProjecaoPorSemestrePorMetrica);
}
