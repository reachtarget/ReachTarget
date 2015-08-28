module.exports = function(app) {
	var controller = app.controllers.lead;	

	app.route('/lead')
		.post(controller.salvarLead);

	app.route('/excluir/lead/:id')
		.delete(controller.excluirLead);
		

	app.route('/formulario')
		.get(controller.salvarLeadFormulario);

	app.route('/lead/:objectId/:idLead')
		.get(controller.consultarLeadPorID);

	app.route('/lead/:objectId/:dataInicial/:dataFinal')
		.get(controller.consultarLeads);

	app.route('/lead/vendas/:objectId/:dataInicial/:dataFinal')
		.get(controller.consultarVendas);

	app.route('/lead/maas/:objectId/:dataInicial/:dataFinal/:pagina')
		.get(controller.consultarLeadsMaaS);
}
