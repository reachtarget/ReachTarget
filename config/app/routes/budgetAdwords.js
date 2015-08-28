module.exports = function(app) {
	var controller = app.controllers.budgetAdwords;

	app.route('/budgetAdwords')
		.post(controller.salvar);

	app.route('/budgetAdwords/:objectIdLogin')
		.get(controller.budgetAdwordsPorLogin);
}
