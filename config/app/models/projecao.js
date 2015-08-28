var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		
		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		vigencia: {
			type: Date,
			required: true
		},

		metrica: {
			type: String,
			required: true
		},

		valor: {
			type: Number,
			required: true
		}
	});

	return mongoose.model('Projecao', schema);
};