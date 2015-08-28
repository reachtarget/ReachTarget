var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		
		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		objectIdLead: {
			type: mongoose.Schema.ObjectId,
			ref: 'Lead'
		},

		data: {
			type: Date,
			required: true
		},

		tipo: {
			type: String,
			required: true
		},

		valorAnterior: {
			type: String
		},

		valorAtual: {
			type: String
		},

		dataFechamento: {
			type: Date
		},

		valorFechamento: {
			type: Number
		}
	});

	return mongoose.model('TimelineLead', schema);
};