var mongoose = require('mongoose');

module.exports = function (uri) {
	mongoose.connect(uri);

	
	mongoose.connection.on('connected', function() {
		console.log('Conectado!');
	});

	mongoose.connection.on('disconnected', function() {
		console.log('Disconectado!');
	});

	mongoose.connection.on('error', function() {
		console.log('Erro!');
	});


	process.on('SIGINT', function() {
		mongoose.connection.close(function(){
			console.log('Fechou a aplicação!');
			process.exit(0);
		});
	});
}