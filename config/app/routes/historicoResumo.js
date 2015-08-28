module.exports = function(app) {
	var controller = app.controllers.historicoResumo;	

	app.route('/historicoResumo')
		.post(controller.salvar);

	app.route('/historicoResumo/:objectIdLogin')
		.get(controller.historicoResumoPorID);
}
