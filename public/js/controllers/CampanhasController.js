angular.module('reachtarget')
	.controller('CampanhasController', function($resource, $scope, $location, LoginService) {
		$scope.filtro = '';
		$scope.listaCampanhas = [];

		var MailChimp = $resource('/mailchimp/:objectIdLogin');
		var ListaCampanha = $resource('/campanha/:objectIdLogin');
		var GooglePorCampanha = $resource('/google/campanha/:objectIdLogin/:campaignId');
		var LeadsPaginaUnbounce = $resource('/unbounce/leads/:page_id/:dataInicial/:dataFinal');
		var CampanhaPorID = $resource('/mailchimp/campanhas/porID/:apikey/:cid');

		$scope.abrirTela = function() {
			abrirLoader();

			$scope.consultarCampanhas();
		};

		$scope.consultarCampanhas = function() {
			
			MailChimp.get({

				objectIdLogin: LoginService.objectIdLogin

			}, function(resMailChimp){

				if (resMailChimp) {

					ListaCampanha.query({

						objectIdLogin: LoginService.objectIdLogin

					}, function(resListaCampanha){
						
						if (resListaCampanha.length > 0) {

							resListaCampanha.forEach(function(campanha, indexCampanha, listaCampanha){

								GooglePorCampanha.get({

									objectIdLogin: LoginService.objectIdLogin,
									campaignId: campanha.campaignId

								}, function(resGooglePorCampanha){

									var _campanha = {

										nome: campanha.nome,

										emailsEnviados: 0,
										clicks: 0,

										visualizacoes:	0,
										leads: 0,
										taxaConversao: 0

									};

									$scope.listaCampanhas.push(_campanha);

									gapi.client.analytics.data.ga.get({
                    					'ids': 'ga:' + resGooglePorCampanha.profileId,
                    					'start-date': '2015-01-31',
                    					'end-date': '2015-11-30',
                    					'metrics': 'ga:sessions,ga:users'
                					})
                					.execute(function(resGapi) {   
                						_campanha.visualizacoes = resGapi.rows[0][0];

                						if (_campanha.visualizacoes > 0)
                							_campanha.taxaConversao = ((_campanha.leads / _campanha.visualizacoes) * 100).toFixed(2);
                					});


									CampanhaPorID.query({

										apikey: resMailChimp.apiKey,
										cid: campanha.campaignId
										
									}, function(resCampanhaPorID) {

										resCampanhaPorID.forEach(function(campanhaPorID){

											_campanha.emailsEnviados = campanhaPorID.summary.emails_sent;
											_campanha.clicks = campanhaPorID.summary.clicks;

										});

									});


									LeadsPaginaUnbounce.get({

										page_id: resGooglePorCampanha.unbouncePageId,
										dataInicial: '2015-01-31',
										dataFinal: '2015-11-30'

									}, function(resPaginaUnbounce){

										_campanha.leads = resPaginaUnbounce.leads.length;

										if (_campanha.visualizacoes > 0)
                							_campanha.taxaConversao = ((_campanha.leads / _campanha.visualizacoes) * 100).toFixed(2);
										
									});

									if (indexCampanha == listaCampanha.length-1) {
										fecharLoader();
									}

								});

							});

						} else {	

							fecharLoader();	

						}

					});
					
				} else {		

					fecharLoader();
					
				}

			});
		};


		$scope.abrirTela();
});