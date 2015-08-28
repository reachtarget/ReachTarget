module.exports = function(app) {
	var controller = app.controllers.timelineLead;	

	app.route('/timelineLead')
		.post(controller.salvarTimelineLead);

	app.route('/excluir/timelineLead/:id')
		.delete(controller.excluirTimelineLead);

	app.route('/timelineLead/:objectId/:idLead')
		.get(controller.consultarTimelineLead);
}
