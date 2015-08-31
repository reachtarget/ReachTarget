var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({

		objectIdLogin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Login'
		},

		objectIdCampanha: {
			type: mongoose.Schema.ObjectId,
			ref: 'Unbounce'
		},

		dataPreenchimento:  {
			type: Date
		},

		nomeEmpresa:  {
			type: String
		},

		emailRecebeLeads:  {
			type: String
		},

		produtoServicosTrabalhados:  {
			type: String
		},
		
		abrangenciaGeografica:  {
			type: String
		},
		
		orcamentoAdwords:  {
			type: String
		},
		
		atributosTrabalhados:  {
			type: String
		},
		
		publicoAlvo:  {
			type: String
		},
		
		comoClientesProcuramGoogle:  {
			type: String
		},
		
		pricipaisDiferenciais:  {
			type: String
		},
		
		clientes:  {
			type: String
		},
		
		parceiros:  {
			type: String
		},
		
		concorrentes:  {
			type: String
		},
		
		referenciaVisual:  {
			type: String
		}
	});

	return mongoose.model('Briefing', schema);
};