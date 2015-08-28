var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		pageId: {
			type: String
		},

		pagePath: {
			type: String	
		},

		// 'A' Ativo
		// 'I' Inativo
		status: {
			type: String
		},

		nome: {
			type: String	
		},

		dataEntrada: {
			type: Date
		}
	});

	return mongoose.model('Unbounce', schema);
};