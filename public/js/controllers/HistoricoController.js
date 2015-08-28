angular.module('reachtarget')
	.controller('HistoricoController', function($scope, $location, $resource, ClienteService, LoginService) {

		$scope.filtro = '';
		$scope.listaHistoricoResumo = [];

		var ConsultarHistoricoResumo = $resource('/historicoResumo/:objectIdLogin');


		$scope.consultarHistorico = function() {
			if (!LoginService.AbriuPeloLogin) {
				apagarCookie('rtmaassiteinaloginsenha');			
				fecharLoader();

				$location.path('/login');
				return;
			}
			else {
				abrirLoader();

				ConsultarHistoricoResumo.query({
					objectIdLogin: LoginService.objectIdLogin
				}, function(resultadoConsultarHistoricoResumo) {

					if (resultadoConsultarHistoricoResumo.length > 0) {

						resultadoConsultarHistoricoResumo.forEach(function(consultarHistoricoResumo, indexHistorico, listaHistorico){
							$scope.listaHistoricoResumo.push({
								data: new Date(consultarHistoricoResumo.dataEnvioResumo),

								DataEnvio: formarData(consultarHistoricoResumo.dataEnvioResumo),
								
								Periodo: 
									formarData(consultarHistoricoResumo.dataDe) + ' ~ ' +
									formarData(consultarHistoricoResumo.dataAte),

								Acessos: consultarHistoricoResumo.acessos,
								Visualizacoes: consultarHistoricoResumo.visualizacoes,
								Leads: consultarHistoricoResumo.leads,
								Conversao: consultarHistoricoResumo.taxaConversao,

								Comentario: consultarHistoricoResumo.comentario
							});

							if (indexHistorico == listaHistorico.length-1) {
								fecharLoader();
								$('#modalEnvioResumo').modal('show');			
							}
						});
					} else {
						fecharLoader();
						$('#modalEnvioResumo').modal('show');
					}
				});
			}
		};


		$scope.consultarHistorico();
	});
