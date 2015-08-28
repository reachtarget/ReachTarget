module.exports = function(app) {
	var controller = app.controllers.mailchimp;	

	app.route('/mailchimp')
		.post(controller.salvar);	

	app.route('/mailchimp/:objectIdLogin')
		.get(controller.retornarMailChimpPorIDLogin);

	app.route('/mailchimp/listas/retornarTodas/:apikey')	
		.get(controller.retornarListas);	

	app.route('/mailchimp/campanhas/porID/:apikey/:cid')	
		.get(controller.retornarCampanhaPorID);	
}
