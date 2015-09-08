angular.module('reachtarget')
	.controller('AdwordsMaaSController', function($scope, $location, $resource, ClienteService, LoginService) {
		$scope.budgetConsumido = 0;
		$scope.cliques = 0;
		$scope.cpcMedio = 0;
		$scope.taxaDeConversao = 0;

		$scope.filtro = "";
		$scope.listaGrupos = [];

		var AdwordsPorLogin = $resource('/dadosAdwords/:objectIdLogin');


		$(document).ready(function() {
			abrirLoader();

			$('[data-toggle="tooltip"]').tooltip();

			_metodoDeAtualizacao = function(){
				$scope.consultarDadosAdwords();
			};			
		});


		$scope.zerarTotais = function() {
			$scope.budgetConsumido = 0;
			$scope.cliques = 0;
			$scope.cpcMedio = 0;
			$scope.taxaDeConversao = 0;
		};

		$scope.consultarDadosAdwords = function() {
			abrirLoader();
			$scope.zerarTotais();

			var _i = -1;
			var _grupo = "";

			var _impressoes = 0;
			var _cliques = 0;
			var _cpc = 0;
			var _ctr = 0;
			var _conversoes = 0;

			$scope.listaGrupos = [];
			$scope.$apply();


			gapi.client.analytics.data.ga.get({
    			'ids': 'ga:' + LoginService.CampanhaSelecionada.ProfileID,
    			'start-date': LoginService.DataInicialFormat,
    			'end-date': LoginService.DataFinalFormat,
    			'dimensions': 'ga:adGroup,ga:keyword',
    			'metrics': 'ga:impressions,ga:adClicks,ga:CPC,ga:CTR,ga:goalCompletionsAll,ga:adCost',
    			'sort': 'ga:adGroup,ga:impressions,ga:adClicks',
    			'filters': 'ga:campaign==' + LoginService.CampanhaSelecionada.Adwords
			})
			.execute(function(resultadoAnalytics) {   

				if (resultadoAnalytics.totalResults > 0) {

					resultadoAnalytics.rows.forEach(
						function(itemAnalytics, indexAnalytics, listaAnalytics) {

							if (_grupo != itemAnalytics[0])
							{
								_i++;
								_grupo = itemAnalytics[0];

								$scope.listaGrupos.push({
									GrupoDeAnuncio: itemAnalytics[0],
									Show: false,
									Contador: 0,
									Impressoes: 0,
									ImpressoesShow: '0',
									Cliques: 0,
									CPC: 0,
									CTR: 0,
									Conversoes: 0,
									TaxaDeConversao: 0,
									Custo: 0,
									ListaPalavrasChave: []
								});
							}


							_impressoes = new Number(itemAnalytics[2]);
							_cliques = new Number(itemAnalytics[3]);
							_cpc = new Number(itemAnalytics[4]);
							_ctr = new Number(itemAnalytics[5]);
							_conversoes = new Number(itemAnalytics[6]);
							_custo = new Number(itemAnalytics[7]);
							

							$scope.listaGrupos[_i].Contador++;
							$scope.listaGrupos[_i].Impressoes += _impressoes;
							$scope.listaGrupos[_i].Cliques += _cliques;
							$scope.listaGrupos[_i].CPC += _cpc;
							$scope.listaGrupos[_i].CTR += _ctr;
							$scope.listaGrupos[_i].Conversoes += _conversoes;
							$scope.listaGrupos[_i].Custo += _custo;
							

							$scope.budgetConsumido += _custo;
							$scope.cliques += _cliques;


							$scope.listaGrupos[_i].ListaPalavrasChave.push({
								PalavraChave: itemAnalytics[1],
								Impressoes: _impressoes,
								ImpressoesShow: formatarValor(_impressoes),
								Cliques: _cliques,
								CPC: formatReal(_cpc),
								CTR: _ctr.toFixed(2),
								Conversoes: _conversoes,
								Custo: _custo,
								TaxaDeConversao: (_cliques > 0) ? ((_conversoes / _cliques) * 100).toFixed(2) : 0
							});

							if (indexAnalytics == listaAnalytics.length-1) {

								_i = 0;
								_custo = 0;
								_cliques = 0;
								_conversoes = 0;

								$scope.listaGrupos.forEach(
									function(itemGrupo, indexGrupo, listaGrupo) {

										_i++;	
										_custo += itemGrupo.Custo; 
										_cliques += itemGrupo.Cliques;
										_conversoes += itemGrupo.Conversoes;
										
										itemGrupo.Impressoes = 
											itemGrupo.Impressoes;

										itemGrupo.ImpressoesShow = 
											formatarValor(itemGrupo.Impressoes);

										itemGrupo.CPC = 
											(itemGrupo.Cliques > 0) 
												? formatReal(itemGrupo.Custo / itemGrupo.Cliques)
												: '0,00';
										
										itemGrupo.CTR = 
											(itemGrupo.Contador > 0) ? (itemGrupo.CTR / itemGrupo.Contador).toFixed(2) : '0.00';

										itemGrupo.TaxaDeConversao = 
											 (itemGrupo.Cliques > 0) ? ((itemGrupo.Conversoes / itemGrupo.Cliques) * 100).toFixed(2) : '0.00';
										

										if (indexGrupo == listaGrupo.length-1) {

											$scope.budgetConsumido = 
												formatReal($scope.budgetConsumido);

											$scope.cpcMedio = formatReal(_custo / _cliques);

											if (_cliques > 0)
												$scope.taxaDeConversao =
													((_conversoes / _cliques) * 100).toFixed(2);


											$scope.$apply();
											fecharLoader();
										}
								});
							}							
						});
				} else {
					
					$scope.budgetConsumido = '0,00';
					$scope.cliques = 0;
					$scope.cpcMedio = '0,00';
					$scope.taxaDeConversao = '0.0';
					
					$scope.$apply();

					fecharLoader();

				}
			});
		};

		$scope.abrirPalavrasChave = function(itemPalavraChave) {
			itemPalavraChave.Show = !itemPalavraChave.Show;
		};

		$scope.consultarDadosAdwords();
	});
