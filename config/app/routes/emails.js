var express = require('express');

module.exports = function(app) {
	var controller = app.controllers.email;	

	app.route('/lead/email')
		.get(controller.enviarEmailLead);

	app.route('/email/resumo')
		.post(controller.enviarEmail);

	app.route('/email/novo/login')
		.post(controller.enviarEmailNovoLogin);
}
