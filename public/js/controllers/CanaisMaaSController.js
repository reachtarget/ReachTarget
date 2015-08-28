angular.module('reachtarget')
	.controller('CanaisMaaSController', function($resource, $scope, $location, LoginService) {


		$scope.listaTrafegoPorFonte = [];

        var options = {
            responsive: true,
            animation: true
        };


        var _dataInicialTrafegoFonte;
        var _dataFinalTrafegoFonte;
        var _valorClickGraficoCanaisPorFonte = 1;
        var atualizar = true;
        var aberturaDaTela = true;

        var dia = new Date();
        var mes = dia.getMonth();
        var diaDaSemana = dia.getDay();
        var dataAuxiliar = new Date();


        var GA = $resource('/ga/:objectId');
        var Leads = $resource('/lead/:objectId/:dataInicial/:dataFinal');
        var Vendas = $resource('/lead/vendas/:objectId/:dataInicial/:dataFinal');
        var ProjecaoMetrica = $resource('/projecao/:objectId/:dataInicial/:dataFinal/:metrica');
        var InvestimentoPorObjectIdVigencia = $resource('/investimento/:objectId/:vigencia/:vigenciaAuxiliar/:projetadoRealizado');


        var dataRoscaTabelaTrafegoPorFonte = [];

        var dataBarraEvolutivoTabelaTrafegoPorFonte = {
            labels: [],
            datasets: []
        };


		var graficoBarraEvolutivoTabelaTrafegoPorFonte = 
            new Chart(document.getElementById("chartEvolutivoTrafegoFonte").getContext("2d")).StackedBar(
                dataBarraEvolutivoTabelaTrafegoPorFonte, options);
    
        var graficoRoscaTabelaTrafegoPorFonte = 
            new Chart(document.getElementById("chartRoscaTrafegoFonte").getContext("2d")).Doughnut(
                dataRoscaTabelaTrafegoPorFonte, options);


		$(document).ready(function() {
			_metodoDeAtualizacao = function(){
				$scope.consultarTabelaTrafegoPorFonte(
                	$scope.graficosTabelaTrafegoPorFonte);
			};
		});


		$scope.retornarCorPorFonte = function(fonte){
            var _cor = "";

            switch (fonte) {
                case "Direta":
                    _cor = "#e74c3c";
                    break;
                case "E-mail":
                    _cor = "#f1c40f";
                    break;
                case "Referência":
                    _cor = "#2ecc71";
                    break;
                case "Orgânica":
                    _cor = "#3498db";
                    break;
                case "Social":
                    _cor = "#e67e22";
                    break;
                case "Outros":
                    _cor = "#95a5a6";
                    break;
                case "Adwords":
                    _cor = "#9b59b6";
                    break;
            }

            return _cor;
        };

        $scope.incluirPadroesListaTrafegoFonte = function(paramFonte, lista) {
            var _cor = $scope.retornarCorPorFonte(paramFonte);

            $scope.listaTrafegoPorFonte.push({
                "fonte": paramFonte,
                "acessos": 0,
                "taxaConversao": '0.0',
                "conversoes": 0,
                "taxaFechamento": '0.0',
                "vendas": 0,
                "valorVendas": 0,
                "roi": '0.0',
                "investimentos": 0,
                "cor": _cor
            });

            var _item = 
                {
                    label: paramFonte,
                    fillColor: _cor,
                    strokeColor: _cor,
                    highlightFill: _cor,
                    highlightStroke: _cor,
                    data: []
                };

            lista.forEach(function(i){
                _item.data.push(i);

            });

            dataBarraEvolutivoTabelaTrafegoPorFonte.datasets.push(_item);
        };

        $scope.incluirLabelsListaGrafico = function(callback) {
            var _listaDatas = [];

            dataBarraEvolutivoTabelaTrafegoPorFonte = {
                labels: [],
                datasets: []
            };

            var _auxiliarAtual = null;
            var _dataParaOsMeses = new Date(LoginService.DataInicial);
            var _dataAuxiliar = new Date(LoginService.DataInicial);
            
            var _dataFinal = new Date(LoginService.DataFinal);
            _dataFinal.setDate(new Number(LoginService.DataFinal.getDate() - 1));

            if ($scope.diaMesAno == "s") { 
                _auxiliarAtual = _dataParaOsMeses.getWeek();
            } else if ($scope.diaMesAno == "m") { 
                _auxiliarAtual = _dataParaOsMeses.getMonth();
            }

            while (true) { 
                if ($scope.diaMesAno == "d") {
                    _listaDatas.push(0);

                    dataBarraEvolutivoTabelaTrafegoPorFonte.labels.push(
                        lpad(_dataParaOsMeses.getDate(), 2) + "/" + 
                        lpad(new Number(_dataParaOsMeses.getMonth() + 1), 2) + "/" + 
                        _dataParaOsMeses.getFullYear());
                } else if ($scope.diaMesAno == "s") {
                    if (_auxiliarAtual != _dataParaOsMeses.getWeek()) { 
                        _listaDatas.push(0);

                        dataBarraEvolutivoTabelaTrafegoPorFonte.labels.push(
                            "Semana " + lpad(_auxiliarAtual, 2));

                        _auxiliarAtual = _dataParaOsMeses.getWeek();
                    }
                } else if ($scope.diaMesAno == "m") {
                    if (_auxiliarAtual != _dataParaOsMeses.getMonth()) { 
                        _listaDatas.push(0);

                        dataBarraEvolutivoTabelaTrafegoPorFonte.labels.push(
                            lpad(new Number(_dataAuxiliar.getMonth() + 1), 2) + "/" +
                            _dataAuxiliar.getFullYear());

                        _auxiliarAtual = _dataParaOsMeses.getMonth();
                        _dataAuxiliar = new Date(_dataParaOsMeses);
                    }
                }

                _dataParaOsMeses.setDate(new Number(_dataParaOsMeses.getDate() + 1));

                if (Date.parse(_dataParaOsMeses) > Date.parse(_dataFinal)) 
                {
                    _listaDatas.push(0);

                    if ($scope.diaMesAno == "d") {
                    	dataBarraEvolutivoTabelaTrafegoPorFonte.labels.push(
                        	lpad(_dataParaOsMeses.getDate(), 2) + "/" + 
                       	 	lpad(new Number(_dataParaOsMeses.getMonth() + 1), 2) + "/" + 
                        	_dataParaOsMeses.getFullYear());
                    }
                    if ($scope.diaMesAno == "s") {
                        dataBarraEvolutivoTabelaTrafegoPorFonte.labels.push(
                            "Semana " + lpad(_auxiliarAtual, 2));
                    } else if ($scope.diaMesAno == "m") {
                        dataBarraEvolutivoTabelaTrafegoPorFonte.labels.push(
                            lpad(new Number(_dataAuxiliar.getMonth() + 1), 2) + "/" +
                            _dataAuxiliar.getFullYear());
                    }

                    callback(_listaDatas);
                    break;
                }
            };
        };


        $scope.consultarTabelaTrafegoPorFonte = function(callback) {
            abrirLoader();

            var _i = 0;
            var _data = null;
            var _comparacao = "";
            var _vigencia = "";

            var _adwords = 0;
            var _referencia = 0;
            var _email = 0;
            var _social = 0;
            var _direta = 0;
            var _organica = 0;
            var _outros = 0;


            $scope.incluirLabelsListaGrafico(function(lista){
                $scope.listaTrafegoPorFonte = [];        

                $scope.incluirPadroesListaTrafegoFonte("Adwords", lista);
                $scope.incluirPadroesListaTrafegoFonte("Direta", lista);
                $scope.incluirPadroesListaTrafegoFonte("E-mail", lista);
                $scope.incluirPadroesListaTrafegoFonte("Orgânica", lista);
                $scope.incluirPadroesListaTrafegoFonte("Outros", lista);
                $scope.incluirPadroesListaTrafegoFonte("Referência", lista);
                $scope.incluirPadroesListaTrafegoFonte("Social", lista);
            });


            Leads
                .query({

                    objectId: LoginService.objectIdLogin,
                    dataInicial: _dataInicialTrafegoFonte,
                    dataFinal: _dataFinalTrafegoFonte

                }, function(resultadoLeads) {

                    resultadoLeads.forEach(function(lead) {
                        
                        $scope.listaTrafegoPorFonte.forEach(function(item) {
                            if (item.fonte == lead.origem) {
                                item.conversoes++;

                                if (lead.status == 4) {
                                    item.vendas++;
                                    item.valorVendas += lead.valorFechamento;
                                }
                            }
                        });

                        if ((_valorClickGraficoCanaisPorFonte == 2) || (_valorClickGraficoCanaisPorFonte == 3)) {
                        
                            _i = 0;

                            if ((lead.status == 4) && (_valorClickGraficoCanaisPorFonte == 3))
                                _data = new Date(lead.dataFechamento);
                            else 
                                _data = new Date(lead.data);   

                            _comparacao = "";

                            if ($scope.diaMesAno == "d") {
                                _comparacao = 
                                    lpad(_data.getDate(), 2) + "/" + 
                                    lpad(new Number(_data.getMonth() + 1), 2) + "/" + 
                                    _data.getFullYear();                            
                            } else if ($scope.diaMesAno == "s") {
                                _comparacao = 
                                    "Semana " + lpad(_data.getWeek(), 2);

                            } else if ($scope.diaMesAno == "m") {
                                _comparacao = 
                                    lpad(new Number(_data.getMonth() + 1), 2) + "/" +
                                    _data.getFullYear();
                            }

                            dataBarraEvolutivoTabelaTrafegoPorFonte.labels.forEach(function(label){
                                if (label == _comparacao) {
                                    var _auxiliar = new Number(_i);

                                    dataBarraEvolutivoTabelaTrafegoPorFonte.datasets.forEach(function(dataset){
                                        if (dataset.label == lead.origem) {

                                            if ((_valorClickGraficoCanaisPorFonte == 2) || ((_valorClickGraficoCanaisPorFonte == 3) && (lead.status == 4)))
                                                dataset.data[_auxiliar]++;
                                        }
                                    });  
                                }

                                _i++;
                            });                        
                        }
                    });
                });    

            
            var _dataAuxiliarInvestimento = new Date(_dataInicialTrafegoFonte);
            _dataAuxiliarInvestimento.setDate(1);

            while (true) {
                _vigencia = 
                    lpad(new Number(_dataAuxiliarInvestimento.getMonth() + 1), 2)  + "/" + 
                    _dataAuxiliarInvestimento.getFullYear();

                InvestimentoPorObjectIdVigencia.get({ 

                    objectId: LoginService.objectIdLogin,
                    vigencia: _vigencia,
                    vigenciaAuxiliar: _dataAuxiliarInvestimento,
                    projetadoRealizado: 'R' 

                }, function(resultadoRealizado) {
                    if (resultadoRealizado._id) {
                        $scope.popularValoresInvestimento("Adwords", resultadoRealizado.adwords);
                        $scope.popularValoresInvestimento("Direta", resultadoRealizado.direto);
                        $scope.popularValoresInvestimento("E-mail", resultadoRealizado.email);
                        $scope.popularValoresInvestimento("Referência", resultadoRealizado.referencia);
                        $scope.popularValoresInvestimento("Orgânica", resultadoRealizado.organica);
                        $scope.popularValoresInvestimento("Social", resultadoRealizado.social);
                        $scope.popularValoresInvestimento("Outros", resultadoRealizado.outros);
                    } else {
                        InvestimentoPorObjectIdVigencia.get({ 

                            objectId: LoginService.objectIdLogin,
                            vigencia: _vigencia,
                            vigenciaAuxiliar: _dataAuxiliarInvestimento,
                            projetadoRealizado: 'P' 

                        }, function(resultadoProjetado) {
                            $scope.popularValoresInvestimento("Adwords", resultadoProjetado.adwords);
                            $scope.popularValoresInvestimento("Direta", resultadoProjetado.direto);
                            $scope.popularValoresInvestimento("E-mail", resultadoProjetado.email);
                            $scope.popularValoresInvestimento("Referência", resultadoProjetado.referencia);
                            $scope.popularValoresInvestimento("Orgânica", resultadoProjetado.organica);
                            $scope.popularValoresInvestimento("Social", resultadoProjetado.social);
                            $scope.popularValoresInvestimento("Outros", resultadoProjetado.outros);
                        });
                    }
                });
                    

                _dataAuxiliarInvestimento.setDate(1);
                _dataAuxiliarInvestimento.setMonth(new Number(_dataAuxiliarInvestimento.getMonth() + 1));

                if (Date.parse(_dataAuxiliarInvestimento) > Date.parse($scope.dataFinalTrafegoFonte)) {
                    break;
                }
            }


            gapi.client.analytics.data.ga.get({
                'ids': $scope.idGA,
                'start-date': $scope.dataInicialTrafegoFonte,
                'end-date': $scope.dataFinalTrafegoFonte,
                'metrics': 'ga:sessions,ga:percentNewSessions',
                'dimensions': 'ga:socialNetwork,' + $scope.diaMesAnoGA,
                'sort': $scope.ordenacaoDiaMesAnoGA,
                'max-results': 10000
            })
            .execute(function(resultadoSocialNetwork) {
                var _i = 0;

                $scope.listaTrafegoPorFonte.forEach(function(dataset){
                    if (dataset.fonte == "Social") {
                        return;
                    }

                    _i++
                });

                resultadoSocialNetwork.rows.forEach(function(socialNetwork, index, lista){
                    var _comparacao = '';
                    var _campoValor = 0;

                    if (socialNetwork[0] != "(not set)") {
                        if ($scope.diaMesAno == "d") {
                            _comparacao = socialNetwork[1] + '/' + socialNetwork[2] + '/' + socialNetwork[3];
                            _campoValor = 4;
                        } else if ($scope.diaMesAno == "s") {
                            _comparacao = "Semana " + lpad(socialNetwork[1], 2);
                            _campoValor = 5;
                        } else if ($scope.diaMesAno == "m") {                                
                            _comparacao = socialNetwork[1] + '/' + socialNetwork[2];
                            _campoValor = 3;
                        }

                        $scope.listaTrafegoPorFonte[_i].acessos += new Number(socialNetwork[_campoValor]);

                        if (_valorClickGraficoCanaisPorFonte == 1) {
                            var _auxiliar = -1;                            

                            dataBarraEvolutivoTabelaTrafegoPorFonte.labels.forEach(function(label) {
                                _auxiliar++;

                                if (label == _comparacao) {
                                    var _novoValor = new Number(socialNetwork[_campoValor]);

                                    dataBarraEvolutivoTabelaTrafegoPorFonte.datasets[6].data[_auxiliar] += _novoValor;
                                }
                            }); 
                        }
                    }

                    if (index == lista.length - 1) {

                        gapi.client.analytics.data.ga.get({
                            'ids': $scope.idGA,
                            'start-date': $scope.dataInicialTrafegoFonte,
                            'end-date': $scope.dataFinalTrafegoFonte,
                            'metrics': 'ga:sessions',
                            'dimensions': 'ga:medium,' + $scope.diaMesAnoGA,
                            'sort': $scope.ordenacaoDiaMesAnoGA + ',ga:medium',
                            'max-results': 10000
                        })
                        .execute(function(resultadoAcessos){
                            if ($scope.diaMesAno == "d") {
                                _campoValor = 4;
                            } else if ($scope.diaMesAno == "s") {
                                _campoValor = 5;
                            } else if ($scope.diaMesAno == "m") {                                
                                _campoValor = 3;
                            }

                            var _fonte = "";
                            var _posicaoFonteNoGrafico = 0;

                            var _acessosSocial = 0;
                            
                            $scope.listaTrafegoPorFonte.forEach(function(dataset){
                                if (dataset.fonte == "Social") {
                                    _acessosSocial = dataset.acessos;
                                }
                            });                            

                            resultadoAcessos.rows.forEach(function(acessos, indexAcessos, listaAcessos){
                                switch (acessos[0]) {
                                        case "(none)":
                                            _fonte = "Direta";
                                            _posicaoFonteNoGrafico = 1;
                                            break;
                                        case "email":
                                            _fonte = "E-mail";
                                            _posicaoFonteNoGrafico = 2;
                                            break;
                                        case "organic":
                                            _fonte = "Orgânica";
                                            _posicaoFonteNoGrafico = 3;
                                            break;
                                        case "referral": 
                                            _fonte = "Referência";
                                            _posicaoFonteNoGrafico = 5;
                                            break;
                                        case "rss":
                                            _fonte = "Outros";
                                            _posicaoFonteNoGrafico = 4;
                                            break;
                                        case "cpc":
                                            _fonte = "Adwords";
                                            _posicaoFonteNoGrafico = 0;
                                            break;
                                        default:
                                            _fonte = "Outros";
                                            _posicaoFonteNoGrafico = 4;
                                    };

                                if (_valorClickGraficoCanaisPorFonte == 1) {
                                    var _auxiliar = -1;
                                    var _comparacao = '';

                                    if ($scope.diaMesAno == "d") {
                                        _comparacao = acessos[1] + '/' + acessos[2] + '/' + acessos[3];
                                    } else if ($scope.diaMesAno == "s") {
                                        _comparacao = "Semana " + lpad(acessos[1], 2);
                                    } else if ($scope.diaMesAno == "m") {                                
                                        _comparacao = acessos[1] + '/' + acessos[2];
                                    }

                                    dataBarraEvolutivoTabelaTrafegoPorFonte.labels.forEach(function(label) {
                                        _auxiliar++;

                                        if (label == _comparacao)
                                            dataBarraEvolutivoTabelaTrafegoPorFonte.datasets[_posicaoFonteNoGrafico].data[_auxiliar] += new Number(acessos[_campoValor]);
                                    });                                     
                                }

                                $scope.listaTrafegoPorFonte.forEach(function(dataset){
                                    if (dataset.fonte == _fonte) {
                                        dataset.acessos += new Number(acessos[_campoValor]);

                                        if (_fonte == "Referência") {
                                            dataset.acessos -= _acessosSocial;
                                            _acessosSocial = 0;
                                        }
                                    }
                                });

                                if (indexAcessos == listaAcessos.length - 1) {
                                    var _auxiliar = -1;

                                    dataBarraEvolutivoTabelaTrafegoPorFonte.labels.forEach(function(label){
                                        _auxiliar++;

                                        dataBarraEvolutivoTabelaTrafegoPorFonte.datasets[5].data[_auxiliar] = 
                                            dataBarraEvolutivoTabelaTrafegoPorFonte.datasets[5].data[_auxiliar] - 
                                            dataBarraEvolutivoTabelaTrafegoPorFonte.datasets[6].data[_auxiliar];
                                    });                                     


                                    $scope.listaTrafegoPorFonte.forEach(function(trafegoPorFonte, indextrafegoPorFonte, listatrafegoPorFonte){
                                        trafegoPorFonte.taxaConversao = 
                                            (trafegoPorFonte.acessos > 0) 
                                                ? ((trafegoPorFonte.conversoes / trafegoPorFonte.acessos) * 100).toFixed(1) 
                                                : '0.0';

                                        trafegoPorFonte.taxaFechamento = 
                                            (trafegoPorFonte.conversoes > 0) 
                                                ? ((trafegoPorFonte.vendas / trafegoPorFonte.conversoes) * 100).toFixed(1) 
                                                : '0.0';

                                        trafegoPorFonte.roi = 
                                            (trafegoPorFonte.investimentos > 0) 
                                                ? ((trafegoPorFonte.valorVendas / trafegoPorFonte.investimentos) * 100).toFixed(1) 
                                                : '0.0';

                                        if (indextrafegoPorFonte == listatrafegoPorFonte.length - 1) {
                                            $scope.$apply();

                                            callback();
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });
        };


        $scope.graficosTabelaTrafegoPorFonte = function() {
            $scope.graficoEvolutivoTabelaTrafegoPorFonte();
            $scope.graficoRoscaTabelaTrafegoPorFonte();
        };


        $scope.graficoEvolutivoTabelaTrafegoPorFonte = function() {
            fecharLoader();

            graficoBarraEvolutivoTabelaTrafegoPorFonte.destroy();

            graficoBarraEvolutivoTabelaTrafegoPorFonte = 
                new Chart(document.getElementById("chartEvolutivoTrafegoFonte").getContext("2d")).StackedBar(dataBarraEvolutivoTabelaTrafegoPorFonte, options);
        };


        $scope.graficoRoscaTabelaTrafegoPorFonte = function(colunaClick) {
            dataRoscaTabelaTrafegoPorFonte = [];

            var i = 0;
            var _valor = 0;
            var _cor = "";

            $scope.listaTrafegoPorFonte.forEach(function(item){
                _cor = $scope.retornarCorPorFonte(item.fonte);

                switch (_valorClickGraficoCanaisPorFonte ) {
                    case 1:
                        _valor = item.acessos;
                        $scope.textoGraficoRosca = "Acessos";
                        break;
                    case 2:
                        _valor = item.conversoes;
                        $scope.textoGraficoRosca = "Conversões";
                        break;
                    case 3:
                        _valor = item.vendas;
                        $scope.textoGraficoRosca = "Vendas";
                        break;
                    case 4:
                        _valor = item.investimentos;
                        $scope.textoGraficoRosca = "Investimentos";
                        break;
                }

                if (_valor > 0 ) {
                    dataRoscaTabelaTrafegoPorFonte.push({
                        value: _valor,
                        color: _cor,
                        highlight: _cor,
                        label: item.fonte
                    });
                }

                i++;
            });


            graficoRoscaTabelaTrafegoPorFonte.destroy();

            graficoRoscaTabelaTrafegoPorFonte = 
                new Chart(document.getElementById("chartRoscaTrafegoFonte").getContext("2d")).Doughnut(dataRoscaTabelaTrafegoPorFonte, options);

            $scope.$apply();
        };


        $scope.popularValoresInvestimento = function(paramFonte, paramValor) {
            $scope.listaTrafegoPorFonte.forEach(function(trafegoPorfonte) {
                if (trafegoPorfonte.fonte == paramFonte) {

                	var _valor = parseFloat(trafegoPorfonte.investimentos);

                    if (paramValor)
                        _valor += parseFloat(paramValor);

                    trafegoPorfonte.investimentos = _valor.toFixed(2);

                    return;
                }
            });
        };


        $scope.consultarTabelaTrafegoPorFonte(
        	$scope.graficosTabelaTrafegoPorFonte);
   	});
