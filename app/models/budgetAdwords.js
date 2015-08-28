var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		data: {
			type: Date
		},

		dataInicial: {
			type: Date
		},

		dataFinal: {
			type: Date
		},

		budgetDisponivel: {
			type: Number
		},

		budgetConsumido: {
			type: Number
		}

	});

	return mongoose.model('BudgetAdwords', schema);
};