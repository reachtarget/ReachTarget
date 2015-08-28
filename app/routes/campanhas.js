module.exports = function(app) {
	var controller = app.controllers.campanhas;	

	app.route('/campanha')
		.post(controller.salvar);

	app.route('/excluir/campanha/:id')	
		.delete(controller.excluir);

	app.route('/campanha/:objectIdLogin')
		.get(controller.campanhasPorLogin);

}
