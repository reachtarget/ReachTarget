module.exports = function(app) {
	var controller = app.controllers.login;	

	app.route('/login')	
		.post(controller.salvar);

	app.route('/login/:login')	
		.get(controller.login);

	app.route('/login/id/:objectIdLogin')	
		.get(controller.retornarLoginObjectIdLogin);


	app.route('/clientesAtivos')	
		.get(controller.retornarLoginsAtivos);		

	app.route('/clientesInativos')
		.get(controller.retornarLoginsInativos);

	app.route('/clientesBriefing')
		.get(controller.retornarLoginsBriefing);
}
