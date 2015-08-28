var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		
		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		vigencia: {
			type: String,
			required: true
		},

		vigenciaAuxiliar: {
			type: Date,
			required: true
		},

		adwords: {
			type: Number
		},
		
		social: {
			type: Number
		},

		email: {
			type: Number
		},

		direto: {
			type: Number
		},

		organica: {
			type: Number
		},

		referencia: {
			type: Number
		},

		outros: {
			type: Number
		},

		projetadoRealizado: {
			type: String
		}
	});

	return mongoose.model('Investimento', schema);
};