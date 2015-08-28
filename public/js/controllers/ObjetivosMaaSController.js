angular.module('reachtarget')
	.controller('ObjetivosMaaSController', function($scope, $location, $resource, ClienteService, LoginService) {
		
		$scope.nomeEmpresa = null;
		$scope.emailRecebeLeads = null;
		$scope.produtoServicosTrabalhados = null;
		$scope.abrangenciaGeografica = null;
		$scope.orcamentoAdwords = null;
		$scope.atributosTrabalhados = null;
		$scope.publicoAlvo = null;
		$scope.comoClientesProcuramGoogle = null;
		$scope.pricipaisDiferenciais = null;
		$scope.clientes = null;
		$scope.parceiros = null;
		$scope.concorrentes = null;
		$scope.referenciaVisual = null;

		$scope.textoBotao = "Enviar briefing";

		var _idBriefing = null;

		var Briefing = $resource('/briefing');
		var BriefingPorLogin = $resource('/briefing/:objectIdLogin');


		$scope.carregarBriefing = function() {
			_idBriefing = null;
			$scope.textoBotao = "Enviar briefing";

			BriefingPorLogin.get({

				objectIdLogin: LoginService.objectIdLogin

			}, function(resultadoBriefingPorLogin) {

				if (resultadoBriefingPorLogin._id) {

					_idBriefing = resultadoBriefingPorLogin._id;

					$scope.nomeEmpresa = resultadoBriefingPorLogin.nomeEmpresa;
					$scope.emailRecebeLeads = resultadoBriefingPorLogin.emailRecebeLeads;
					$scope.produtoServicosTrabalhados = resultadoBriefingPorLogin.produtoServicosTrabalhados;
					$scope.abrangenciaGeografica = resultadoBriefingPorLogin.abrangenciaGeografica;
					$scope.orcamentoAdwords = resultadoBriefingPorLogin.orcamentoAdwords;
					$scope.atributosTrabalhados = resultadoBriefingPorLogin.atributosTrabalhados;
					$scope.publicoAlvo = resultadoBriefingPorLogin.publicoAlvo;
					$scope.comoClientesProcuramGoogle = resultadoBriefingPorLogin.comoClientesProcuramGoogle;
					$scope.pricipaisDiferenciais = resultadoBriefingPorLogin.pricipaisDiferenciais;
					$scope.clientes = resultadoBriefingPorLogin.clientes;
					$scope.parceiros = resultadoBriefingPorLogin.parceiros;
					$scope.concorrentes = resultadoBriefingPorLogin.concorrentes;
					$scope.referenciaVisual = resultadoBriefingPorLogin.referenciaVisual;

					$scope.textoBotao = "Reenviar briefing";

				}

			});
		};

		$scope.enviarBriefing = function() {
			var _briefing = new Briefing();

			if (_idBriefing)
				_briefing._id = _idBriefing;				

			_briefing.objectIdLogin = LoginService.objectIdLogin;
			_briefing.dataPreenchimento = new Date();
			_briefing.nomeEmpresa = $scope.nomeEmpresa;
			_briefing.emailRecebeLeads = $scope.emailRecebeLeads;
			_briefing.produtoServicosTrabalhados = $scope.produtoServicosTrabalhados;
			_briefing.abrangenciaGeografica = $scope.abrangenciaGeografica;
			_briefing.orcamentoAdwords = $scope.orcamentoAdwords;
			_briefing.atributosTrabalhados = $scope.atributosTrabalhados;
			_briefing.publicoAlvo = $scope.publicoAlvo;
			_briefing.comoClientesProcuramGoogle = $scope.comoClientesProcuramGoogle;
			_briefing.pricipaisDiferenciais = $scope.pricipaisDiferenciais;
			_briefing.clientes = $scope.clientes;
			_briefing.parceiros = $scope.parceiros;
			_briefing.concorrentes = $scope.concorrentes;
			_briefing.referenciaVisual = $scope.referenciaVisual;

			_briefing.$save(
				function() {
					if (_idBriefing)
						$location.path('maas');
			});
		};

		$scope.carregarBriefing();
});