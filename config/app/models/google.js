var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		unbouncePageId: {
			type: String
		},

		campaignId: {
			type: String
		},


		idAdwords: {
			type: String
		},
		

		accountId: {
			type: String
		},

		webPropertyId: {
			type: String
		},

		profileId: {
			type: String
		},


		accessToken: {
			type: String
		},

		refreshToken: {
			type: String
		}
	});

	return mongoose.model('Google', schema);
};