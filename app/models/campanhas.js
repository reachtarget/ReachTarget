var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		nome: {
			type: String	
		},

		dataInclusao:  {
			type: Date
		}

	});

	return mongoose.model('Campanha', schema);
};