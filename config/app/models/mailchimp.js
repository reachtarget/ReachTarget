var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		apiKey: {
			type: String
		}
	});

	return mongoose.model('Mailchimp', schema);
};