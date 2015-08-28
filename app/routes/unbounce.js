module.exports = function(app) {
	var controller = app.controllers.unbounce;	

	app.route('/unbounce')	
		.post(controller.salvar);

	app.route('/excluir/unbounce/:id')	
		.delete(controller.excluir);

	app.route('/unbounce/:objectId')
		.get(controller.retornarPaginasPorObjectId);
}
