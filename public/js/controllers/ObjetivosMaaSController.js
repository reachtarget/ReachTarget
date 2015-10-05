angular.module('reachtarget')
	.controller('ObjetivosMaaSController', function($scope, $location, $resource, ClienteService, LoginService) {
		
		$scope.campanhaSelecionada = false;

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

		var BriefingPorLoginECampanha = $resource('/briefingPorOferta/:objectIdLogin/:objectIdCampanha');

		$(document).ready(function() {
			$('[data-toggle="tooltip"]').tooltip();

			_metodoDeAtualizacao = function(){
				$scope.carregarBriefing();
			};
		});

		$scope.carregarBriefing = function() {

			$scope.campanhaSelecionada = (LoginService.CampanhaSelecionada.IDPagina != '-');

			if (LoginService.CampanhaSelecionada.IDPagina != '-') {

				BriefingPorLoginECampanha.get({

					objectIdLogin: LoginService.objectIdLogin,
					objectIdCampanha: LoginService.CampanhaSelecionada.IDCampanha

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

					} else
						$scope.zerarDados();
				});
			} else
				$scope.zerarDados();
		};

		$scope.zerarDados = function() {

			$scope.produtoServicosTrabalhados = '';
			$scope.abrangenciaGeografica = '';
			$scope.orcamentoAdwords = '';
			$scope.atributosTrabalhados = '';
			$scope.publicoAlvo = '';
			$scope.comoClientesProcuramGoogle = '';
			$scope.pricipaisDiferenciais = '';
			$scope.clientes = '';
			$scope.parceiros = '';
			$scope.concorrentes = '';
			$scope.referenciaVisual = '';

			if(!$scope.$$phase) {
				$scope.$apply();	
			}
		};

		$scope.carregarBriefing();
});