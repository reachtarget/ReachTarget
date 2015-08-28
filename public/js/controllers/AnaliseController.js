angular.module('reachtarget')
	.controller('AnaliseController', function($resource, $scope, $location, LoginService) {
        $scope.filtroRealizado = "a";
        $scope.filtroComparacao = "l";
        $scope.filtroComparacaoOuProjecao = "p";
        $scope.exibirTaxas = false;
        $scope.inptuDataInicialFinal = "";
        $scope.tituloGrafico = "Realizado x Projetado";


        $scope.diaSemanaMes = "d";
		$scope.listaDiaSemanaMesSelecionada = [
      		{ sigla: 'd', descricao: 'Dia' }, 
      		{ sigla: 's', descricao: 'Semana' }, 
      		{ sigla: 'm', descricao: 'Mês' }];


        $scope.totalizadorAcessos = 0;
        $scope.totalizadorTaxaNovosAcessos = '0.0';

        $scope.totalizadorConversoes = 0;
        $scope.totalizadorTaxaDeConversao = '0.0';

        $scope.totalizadorVendas = 0;
        $scope.totalizadorTaxaDeFechamento = '0.0';

        $scope.totalizadorInvestimentos = 0;
        $scope.totalizadorROI = '0.0';


        $scope.idGA = "ga:";
        $scope.diaMesAnoGA = "ga:day,ga:month,ga:year";
        $scope.ordenacaoDiaMesAnoGA = "ga:year,ga:month,ga:day";
        

        var Leads = $resource('/lead/:objectId/:dataInicial/:dataFinal');
        var Vendas = $resource('/lead/vendas/:objectId/:dataInicial/:dataFinal');
        var ProjecaoMetrica = $resource('/projecao/:objectId/:dataInicial/:dataFinal/:metrica');
        var InvestimentoPorObjectIdVigencia = $resource('/investimento/:objectId/:vigencia/:vigenciaAuxiliar/:projetadoRealizado');
        var RefreshToken = $resource('/token/analytics/:accessToken/:refreshToken/:id');

        $scope.dataInicial = '';
        $scope.dataFinal = '';
        
        $scope.dataInicialFormatoDate = null;
        $scope.dataFinalFormatoDate = null;

        $scope.quantidadeMaximaResultados = 100;


        var _graficoProjetado = false;
        var _tipoConsultaRealizado = '';
        var _eixo = '1';

        var _dataAuxiliarRealizado = [];
        var _dataAuxiliarProjetado = [];
        var _dataAuxiliarEixoUm = [];
        var _dataAuxiliarEixoDois = [];

        semanaAuxiliar = null;
        var _semanaAtual = null;

        var _valorRealizado = 0;
        var _valorProjetado = 0;

        var _mes = null;
        var _ano = null;

        var _dataAtual = null;
        var _dataLeadVenda = null;

        var _itemProjetado = null;     
        var _diferencaDatas = 0;  

    
        var options = {
            responsive: true,
            animation: true,
            scaleShowLabels: true
        };


        var dadosGraficoRealizadoComparativoProjetado = [];

        var listaDadosProjetados = [];

        var graficoRealizadoComparativoProjetado = null;
        //    new Chart(document.getElementById("chartRealizadoComparativoProjetado").getContext("2d")).Line(dadosGraficoRealizadoComparativoProjetado, options);


        var atualizar = true;
        var aberturaDaTela = true;

        var dia = new Date();
        var mes = dia.getMonth();
        var diaDaSemana = dia.getDay();
        var dataAuxiliar = new Date();


        $(document).ready(function() {
            if (LoginService.DataInicial) {
                $scope.dataInicialFormatoDate = LoginService.DataInicial;
                $scope.dataInicial = LoginService.DataInicialFormat;
                
                $scope.dataFinalFormatoDate = LoginService.DataFinal;
                $scope.dataFinal = LoginService.DataFinalFormat;
            } else {
                $scope.dataInicialFormatoDate = moment().startOf('week')._d;
                $scope.dataInicial = moment().startOf('week').format('YYYY-MM-DD');

                $scope.dataFinalFormatoDate = moment().endOf('week')._d;
                $scope.dataFinal = moment().endOf('week').format('YYYY-MM-DD');
            }            
            
            $scope.inptuDataInicialFinal = 
                retornarDataInicialFinal(
                    $scope.dataInicialFormatoDate, 
                    $scope.dataFinalFormatoDate);


            $('#daterange').daterangepicker({
                format: 'YYYY-MM-DD',
                startDate: $scope.dataInicial,
                endDate: $scope.dataFinal,
                ranges: {
                    'Hoje': [moment(), moment()],
                    'Ontem': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Esta semana': [moment().startOf('week'), moment().endOf('week')],
                    'Semana passada': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
                    'Últimos 7 dias': [moment().subtract(6, 'days'), moment()],
                    'Últimos 30 dias': [moment().subtract(29, 'days'), moment()],
                    'Este mês': [moment().startOf('month'), moment().endOf('month')],
                    'Mês passado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, 
            function(start, end, label) {
                $scope.dataInicialFormatoDate = start._d;
                $scope.dataInicial = start.format('YYYY-MM-DD');

                LoginService.DataInicial = $scope.dataInicialFormatoDate;
                LoginService.DataInicialFormat = $scope.dataInicial;


                $scope.dataFinalFormatoDate = end._d;
                $scope.dataFinal = end.format('YYYY-MM-DD');

                LoginService.DataFinal = $scope.dataFinalFormatoDate;
                LoginService.DataFinalFormat = $scope.dataFinal;

                $scope.inptuDataInicialFinal = 
                    retornarDataInicialFinal(start._d, end._d);


                $scope.atualizarDadosSuperiores();
            });
        });

        $scope.abrirTela = function() {
            abrirLoader();
            
            $scope.idGA += LoginService.tokenGoogle.profileId;            
            $scope.validarGAPI(true);
        };

        $scope.validarGAPI = function(token) {
            if (token) {
                gapi.client.setApiKey(LoginService.ApiKey);

                gapi.auth.setToken({
                    access_token: LoginService.tokenGoogle.accessToken
                });
            }   

            gapi.client.load('analytics', 'v3', function(){
                var _data = new Date();
                var _dataTesteGA = _data.getFullYear() + "-" + lpad(new Number(_data.getMonth() + 1), 2) + "-" + lpad(_data.getDate(), 2);

                gapi.client.analytics.data.ga.get({
                    'ids': $scope.idGA,
                    'start-date': _dataTesteGA,
                    'end-date': _dataTesteGA,
                    'metrics': 'ga:sessions',
                })
                .execute(function(resultado) {   
                    if ((resultado.code) && (resultado.code == 401)) {
                        $scope.refreshToken();
                    } else {
                        $scope.atualizarDadosSuperiores();
                    }
                });
            });     
        };

        $scope.refreshToken = function() {
            RefreshToken.get({

                accessToken: LoginService.tokenGoogle.accessToken,
                refreshToken: LoginService.tokenGoogle.refreshToken,
                id: LoginService.tokenGoogle._id

            }, function(resRefreshToken){
                if (resRefreshToken.accessToken) {
                    LoginService.tokenGoogle.accessToken = resRefreshToken.accessToken;
                    LoginService.tokenGoogle.refreshToken = resRefreshToken.refreshToken;
                }

                gapi.client.setApiKey(LoginService.ApiKey);

                gapi.auth.setToken({
                    access_token: LoginService.tokenGoogle.accessToken
                });

                setTimeout(function() {
                    $scope.validarGAPI(false);  
                },
                5000);    
            });
        };

        $scope.clickFiltroRealizado = function() {
            switch ($scope.filtroRealizado) {
                case "a":
                    $scope.filtroComparacao = "l";
                    break;
                case "l":
                    $scope.filtroComparacao = "v";
                    break;
                case "v":
                    $scope.filtroComparacao = "i";
                    break;
                case "i":
                    $scope.filtroComparacao = "a";
                    break;
            }
        },

        $scope.clickRealizadoProjecao = function(){
            if ($scope.filtroComparacaoOuProjecao == "p")
                $scope.filtroComparacao = null;
            else {
                $scope.clickFiltroRealizado();
            }
        },

        $scope.atualizarDadosSuperiores = function() {
            abrirLoader();
            
            $scope.quadroDeResumoAcessos();

            if ($scope.filtroComparacaoOuProjecao == 'c') {
				$scope.graficoComparativo();
				$scope.tituloGrafico = "Comparativo";
            }                
            else  {
            	$scope.graficoRealizadoComparativoProjetado();
            	$scope.tituloGrafico = "Realizado x Projetado";
            }
        },

        $scope.filtroDiaMesAno = function(consultar) {
            if ($scope.diaSemanaMes == "d") {
                $scope.diaMesAnoGA = "ga:day,ga:month,ga:year";
                $scope.ordenacaoDiaMesAnoGA = "ga:year,ga:month,ga:day";
            } else if ($scope.diaSemanaMes == "s") {
                $scope.diaMesAnoGA = "ga:week,ga:day,ga:month,ga:year"; 
                $scope.ordenacaoDiaMesAnoGA = "ga:year,ga:month,ga:day,ga:week";
            } else if ($scope.diaSemanaMes == "m") {
                $scope.diaMesAnoGA = "ga:month,ga:year"; 
                $scope.ordenacaoDiaMesAnoGA = "ga:year,ga:month";
            }

            if (consultar) {
                abrirLoader();

                if ($scope.filtroComparacaoOuProjecao == 'c')
                    $scope.graficoComparativo();
                else 
                    $scope.graficoRealizadoComparativoProjetado();
            }
        },

        $scope.zerarDadosResumo = function() {
            $scope.totalizadorAcessos = 0;
            $scope.totalizadorTaxaNovosAcessos = '0.0';
            $scope.totalizadorConversoes = 0;
            $scope.totalizadorTaxaDeConversao = '0.0';
            $scope.totalizadorVendas = 0;
            $scope.totalizadorTaxaDeFechamento = '0.0';
            $scope.totalizadorInvestimentos = 0;
            $scope.totalizadorROI = '0.0';
        },

        $scope.quadroDeResumoAcessos = function() {
            $scope.zerarDadosResumo();
            var _valorTotalVendas = 0;

            gapi.client.analytics.data.ga.get({
                'ids': $scope.idGA,
                'start-date': $scope.dataInicial,
                'end-date': $scope.dataFinal,
                'metrics': 'ga:sessions,ga:percentNewSessions',
                'max-results': $scope.quantidadeMaximaResultados
            })
            .execute(function(resultado){
                $scope.totalizadorAcessos = resultado.rows[0][0];
                $scope.totalizadorTaxaNovosAcessos = parseFloat(resultado.rows[0][1].replace(",", ".")).toFixed(1);

                Vendas.query({
                    objectId: LoginService.objectIdLogin,
                    dataInicial: $scope.dataInicialFormatoDate,
                    dataFinal: $scope.dataFinalFormatoDate
                }, function(resultado){
                    resultado.forEach(function(item, index, array) {
                        $scope.totalizadorVendas++;
                        _valorTotalVendas += item.valorFechamento;
                    });
                });

                Leads.query({
                    objectId: LoginService.objectIdLogin,
                    dataInicial: $scope.dataInicialFormatoDate,
                    dataFinal: $scope.dataFinalFormatoDate
                }, function(resultado) {
                    if (resultado.length > 0) {
                        resultado.forEach(function(item, index, array) {
                            $scope.totalizadorConversoes++;

                            if (index == array.length-1) {
                                if ($scope.totalizadorAcessos > 0) {
                                    $scope.totalizadorTaxaDeConversao = 
                                        (($scope.totalizadorConversoes / $scope.totalizadorAcessos) * 100).toFixed(1);
                                }

                                if ($scope.totalizadorConversoes > 0) {
                                    $scope.totalizadorTaxaDeFechamento = 
                                        (($scope.totalizadorVendas / $scope.totalizadorConversoes) * 100).toFixed(1);
                                }
                            }
                        });
                    }
                });

                var _listaAuxiliarTotalInvestimento = [];
                var _dataAuxiliar = new Date($scope.dataInicialFormatoDate);

                var _ultimoDia = 0;
                var _valorInvestimento = 0;                
                var _valorProjetado = 0
                var _valorProjetadoDiario = 0
                var _valorRealizado = 0
                var _valorRealizadoDiario = 0
                var _itemProjetadoAuxiliar = 0;
                
                var _vigencia = null;
                var _mesInvestimento = null;
                var _anoInvestimento = null;

                while (true) {
                    _vigencia = lpad(new Number(_dataAuxiliar.getMonth() + 1), 2) + "/" + _dataAuxiliar.getFullYear();

                    _listaAuxiliarTotalInvestimento.push({
                        "vigencia": _vigencia,
                        "valor": 0
                    });

                    _dataAuxiliar.setMonth(_dataAuxiliar.getMonth() + 1);                    

                    if (Date.parse(_dataAuxiliar) > Date.parse($scope.dataFinalFormatoDate))
                        break;
                }

                _listaAuxiliarTotalInvestimento.forEach(function(item, index, array) {

                    _dataAuxiliar = 
                        new Date(new Number(item.vigencia.substr(3,4)), new Number(item.vigencia.substr(0,2) - 1), 1);

                    _ultimoDia = new Date(_dataAuxiliar);
                    _ultimoDia.setMonth(_ultimoDia.getMonth()+1);
                    _ultimoDia.setDate(0);
                    _ultimoDia = _ultimoDia.getDate();

                    InvestimentoPorObjectIdVigencia.get({ 
                        objectId: LoginService.objectIdLogin,
                        vigencia: item.vigencia,
                        vigenciaAuxiliar: _dataAuxiliar,
                        projetadoRealizado: 'R' }, function(realizado) {
                            if (realizado._id) {
                                _valorRealizado = 
                                    realizado.adwords + realizado.social + realizado.email + 
                                    realizado.direto + realizado.organica + realizado.referencia + 
                                    realizado.outros;

                                    item.valor = parseFloat((_valorRealizado / _ultimoDia).toFixed(0));
                                }
                            else {
                                InvestimentoPorObjectIdVigencia.get({ 
                                    objectId: LoginService.objectIdLogin,
                                    vigencia: item.vigencia,
                                    vigenciaAuxiliar: _dataAuxiliar,
                                    projetadoRealizado: 'P' }, function(projetado) {
                                        if (projetado._id) {
                                            _valorProjetado = 
                                                projetado.adwords + projetado.social + projetado.email + 
                                                projetado.direto + projetado.organica + projetado.referencia + 
                                                projetado.outros;

                                            item.valor = parseFloat((_valorProjetado / _ultimoDia).toFixed(0));
                                        } else
                                            item.valor = 0;              
                                });
                            }
                        });
                    
                    if (index == array.length-1) {
                        setTimeout(function(){

                            _diferencaDatas = 
                                diferencaDatas($scope.dataInicialFormatoDate, $scope.dataFinalFormatoDate);

                            var data = new Date($scope.dataInicialFormatoDate);
                            data.setDate(data.getDate() - 1);

                            for (var i = 0; i <= _diferencaDatas; ++i) {
                                data.setDate(data.getDate() + 1);
                            
                                if (_mesInvestimento != (data.getMonth() + 1)) {
                                    _mesInvestimento = (data.getMonth() + 1);
                                    _anoInvestimento = data.getFullYear();

                                    _listaAuxiliarTotalInvestimento.forEach(function(itemDenovo){
                                        if ((new Number(itemDenovo.vigencia.substr(0,2)) == _mesInvestimento) && (new Number(itemDenovo.vigencia.substr(3,4)) == _anoInvestimento)) {
                                            _itemProjetadoAuxiliar = itemDenovo;
                                        }
                                    });
                                }

                                $scope.totalizadorInvestimentos += 
                                    parseFloat(_itemProjetadoAuxiliar.valor);

                                if (i == _diferencaDatas) {
                                    $scope.totalizadorInvestimentos = 
                                        $scope.totalizadorInvestimentos.toFixed(2);

                                    if ($scope.totalizadorInvestimentos > 0) {
                                        $scope.totalizadorROI = 
                                            ((_valorTotalVendas / $scope.totalizadorInvestimentos) * 100).toFixed(1);
                                    }

                                    $scope.$apply();
                                }
                            }

                        }, 
                        500);
                    }
                });
            });
        },

        $scope.graficoComparativo = function(){
            dadosGraficoRealizadoComparativoProjetado = {
                labels: [],
                datasets: [] };

            _graficoProjetado = false;
            _dataAuxiliarEixoUm = [];
            _dataAuxiliarEixoDois = [];

            for (var i = 1; i <= 2; ++i) {
                _eixo = i.toString();    

                if (i == 1) 
                    _tipoConsultaRealizado = $scope.filtroRealizado;
                else 
                    _tipoConsultaRealizado = $scope.filtroComparacao;

                if (_tipoConsultaRealizado == 'i') {
                    $scope.consultarGraficoProjetado(null, _eixo, (i == 1) ? _dataAuxiliarEixoUm : _dataAuxiliarEixoDois);
                }
                else {
                    $scope.consultarDadosRealizado(
                        _eixo,
                        (i == 1) ? _dataAuxiliarEixoUm : _dataAuxiliarEixoDois);
                }
            }

            
            var timer = setInterval(function() {
                if ((_dataAuxiliarEixoUm.length > 0) && (_dataAuxiliarEixoDois.length > 0)) {
                    clearTimeout(timer);

                    var _dataTaxas = [];

                    var _um = [];
                    var _dois = [];

                    _dataAuxiliarEixoUm.forEach(function(item){
                        try {
                            _um.push(parseFloat(item).toFixed(0));
                        }
                        catch(err) {
                            _um.push(parseFloat(item.toFixed(0)));
                         }
                    });

                    _dataAuxiliarEixoDois.forEach(function(item){
                        try {
                            _dois.push(parseFloat(item).toFixed(0));
                        }
                        catch(err) {
                            _dois.push(parseFloat(item.toFixed(0)));
                         }
                    });

                    dadosGraficoRealizadoComparativoProjetado.datasets.push({
                        axis: 0,
                        label: "Realizado",
                        type: "bar",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: _um
                    });

                    dadosGraficoRealizadoComparativoProjetado.datasets.push({
                        axis: 1,
                        label: "Projetado",
                        type: "bar",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: _dois
                    });
                    

                    if (graficoRealizadoComparativoProjetado)
                        graficoRealizadoComparativoProjetado.destroy();

                    fecharLoader();

                    if ($scope.exibirTaxas) {
                        for (var i = 0; i <= _dataAuxiliarEixoUm.length-1; ++i) {
                            if (_dataAuxiliarEixoDois[i] > 0 )
                                _dataTaxas.push((_dataAuxiliarEixoUm[i] / _dataAuxiliarEixoDois[i]).toFixed(1));
                            else 
                                _dataTaxas.push(_dataAuxiliarEixoUm[i]);
                        };

                        dadosGraficoRealizadoComparativoProjetado.datasets.push({
                            label: "Projetado",
                            type: "line",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: _dataTaxas
                        });

                        graficoRealizadoComparativoProjetado = 
                            new Chart(document.getElementById("chartRealizadoComparativoProjetado").getContext("2d"))
                                .LineBar(dadosGraficoRealizadoComparativoProjetado, options);
                    } else {
                        dadosGraficoRealizadoComparativoProjetado.datasets[0].axis = 1;
                        dadosGraficoRealizadoComparativoProjetado.datasets[1].axis = 0;

                        graficoRealizadoComparativoProjetado = 
                            new Chart(document.getElementById("chartRealizadoComparativoProjetado").getContext("2d"))
                                .MultiAxisLine(dadosGraficoRealizadoComparativoProjetado, {
                                    responsive: true,
                                    drawScale: [0,1,2],
                                    drawScaleStroke: [0,1]
                                });
                    }                    
                }
            },
            500);
        },

        $scope.graficoRealizadoComparativoProjetado = function() {
            _eixo = '1';
            _graficoProjetado = true;
            _tipoConsultaRealizado = $scope.filtroRealizado;

            $scope.consultarGraficoProjetado(
                $scope.consultarDadosRealizado, 
                _eixo,
                null);
        },

        $scope.consultarDadosRealizado = function(paramEixo, paramLista) {
            _dataAuxiliarRealizado = [];
            _dataAuxiliarProjetado = [];

            _semanaAuxiliar = null;
            _semanaAtual = null;

            _valorRealizado = 0;
            _valorProjetado = 0;

            _mes = null;
            _ano = null;

            _dataAtual = null;
            _dataLeadVenda = null;

            _itemProjetado = null;     
            _diferencaDatas = 0;  

            if (_graficoProjetado) {
                dadosGraficoRealizadoComparativoProjetado = {
                    labels: [],
                    datasets: []
                };
            }

            if (_tipoConsultaRealizado == "a") {
                gapi.client.analytics.data.ga.get({
                    'ids': $scope.idGA,
                    'start-date': $scope.dataInicial,
                    'end-date': $scope.dataFinal,
                    'metrics': 'ga:sessions',
                    'dimensions': $scope.diaMesAnoGA,
                    'max-results': $scope.quantidadeMaximaResultados,
                    'sort': $scope.ordenacaoDiaMesAnoGA,
                })
                .execute(function(resultado) {
                    resultado.rows.forEach(function(itemAtual){
                        if ($scope.diaSemanaMes == "d") {
                            if (paramEixo == '1') 
                                dadosGraficoRealizadoComparativoProjetado.labels.push(
                                    itemAtual[0] + "/" + itemAtual[1] + "/" + itemAtual[2]);

                            if (_graficoProjetado)
                                _dataAuxiliarRealizado.push(itemAtual[3]);
                            else {
                                paramLista.push(itemAtual[3]);
                            }

                            _itemProjetado = null;

                            listaDadosProjetados.forEach(function(itemProjetado){
                                _mes = (new Number(itemAtual[1]) - 1);
                                _ano = itemAtual[2];

                                if ((itemProjetado.mes == _mes) && (itemProjetado.ano == _ano)) {
                                    _itemProjetado = itemProjetado;
                                }
                            });

                            if (_itemProjetado)
                                _dataAuxiliarProjetado.push(_itemProjetado.valorDiario);
                            else 
                                _dataAuxiliarProjetado.push(0);

                        } else if ($scope.diaSemanaMes == "s") {
                            _semanaAtual = itemAtual[0];

                            if (!_semanaAuxiliar)
                                _semanaAuxiliar = itemAtual[0];

                            if (_semanaAuxiliar != itemAtual[0]){
                                if (paramEixo == '1')
                                    dadosGraficoRealizadoComparativoProjetado.labels.push("Semana " + itemAtual[0]);

                                _semanaAuxiliar = itemAtual[0];

                                if (_graficoProjetado)
                                    _dataAuxiliarRealizado.push(_valorRealizado);
                                else {
                                    paramLista.push(_valorRealizado);
                                }
                                
                                _dataAuxiliarProjetado.push(_valorProjetado);

                                _valorRealizado = 0;
                                _valorProjetado = 0;
                            }

                            _valorRealizado += new Number(itemAtual[4]);
                            _itemProjetado = null;

                            listaDadosProjetados.forEach(function(itemProjetado){
                                _mes = (new Number(itemAtual[2]) - 1);
                                _ano = itemAtual[3];

                                if ((itemProjetado.mes == _mes) && (itemProjetado.ano == _ano)) {
                                    _itemProjetado = itemProjetado;
                                }
                            });

                            if (_itemProjetado) 
                                _valorProjetado += new Number(_itemProjetado.valorDiario);    
                            else
                                _valorProjetado += 0;
                        } else if ($scope.diaSemanaMes == "m") {
                            if (paramEixo == '1')
                                dadosGraficoRealizadoComparativoProjetado.labels.push(
                                    itemAtual[0] + "/" + itemAtual[1]);

                            if (_graficoProjetado)
                                _dataAuxiliarRealizado.push(itemAtual[2]);
                            else {
                                paramLista.push(itemAtual[2]);
                            }                            

                            _itemProjetado = null;

                            listaDadosProjetados.forEach(function(itemProjetado){
                                _mes = (new Number(itemAtual[0]) - 1);
                                _ano = itemAtual[1];

                                if ((itemProjetado.mes == _mes) && (itemProjetado.ano == _ano)) {
                                    _itemProjetado = itemProjetado;
                                }
                            });

                            if (_itemProjetado)
                                _dataAuxiliarProjetado.push(_itemProjetado.valorMensal);
                            else 
                                _dataAuxiliarProjetado.push(0);
                        }
                    });

                    if ($scope.diaSemanaMes == "s") {
                        if (paramEixo == '1')
                            dadosGraficoRealizadoComparativoProjetado.labels.push("Semana " + _semanaAtual);
                        
                        if (_graficoProjetado)
                            _dataAuxiliarRealizado.push(_valorRealizado);
                        else {
                            paramLista.push(_valorRealizado);
                        }
                        
                        _dataAuxiliarProjetado.push(_valorProjetado);
                    }

                    if (_graficoProjetado)
                        $scope.popularGraficoProjetado(_dataAuxiliarRealizado, _dataAuxiliarProjetado, paramEixo);
                });
            } else if (_tipoConsultaRealizado == "l") {
                Leads
                    .query({
                        objectId: LoginService.objectIdLogin,
                        dataInicial: $scope.dataInicialFormatoDate,
                        dataFinal: $scope.dataFinalFormatoDate
                    }, function(resultadoLeads) {
                        $scope.popularDadosLeadsVendasProjetadoRealizado(resultadoLeads, paramLista, paramEixo);
                    });

            } else if (_tipoConsultaRealizado == "v") {
                Vendas
                    .query({
                        objectId: LoginService.objectIdLogin,
                        dataInicial: $scope.dataInicialFormatoDate,
                        dataFinal: $scope.dataFinalFormatoDate
                    }, function(resultadoVendas) {
                        $scope.popularDadosLeadsVendasProjetadoRealizado(resultadoVendas, paramLista, paramEixo);
                    });
            }
        },

        $scope.popularDadosLeadsVendasProjetadoRealizado = function(resultado, paramLista, paramEixo){
            _dataAuxiliarRealizado = [];
            _dataAuxiliarProjetado = [];

            _semanaAuxiliar = null;
            _semanaAtual = null;

            _valorRealizado = 0;
            _valorProjetado = 0;

            _mes = null;
            _ano = null;

            _dataAtual = null;
            _dataLeadVenda = null;

            _itemProjetado = null;     
            _diferencaDatas = 0;  

            _diferencaDatas = 
                diferencaDatas($scope.dataInicialFormatoDate, $scope.dataFinalFormatoDate);

            var data = new Date($scope.dataInicialFormatoDate);
            data.setDate(data.getDate() - 1);

            for (var i = 0; i <= _diferencaDatas; ++i) {
                data.setDate(data.getDate() + 1);

                if (_mes != (data.getMonth() + 1)) {
                    _mes = (data.getMonth() + 1);
                    _ano = data.getFullYear();

                    listaDadosProjetados.forEach(function(item){
                        if ((item.mes == _mes) && (item.ano == _ano)) {
                            _itemProjetado = item;
                        }
                    });
                }

                _dataAtual = new Date(data.getFullYear(), data.getMonth(), data.getDate());                            

                resultado.forEach(function(lead){
                    var _auxiliar;

                    if (lead.status == 4) {
                        _auxiliar = new Date(lead.dataFechamento);   
                    } else {
                        _auxiliar = new Date(lead.data);   
                    }
                     
                    _dataLeadVenda = new Date(_auxiliar.getFullYear(), _auxiliar.getMonth(), _auxiliar.getDate());

                    if (Date.parse(_dataAtual) == Date.parse(_dataLeadVenda))
                        _valorRealizado++;
                });

                if ($scope.diaSemanaMes == "d") {
                    if (paramEixo == '1')
                        dadosGraficoRealizadoComparativoProjetado.labels.push(
                            data.getDate() + "/" + new Number(data.getMonth() + 1) + "/" + data.getFullYear());

                    if (_graficoProjetado)
                        _dataAuxiliarRealizado.push(_valorRealizado);
                    else {
                        paramLista.push(_valorRealizado);
                    }
                    
                    if (_itemProjetado)
                        _dataAuxiliarProjetado.push(_itemProjetado.valorDiario);
                    else 
                        _dataAuxiliarProjetado.push(0);

                    _valorRealizado = 0;
                }
                else if ($scope.diaSemanaMes == "s") {                               
                    if (!_semanaAtual)
                        _semanaAtual = data.getWeek();

                    if (_semanaAtual != data.getWeek()) {
                        if (paramEixo == '1')
                            dadosGraficoRealizadoComparativoProjetado.labels.push("Semana " + _semanaAtual);

                        _semanaAtual = data.getWeek();

                        if (_graficoProjetado)
                            _dataAuxiliarRealizado.push(new Number(_valorRealizado));
                        else {
                            paramLista.push(new Number(_valorRealizado));
                        }
                        
                        _dataAuxiliarProjetado.push(_valorProjetado.toFixed(2));

                        _valorRealizado = 0;
                        _valorProjetado = 0;
                    }

                    if (_itemProjetado)
                        _valorProjetado += new Number(_itemProjetado.valorDiario);
                    else 
                        _valorProjetado += 0;
                }
                else if ($scope.diaSemanaMes == "m") {
                    if (!_semanaAtual)
                        _semanaAtual = data.getMonth();

                    if (_semanaAtual != data.getMonth()) {
                        if (paramEixo == '1')
                            dadosGraficoRealizadoComparativoProjetado.labels.push(
                                lpad(new Number(data.getMonth()), 2) + "/" +
                                data.getFullYear());

                        _semanaAtual = data.getMonth();

                        if (_graficoProjetado)
                            _dataAuxiliarRealizado.push(new Number(_valorRealizado));
                        else {
                            paramLista.push(new Number(_valorRealizado));
                        }
                        
                        _dataAuxiliarProjetado.push(_valorProjetado);

                        _valorRealizado = 0;
                    }

                    _valorProjetado = _itemProjetado.valorMensal;
                }
            }

            if ($scope.diaSemanaMes == "s") {
                if (paramEixo == '1')
                    dadosGraficoRealizadoComparativoProjetado.labels.push("Semana " + _semanaAtual);
                    
                if (_graficoProjetado)
                    _dataAuxiliarRealizado.push(_valorRealizado);
                else {
                    paramLista.push(_valorRealizado);
                }
                
                _dataAuxiliarProjetado.push(_valorProjetado);
            } else if ($scope.diaSemanaMes == "m") {
                if (paramEixo == '1')
                    dadosGraficoRealizadoComparativoProjetado.labels.push(
                        lpad(new Number(data.getMonth() + 1), 2) + "/" +
                        data.getFullYear());

                if (_graficoProjetado)
                    _dataAuxiliarRealizado.push(new Number(_valorRealizado));
                else {
                    paramLista.push(new Number(_valorRealizado));
                }
                
                _dataAuxiliarProjetado.push(_itemProjetado.valorMensal);
            }

            if (_graficoProjetado)  
                $scope.popularGraficoProjetado(_dataAuxiliarRealizado, _dataAuxiliarProjetado);
        },
        

        $scope.popularGraficoProjetado = function(dadosRealizados, dadosProjetados){
            var _real = [];
            var _proj = [];


            dadosRealizados.forEach(function(real){
                try {
                    _real.push(parseFloat(real).toFixed(0));
                }
                catch(err) {
                    _real.push(parseFloat(real.toFixed(0)));
                }
            });

            dadosProjetados.forEach(function(proj){
                try {
                    _proj.push(parseFloat(proj).toFixed(0));
                }
                catch(err) {
                    _proj.push(parseFloat(proj.toFixed(0)));
                }
            });


            dadosGraficoRealizadoComparativoProjetado.datasets.push({
                label: "Realizado",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: _real
            });

            dadosGraficoRealizadoComparativoProjetado.datasets.push({
                label: "Projetado",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: _proj
            });


            if (graficoRealizadoComparativoProjetado)
                graficoRealizadoComparativoProjetado.destroy();

            fecharLoader();


            graficoRealizadoComparativoProjetado = 
                new Chart(document.getElementById("chartRealizadoComparativoProjetado").getContext("2d"))
                    .Line(dadosGraficoRealizadoComparativoProjetado, options);
        },

        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        },

        $scope.consultarGraficoProjetado = function(callback, paramEixo, paramLista) {
            if (_tipoConsultaRealizado != "i") {
                var _metrica = "";
                var _toFixed = 0;

                var _dataInicialParaFiltro = 
                    new Date(
                        $scope.dataInicialFormatoDate.getFullYear(),  
                        $scope.dataInicialFormatoDate.getMonth(), 1);

                var _dataFinalParaFiltro = 
                    new Date(
                        $scope.dataFinalFormatoDate.getFullYear(),  
                        $scope.dataFinalFormatoDate.getMonth() + 1, 1);

                if (_tipoConsultaRealizado == "a") 
                {
                    _toFixed = 0;
                    _metrica = "acessos";
                }
                else {
                    _toFixed = 2;                    
                    _metrica = 
                        (_tipoConsultaRealizado == "v") 
                            ? "vendas"
                            : "leads";
                }


                listaDadosProjetados = [];

                ProjecaoMetrica
                    .query({
                        objectId: LoginService.objectIdLogin,
                        dataInicial: _dataInicialParaFiltro,
                        dataFinal: _dataFinalParaFiltro,
                        metrica: _metrica
                    }, function(resultadoProjecaoMetrica) {
                        if (resultadoProjecaoMetrica.length > 0) {

                            resultadoProjecaoMetrica.forEach(function(item, index, array){
                                var _vigencia = new Date(item.vigencia);
                                var _quantidadeDiasMes = new Date(_vigencia.getFullYear(), _vigencia.getMonth() + 1, 0).getDate();                            
                                var _mediaPorDia = parseFloat((item.valor / _quantidadeDiasMes).toFixed(0));

                                listaDadosProjetados.push({ 
                                    "mes": _vigencia.getMonth(),
                                    "ano": _vigencia.getFullYear(),
                                    "valorMensal": item.valor.toFixed(0),
                                    "valorDiario": _mediaPorDia.toFixed(_toFixed)
                                });

                                if (index == array.length-1)
                                    callback(_eixo);
                            });                        
                        } else {
                            callback(_eixo);
                        }
                    });
            } else {
                var _vigencia = "";
                var _dataAuxiliar = new Date($scope.dataInicialFormatoDate);
                var _listaAuxiliarMeses = [];
                var _lista = [];

                var _ultimoDia = 0;
                var _valorProjetado = 0;
                var _valorProjetadoDiario = 0;

                var _mesInvestimento = null;
                var _anoInvestimento = null;

                _semanaAtual = null;

                _dataAuxiliarProjetado = [];
                _dataAuxiliarRealizado = [];

                if (_graficoProjetado) {
                    dadosGraficoRealizadoComparativoProjetado = {
                        labels: [],
                        datasets: []
                    };
                }

                while (true) {
                    _vigencia = lpad(new Number(_dataAuxiliar.getMonth() + 1), 2) + "/" + _dataAuxiliar.getFullYear();

                    _listaAuxiliarMeses.push({
                        "vigencia": _vigencia,
                        "valorRealizado": 0,
                        "valorRealizadoDiario": 0,
                        "valorProjetado": 0,
                        "valorProjetadoDiario": 0
                    });

                    _dataAuxiliar.setMonth(_dataAuxiliar.getMonth() + 1);                    

                    if (Date.parse(_dataAuxiliar) > Date.parse($scope.dataFinalFormatoDate))
                        break;
                }

                _listaAuxiliarMeses.forEach(function(item){
                    _dataAuxiliar = 
                        new Date(new Number(item.vigencia.substr(3,4)), new Number(item.vigencia.substr(0,2) - 1), 1);

                    _ultimoDia = new Date(_dataAuxiliar);
                    _ultimoDia.setMonth(_ultimoDia.getMonth()+1);
                    _ultimoDia.setDate(0);
                    _ultimoDia = _ultimoDia.getDate();

                    InvestimentoPorObjectIdVigencia.get({ 
                        objectId: LoginService.objectIdLogin,
                        vigencia: item.vigencia,
                        vigenciaAuxiliar: _dataAuxiliar,
                        projetadoRealizado: 'P' }, function(projetado) {
                            if (projetado._id) {
                                _valorProjetado = 
                                    projetado.adwords + projetado.social + projetado.email + 
                                    projetado.direto + projetado.organica + projetado.referencia + 
                                    projetado.outros;

                                _valorProjetadoDiario = (_valorProjetado / _ultimoDia).toFixed(2);
                            } else {
                                _valorProjetado = 0;
                                _valorProjetadoDiario = 0;
                            }

                            item.valorProjetado = _valorProjetado;
                            item.valorProjetadoDiario = _valorProjetadoDiario;
                    });
                    

                    setTimeout(function() {
                        InvestimentoPorObjectIdVigencia.get({ 
                            objectId: LoginService.objectIdLogin,
                            vigencia: item.vigencia,
                            vigenciaAuxiliar: _dataAuxiliar,
                            projetadoRealizado: 'R' }, function(realizado) {
                                if (realizado._id) {
                                    item.valorRealizado = 
                                        realizado.adwords + realizado.social + realizado.email + 
                                        realizado.direto + realizado.organica + realizado.referencia + 
                                        realizado.outros;

                                    item.valorRealizadoDiario = (item.valorRealizado / _ultimoDia).toFixed(2);
                                } else {
                                      item.valorRealizado = _valorProjetado;
                                      item.valorRealizadoDiario = _valorProjetadoDiario;
                                }
                        });
                    }, 
                    200)
                });

                setTimeout(function(){
                _diferencaDatas = 
                    diferencaDatas($scope.dataInicialFormatoDate, $scope.dataFinalFormatoDate);

                var data = new Date($scope.dataInicialFormatoDate);
                data.setDate(data.getDate() - 1);

                _valorRealizado = 0;
                _valorProjetado = 0;

                for (var i = 0; i <= _diferencaDatas; ++i) {
                    data.setDate(data.getDate() + 1);

                    if (_mesInvestimento != (data.getMonth() + 1)) {
                        _mesInvestimento = (data.getMonth() + 1);
                        _anoInvestimento = data.getFullYear();

                        _listaAuxiliarMeses.forEach(function(item){
                            if ((new Number(item.vigencia.substr(0,2)) == _mesInvestimento) && (new Number(item.vigencia.substr(3,4)) == _anoInvestimento)) {
                                _itemProjetado = item;
                            }
                        });
                    }

                    _dataAtual = new Date(data.getFullYear(), data.getMonth(), data.getDate());                            

                    if ($scope.diaSemanaMes == "d") {
                        if (paramEixo == '1')
                            dadosGraficoRealizadoComparativoProjetado.labels.push(
                                data.getDate() + "/" + new Number(data.getMonth() + 1) + "/" + data.getFullYear());    

                        if (_graficoProjetado)
                            _dataAuxiliarRealizado.push(_itemProjetado.valorRealizadoDiario);
                        else {
                            paramLista.push(_itemProjetado.valorRealizadoDiario);
                        }
                        
                        _dataAuxiliarProjetado.push(_itemProjetado.valorProjetadoDiario);
                    }
                    else if ($scope.diaSemanaMes == "s") {                               
                        if (!_semanaAtual)
                            _semanaAtual = data.getWeek();

                        if (_semanaAtual != data.getWeek()) {
                            if (paramEixo == '1')
                                dadosGraficoRealizadoComparativoProjetado.labels.push("Semana " + _semanaAtual);

                            _semanaAtual = data.getWeek();

                            if (_graficoProjetado)
                                _dataAuxiliarRealizado.push(new Number(_valorRealizado));
                            else 
                                paramLista.push(new Number(_valorRealizado));
                            
                            _dataAuxiliarProjetado.push(_valorProjetado.toFixed(2));

                            _valorRealizado = 0;
                            _valorProjetado = 0;
                        }

                        _valorRealizado += new Number(_itemProjetado.valorRealizadoDiario);
                        _valorProjetado += new Number(_itemProjetado.valorProjetadoDiario);
                    }
                    else if ($scope.diaSemanaMes == "m") {
                        if (!_semanaAtual)
                            _semanaAtual = data.getMonth();

                        if (_semanaAtual != data.getMonth()) {
                            if (paramEixo == '1')
                                dadosGraficoRealizadoComparativoProjetado.labels.push(
                                    lpad(new Number(data.getMonth()), 2) + "/" +
                                    data.getFullYear());

                            _semanaAtual = data.getMonth();

                            if (_graficoProjetado)
                                _dataAuxiliarRealizado.push(_valorRealizado);
                            else 
                                paramLista.push(_valorRealizado);

                            
                            _dataAuxiliarProjetado.push(_valorProjetado);                            
                        }

                        _valorRealizado = _itemProjetado.valorRealizado;
                        _valorProjetado = _itemProjetado.valorProjetado;
                    }
                }

                if ($scope.diaSemanaMes == "s") {
                    if (paramEixo == '1')
                        dadosGraficoRealizadoComparativoProjetado.labels.push("Semana " + _semanaAtual);
                        
                    if (_graficoProjetado)
                        _dataAuxiliarRealizado.push(_valorRealizado);
                    else 
                        paramLista.push(_valorRealizado);

                    
                    _dataAuxiliarProjetado.push(_valorProjetado);
                } else if ($scope.diaSemanaMes == "m") {
                    if (paramEixo == '1')
                        dadosGraficoRealizadoComparativoProjetado.labels.push(
                            lpad(new Number(data.getMonth() + 1), 2) + "/" +
                        data.getFullYear());

                    if (_graficoProjetado)
                        _dataAuxiliarRealizado.push(_valorRealizado);
                    else 
                        paramLista.push(_valorRealizado);
                    
                    _dataAuxiliarProjetado.push(_valorProjetado);
                }

                if (_graficoProjetado)
                    $scope.popularGraficoProjetado(_dataAuxiliarRealizado, _dataAuxiliarProjetado);
                }, 
                500)
            };
        };
 
        $scope.abrirTela();
    });