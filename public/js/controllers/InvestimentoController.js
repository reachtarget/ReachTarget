angular.module('reachtarget')
	.controller('InvestimentoController', function($resource, $scope, $location, LoginService) {

	$scope.mesAno = "";

	$scope.listaMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

	$scope.adwords = "";
	$scope.email = "";
	$scope.organica = "";
	$scope.outros = "";
	$scope.social = "";
	$scope.direto = "";
	$scope.referencia = "";
	$scope.total = "";

	$scope.adwordsProjetado = "";
	$scope.emailProjetado = "";
	$scope.organicaProjetado = "";
	$scope.outrosProjetado = "";
	$scope.socialProjetado = "";
	$scope.diretoProjetado = "";
	$scope.referenciaProjetado = "";
	$scope.totalProjetado = "";


	var dataAtual = new Date();
	var investimentoAtual = null;
	var projecaoAtual = null;

	var Investimento = $resource('/investimento');
	var InvestimentoPorObjectIdVigencia = $resource('/investimento/:objectId/:vigencia/:vigenciaAuxiliar/:projetadoRealizado');


	$scope.clickProjecao = function() {
		var _vigencia = lpad(new Number(dataAtual.getMonth() + 1), 2) + "/" + dataAtual.getFullYear();
		projecaoAtual = null;
		
		InvestimentoPorObjectIdVigencia.get({ 
			objectId: LoginService.objectIdLogin,
			vigencia: _vigencia,
			vigenciaAuxiliar: dataAtual,
			projetadoRealizado: 'P'
		},
		function(resultadoInvestimento) {
			if (resultadoInvestimento._id) {
				if (resultadoInvestimento.vigencia == _vigencia)
					projecaoAtual = resultadoInvestimento;

				$scope.adwordsProjetado = resultadoInvestimento.adwords;
				$scope.emailProjetado = resultadoInvestimento.email;
				$scope.organicaProjetado = resultadoInvestimento.organica;
				$scope.outrosProjetado = resultadoInvestimento.outros;

				$scope.socialProjetado = resultadoInvestimento.social;
				$scope.diretoProjetado = resultadoInvestimento.direto;
				$scope.referenciaProjetado = resultadoInvestimento.referencia;
			} else {
				$scope.adwordsProjetado = 0;
				$scope.emailProjetado = 0;
				$scope.organicaProjetado = 0;
				$scope.outrosProjetado = 0;

				$scope.socialProjetado = 0;
				$scope.diretoProjetado = 0;
				$scope.referenciaProjetado = 0;
			}

			$scope.atualizarTotalProjecao();
		});

		$('#modalProjecao').modal('show');
	};

	$scope.fecharProjecao = function() {
		$scope.consultaDeInvestimento();
		
		$('#modalProjecao').modal('hide');
	};

	$scope.exibirMesAno = function() {
		dataAtual.setDate(1);
		$scope.mesAno = $scope.listaMes[dataAtual.getMonth()] + "/" + dataAtual.getFullYear();
	};

	$scope.mesAnterior = function() {
		dataAtual.setMonth(dataAtual.getMonth()-1);

		$scope.exibirMesAno();
		$scope.consultaDeInvestimento();
	};

	$scope.proximoMes = function() {
		dataAtual.setMonth(dataAtual.getMonth()+1);

		$scope.exibirMesAno();
		$scope.consultaDeInvestimento();
	};

	$scope.consultaDeInvestimento = function() {
		InvestimentoPorObjectIdVigencia.get({ 
			objectId: LoginService.objectIdLogin,
			vigencia: lpad(new Number(dataAtual.getMonth() + 1), 2) + "/" + dataAtual.getFullYear(),
			vigenciaAuxiliar: dataAtual,
			projetadoRealizado: 'R'
		},
		function(realizado) {
			if (realizado._id) {
				investimentoAtual = realizado;

				$scope.adwords = realizado.adwords;
				$scope.email = realizado.email;
				$scope.organica = realizado.organica;
				$scope.outros = realizado.outros;

				$scope.social = realizado.social;
				$scope.direto = realizado.direto;
				$scope.referencia = realizado.referencia;

				$scope.atualizarTotal();
			} else {
				InvestimentoPorObjectIdVigencia.get({ 
					objectId: LoginService.objectIdLogin,
					vigencia: lpad(new Number(dataAtual.getMonth() + 1), 2) + "/" + dataAtual.getFullYear(),
					vigenciaAuxiliar: dataAtual,
					projetadoRealizado: 'P'
				},
				function(projetado) {
					investimentoAtual = null;

					if (projetado._id) {
						$scope.adwords = projetado.adwords;
						$scope.email = projetado.email;
						$scope.organica = projetado.organica;
						$scope.outros = projetado.outros;

						$scope.social = projetado.social;
						$scope.direto = projetado.direto;
						$scope.referencia = projetado.referencia;

						$scope.atualizarTotal();
						
					} else {
						$scope.total = 0;

						$scope.adwords = 0;
						$scope.email = 0;
						$scope.organica = 0;
						$scope.outros = 0;

						$scope.social = 0;
						$scope.direto = 0;
						$scope.referencia = 0;
					}
				});			
			}
		});
	};	

	$scope.atualizarTotalProjecao = function()
	{
		$scope.totalProjetado = 
			$scope.adwordsProjetado + $scope.emailProjetado + $scope.organicaProjetado +
			$scope.outrosProjetado + $scope.socialProjetado + $scope.diretoProjetado +
			$scope.referenciaProjetado;
	};

	$scope.atualizarTotal = function()
	{
		$scope.total = 
			$scope.adwords + $scope.email + $scope.organica +
			$scope.outros + $scope.social + $scope.direto +
			$scope.referencia;
	};
	
	$scope.salvarInvestimento = function(projetadoRealizado) {	
		if (projetadoRealizado == 'P') {
			$scope.salvarProjecao();
			$scope.atualizarTotalProjecao();
		} else {
			$scope.salvarRealizado();
			$scope.atualizarTotal();
		}
	};

	$scope.salvarProjecao = function(){
		if (!projecaoAtual)
			projecaoAtual = new Investimento();

		projecaoAtual.objectIdLogin = LoginService.objectIdLogin;
		projecaoAtual.vigenciaAuxiliar = dataAtual;
		projecaoAtual.vigencia = lpad(new Number(dataAtual.getMonth() + 1), 2) + "/" + dataAtual.getFullYear();
		projecaoAtual.projetadoRealizado = 'P';

		projecaoAtual.adwords = $scope.adwordsProjetado;
		projecaoAtual.email = $scope.emailProjetado;
		projecaoAtual.organica = $scope.organicaProjetado;
		projecaoAtual.outros = $scope.outrosProjetado;
		projecaoAtual.social = $scope.socialProjetado;
		projecaoAtual.direto = $scope.diretoProjetado;
		projecaoAtual.referencia = $scope.referenciaProjetado;

		projecaoAtual.$save();
	};

	$scope.salvarRealizado = function(){
		if (!investimentoAtual)
			investimentoAtual = new Investimento();

		investimentoAtual.objectIdLogin = LoginService.objectIdLogin;
		investimentoAtual.vigenciaAuxiliar = dataAtual;
		investimentoAtual.vigencia = lpad(new Number(dataAtual.getMonth() + 1), 2) + "/" + dataAtual.getFullYear();
		investimentoAtual.projetadoRealizado = 'R';

		investimentoAtual.adwords = $scope.adwords;
		investimentoAtual.email = $scope.email;
		investimentoAtual.organica = $scope.organica;
		investimentoAtual.outros = $scope.outros;
		investimentoAtual.social = $scope.social;
		investimentoAtual.direto = $scope.direto;
		investimentoAtual.referencia = $scope.referencia;

		investimentoAtual.$save();
	};

	$scope.exibirMesAno();
	$scope.consultaDeInvestimento();
});
