module.exports = function(app) {
	var controller = app.controllers.google;	

	app.route('/google')
		.post(controller.salvar);

	app.route('/excluir/google/:id')
		.delete(controller.excluir);


	app.route('/google/:objectIdLogin')
		.get(controller.retornarDadosGoogle);

	app.route('/google/:objectIdLogin/:unbouncePageId')
		.get(controller.retornarDadosGooglePorUnbouncePageID);

	app.route('/google/campanha/:objectIdLogin/:campaignId')
		.get(controller.retornarDadosGooglePorIDCampaign);



	app.route('/analytics/:code/:objectIdLogin')
		.get(controller.getToken);

	app.route('/token/analytics/:accessToken/:refreshToken/:id')
		.get(controller.refreshToken);


	app.route('/oauth2callback')
		.get(function(req, res) {
		});
}
