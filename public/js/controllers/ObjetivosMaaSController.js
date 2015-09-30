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

		var BriefingPorLoginECampanha = $resource('/briefing/:objectIdLogin/:objectIdCampanha');


		$scope.carregarBriefing = function() {

			BriefingPorLoginECampanha.get({

				objectIdLogin: LoginService.objectIdLogin,
				objectIdCampanha: LoginService.CampanhaSelecionada._id

			}, function(resultadoBriefingPorLogin) {

				if (resultadoBriefingPorLogin._id) {

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
				}

			});
		};

		$scope.carregarBriefing();
});