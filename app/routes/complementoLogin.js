module.exports = function(app) {
	var controller = app.controllers.complementoLogin;	

	app.route('/complementoLogin')
		.post(controller.salvar);

	app.route('/complementoLogin/:objectIdLogin')
		.get(controller.complementoLoginPorID);
}
