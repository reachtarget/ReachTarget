var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		
		login: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},

		senha: {
			type: String,
			required: true
		},

		email: {
			type: String,
			required: true
		},

		// 'A' Administrador - Dashboard da Siteina
		// 'M' Cliente MaaS - Starter
		// 'S' Cliente MaaS - Search
		// 'I' Cliente MaaS - Inbound
		tipo: {
			type: String,
			required: true
		},

		// 'A' Ativo
		// 'I' Inativo
		status: {
			type: String,
			required: true
		}
	});

	return mongoose.model('Login', schema);
};