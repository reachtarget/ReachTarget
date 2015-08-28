var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		objectIdCampanha: {
			type: mongoose.Schema.ObjectId,
			ref: 'Campanha'	
		},

		objectIdGoogle: {
			type: mongoose.Schema.ObjectId,
			ref: 'Googles'	
		}

	});

	return mongoose.model('ItensCampanha', schema);
};