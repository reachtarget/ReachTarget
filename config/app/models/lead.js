var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		
		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		dataEntrada: {
			type: Date,
			required: true	
		},

		nome: {
			type: String,
			required: true
		},

		empresa: {
			type: String
		},

		email: {
			type: String
		},		

		cargo: {
			type: String
		},

		telefone: {
			type: String
		},

		interesse: {
			type: String
		},

		quantidadeConversoes: {
			type: Number	
		},

		data: {
			type: Date,
			required: true	
		},

		// 0  Qualificado
        // 1  Desqualificado
        // 2  Oportunidade aberta
        // 3  Oportunidade perdida
        // 4  Fechada
		status: {
			type: Number,
			required: true
		},

		dataFechamento: {
			type: Date
		},

		valorFechamento: {
			type: Number
		},

		pagina: {
			type: String
		},

		source: {
			type: String
		}, 

		medium: {
			type: String
		},

		term: {
			type: String
		},

		content: {
			type: String
		},

		campaign: {
			type: String
		},

		mql_sql: {
			type: String
		},

		lat: {
			type: String
		},

		lng: {
			type: String
		}
	});

	return mongoose.model('Lead', schema);
};