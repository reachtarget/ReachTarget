module.exports = function(app) {
	var controller = app.controllers.briefing;

	app.route('/briefing')
		.post(controller.salvar);

	app.route('/briefing/:objectIdLogin')
		.get(controller.briefingPorLogin);
}
