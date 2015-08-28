var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		dataEnvioResumo: {
			type: Date
		},

		dataDe: {
			type: Date
		},

		dataAte: {
			type: Date
		},

		acessos: {
			type: String
		},

		visualizacoes: {
			type: String
		},

		leads: {
			type: String
		},

		taxaConversao: {
			type: String
		},

		comentario: {
			type: String	
		}

	});

	return mongoose.model('HistoricoResumo', schema);
};