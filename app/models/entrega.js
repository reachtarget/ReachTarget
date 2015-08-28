var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		tipo: {
			type: String
		},

		descricao: {
			type: String
		},

		status: {
			type: String
		},

		dataEntregaPrevisto: {
			type: Date
		},

		dataEntregaRealizado: {
			type: Date
		},

		responsavel: {
			type: String
		}		
	});

	return mongoose.model('Entrega', schema);
};