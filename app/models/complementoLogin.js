var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		objectIdAgencia: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},
		
		nome: {
			type: String,
			required: true
		},

		dataInclusao: {
			type: Date,
			required: true
		},
	});

	return mongoose.model('ComplementoLogin', schema);
};