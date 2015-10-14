angular.module('reachtarget')
	.controller('EstatisticasMaaSController', function($scope, $location, $resource, LoginService) {
		$scope.listaPaginasUnbounce = [];
		$scope.paginasUnbounceSelecionada = "";

		$scope.opcaoDiaSemanaMesSelecionada = "d";
		$scope.listaDiaSemanaMesSelecionada = [
      		{ sigla: 'd', descricao: 'Dia' }, 
      		{ sigla: 's', descricao: 'Semana' }, 
      		{ sigla: 'm', descricao: 'Mês' }];

		$scope.filtro = "";
		$scope.ordenacao = "DataOrder";
		$scope.opcaoReverse = true;
		        
		$scope.acessos = 0;
		$scope.visitantes = 0;
		$scope.conversoes = 0;
		$scope.taxaDeConversao = '0.0'; // ((conversoes / visitantes) * 100)
		$scope.inptuDataInicialFinal = "";


		var _listaTodosLeads = [];


		var _total = true;
		var _dataTotalGraficoLeads;

		var _auxiliar;
		var _incluirNovaLabel;
		var _data;
		var _dataMask;
		var _dataTabela;

		var _atualizar = false;

		var _dia = new Date();
		var _diaDaSemana = _dia.getDay();

		var _diaSemanaMes = "d";
		var _diaSemanaMesGA = "ga:day,ga:month,ga:year";
        var _ordenacaoDiaSemanaMesGA = "ga:year,ga:month,ga:day";


		var _graficoLeads;

		var _dataGraficoLeads = {
			labels: [],
			datasets: []
		};


		var ConsultarLeads = $resource('/lead/maas/:objectId/:dataInicial/:dataFinal/:pagina');


		$(function () {
	  		$('[data-toggle="tooltip"]').tooltip();
		});

		Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        };

		$scope.abrirTela = function() {
			if (!LoginService.AbriuPeloLogin) {
				
				apagarCookie('rtmaassiteinaloginsenha');			
				fecharLoader();
				$location.path('/login');

			} else {
				_metodoDeAtualizacao = function(){
					$scope.retornarPaginasUnbouncePorUsuario();
				};

				$scope.retornarPaginasUnbouncePorUsuario();
			}
		};


		$scope.gerarValoresGrafico = function() {

			if (_graficoLeads)
				_graficoLeads.destroy();

			_dataGraficoLeads = {
				labels: [],

				datasets: [{
            		label: "Leads",
            		fillColor: "rgba(151,187,205,0.2)",
              	  	strokeColor: "rgba(151,187,205,1)",
              	  	pointColor: "rgba(151,187,205,1)",
       	        	pointStrokeColor: "#fff",
             	    pointHighlightFill: "#fff",
               		pointHighlightStroke: "rgba(151,187,205,1)",
               		scaleShowGridLines: true,
               		gridLineColor: "rgba(151,187,205,1)",
            		data: []
        		},
        		{
            		label: "Acessos",
            		fillColor: "rgba(220,220,220,0.2)",
                	strokeColor: "rgba(220,220,220,1)",
                	pointColor: "rgba(220,220,220,1)",
                	pointStrokeColor: "#fff",
                	pointHighlightFill: "#fff",
                	pointHighlightStroke: "rgba(220,220,220,1)",
                	scaleShowGridLines: true,
                	gridLineColor: "rgba(220,220,220,1)",
            		data: []
        		}]
			};
		};

		$scope.retornarPaginasUnbouncePorUsuario = function(){
			abrirLoader();
			$scope.gerarValoresGrafico();

			$scope.acessos = 0;
			$scope.visitantes = 0;
			$scope.conversoes = 0;
			$scope.taxaDeConversao = '0.0';

			gapi.client.analytics.data.ga.get({
    			'ids': 'ga:' + LoginService.CampanhaSelecionada.ProfileID,
    			'start-date': LoginService.DataInicialFormat,
    			'end-date': LoginService.DataFinalFormat,
    			'dimensions': _diaSemanaMesGA,
    			'sort': _ordenacaoDiaSemanaMesGA,
    			'metrics': 'ga:pageviews,ga:uniquePageviews',
    			'filters':  
					(LoginService.CampanhaSelecionada.PagePath == '/') 
						? null
						: 'ga:pagePath==' + LoginService.CampanhaSelecionada.PagePath
			})
			.execute(function(_resultadoAnalytics) {   

				var _contador = -1;
				var _numeroAcessos = 0;
				var _numeroVisitante = 0;

				_resultadoAnalytics.rows.forEach(function(row, indexRow, listaRow) {
					_contador++;

					if (_diaSemanaMes == "d") {

						_numeroAcessos = 3;
						_numeroVisitante = 4;

						_dataGraficoLeads.labels.push(row[0] + '/' + row[1] + '/' + row[2]);

					} else if (_diaSemanaMes == "s") {

						_numeroAcessos = 1;
						_numeroVisitante = 2;

						_dataGraficoLeads.labels.push('Semana ' + row[0]);

					} else if (_diaSemanaMes == "m") {

						_numeroAcessos = 2;
						_numeroVisitante = 3;

						_dataGraficoLeads.labels.push(row[0] + '/' + row[1]);
					}

					_dataGraficoLeads.datasets[0].data.push(0);
					_dataGraficoLeads.datasets[1].data.push(new Number(row[_numeroAcessos]));

					$scope.acessos += new Number(row[_numeroAcessos]);
					$scope.visitantes += new Number(row[_numeroVisitante]);
					
					if (indexRow == listaRow.length-1) {

						ConsultarLeads.query({

							objectId: LoginService.objectIdLogin,
          					dataInicial: LoginService.DataInicial,
          					dataFinal: LoginService.DataFinal,
          					pagina: LoginService.CampanhaSelecionada.IDPagina

						}, function(_resultadoLeads) {

							$scope.conversoes = _resultadoLeads.length;

							if ($scope.visitantes > 0)
								$scope.taxaDeConversao = (($scope.conversoes / $scope.visitantes) * 100).toFixed(1);


							_resultadoLeads.forEach(function(lead) {

								_auxiliar = 0;
								_data = new Date(lead.data);
								_dataTabela = lpad(_data.getDate(), 2) + "/" + lpad(new Number(_data.getMonth() + 1), 2) + "/" + _data.getFullYear();


								if (_diaSemanaMes == 'd') 
									_dataMask = _dataTabela;
								else if (_diaSemanaMes == 's')
									_dataMask = "Semana " + _data.getWeek();
								else if (_diaSemanaMes == 'm') 
									_dataMask = lpad(new Number(_data.getMonth() + 1), 2) + "/" + _data.getFullYear();


								_dataGraficoLeads.labels.forEach(function(labelGrafico) {

									if (labelGrafico == _dataMask) {
										_dataGraficoLeads.datasets[0].data[_auxiliar]++;
									}

									_auxiliar++;
								});
							});

							fecharLoader();
							$scope.graficoLeads();
						});						
					}
				});
			});
		};
            			
		$scope.graficoLeads = function(dadosGrafico) {
			if (_graficoLeads)
				_graficoLeads.destroy();

			if (_total) {
				_dataTotalGraficoLeads = _dataGraficoLeads;
				_total = false;
			} 

			_dataGraficoLeads.datasets[0].axis = 0;
            _dataGraficoLeads.datasets[1].axis = 1;

			_graficoLeads = 
				new Chart(document.getElementById("graficoLeads").getContext("2d"))
					.MultiAxisLine(
						_dataGraficoLeads, 
						{
							scaleShowGridLines: true,
							responsive: true,
                        	drawScale: [0,1,2],
                        	drawScaleStroke: [0,1]
						});

			$scope.acessos = formatarValor($scope.acessos);
			$scope.visitantes = formatarValor($scope.visitantes);
			$scope.conversoes = formatarValor($scope.conversoes);

			fecharLoader();
		};

		$scope.filtroDiaSemanaMes = function(atualizar, diaSemanaMes) {
			if (diaSemanaMes != _diaSemanaMes) {
	            _diaSemanaMes = diaSemanaMes;

    	        if (_diaSemanaMes == "d") {

        	    	_diaSemanaMesGA = "ga:day,ga:month,ga:year";
            	    _ordenacaoDiaSemanaMesGA = "ga:year,ga:month,ga:day";

	            } else if (_diaSemanaMes == "s") {

    	            _diaSemanaMesGA = "ga:week"; 
        	        _ordenacaoDiaSemanaMesGA = "ga:week";

            	} else if (_diaSemanaMes == "m") {

                	_diaSemanaMesGA = "ga:month,ga:year"; 
	                _ordenacaoDiaSemanaMesGA = "ga:year,ga:month";

    	        }          

    	        if (atualizar)
            		$scope.retornarPaginasUnbouncePorUsuario();  
            }
        };

        $scope.abrirTela();
	});