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
		// 'S' Siteina - Clientes da Siteina que tem acesso ao Dashboard
		// 'C' Cliente SaaS - Contratantes do SaaS ou clientes de agências
		// 'M' Cliente MaaS - Contas criadas pela Siteina com acesso ao Dashboard do MaaS
		// 'G' Agências - Agências contratantes do SaaS
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