angular.module('reachtarget')
    .controller('LeadsController', function($resource, $scope, $location, LoginService, FichaLeadService) {
      $scope.dataInicial = null;
      $scope.dataFinal = null;

      $scope.filtro = "";
      $scope.nome = "";
      $scope.cargo = "";
      $scope.email = "";
      $scope.telefone = "";
      $scope.inptuDataInicialFinal = "";

      $scope.totalizadorLeads = 0;
      $scope.totalizadorTaxaFechamento = '0.0';

      $scope.totalizadorVendas = 0;
      $scope.totalizadorTimingVendas = 0;

      $scope.totalizadorValorTotalVendas = 0;
      $scope.totalizadorCustoAquisicao = 0;  

      $scope.totalizadorPrincipalCanalVenda = "";
      $scope.totalizadorTotalVendasPorCanal = 0;

	    $scope.ordenacao = 'dataOrdenacao';
	    $scope.ordemTrueFalse = true;
      $scope.listaOrdenacao = [
      	{ campoOrdenacao: 'empresa', descricao: 'Empresa' }, 
        { campoOrdenacao: 'interesse', descricao: 'Interesse' }, 
        { campoOrdenacao: 'origem', descricao: 'Origem' }, 
        { campoOrdenacao: 'quantidadeConversoes', descricao: 'Quantidade de conversões' }, 
        { campoOrdenacao: 'dataOrdenacao', descricao: 'Data' }, 
        { campoOrdenacao: 'status', descricao: 'Status' }, 
        { campoOrdenacao: 'valorFechamento', descricao: 'Valor do fechamento' }, 
        { campoOrdenacao: 'dataFechamentoShow', descricao: 'Data de fechamento' }];

      $scope.filtroInteresse = "";
      $scope.listaFiltroInteresse = [];

      $scope.filtroOrigem = "";
      $scope.listaFiltroOrigem = [];

      $scope.filtroStatus = "";
      $scope.statusSelecionado = null;
      $scope.listaStatus = [
        { id: "", descricao: '<Todos>', mostrar: false },
        { id: 0, descricao: 'Qualificado', mostrar: true },
        { id: 1, descricao: 'Desqualificado', mostrar: true },
        { id: 2, descricao: 'Oportunidade aberta', mostrar: true },
        { id: 3, descricao: 'Oportunidade perdida', mostrar: true },
        { id: 4, descricao: 'Fechada', mostrar: true }];

      $scope.listaLeads = [];
      $scope.filtered = [];

      var _atualizarDataValorFechamento = false;
      var _dataFechamentoEdicao = null;
      var _valorFechamentoEdicao = null;

      var _leadFechamento = null;
      $scope.dataFechamento = null;
      $scope.valorFechamento = null;

      var atualizar = true;
      var aberturaDaTela = true;
      var dia = new Date();
      var mes = dia.getMonth();
      var diaDaSemana = dia.getDay();
      var dataAuxiliar = new Date();

      var _leadTelaAtualizar = null;
      var _leadTabelaAtualizar = null;
      var _statusAnterior = null;
      var _valorFechamentoAnterior =  null;

      var Lead = $resource('/lead');
      var ExcluirLead = $resource('/excluir/lead/:id');

      var TimelineLead = $resource('/timelineLead');
      var ConsultarTimelineLead = $resource('/timelineLead/:objectId/:idLead');
      var ExcluirTimelineLead = $resource('/excluir/timelineLead/:id');

      var ConsultarLeads = $resource('/lead/:objectId/:dataInicial/:dataFinal');
      var InvestimentoPorObjectIdVigencia = $resource('/investimento/:objectId/:vigencia/:vigenciaAuxiliar/:projetadoRealizado');


      $(document).ready(function() {
        $scope.permiteExcluirLead = LoginService.PermiteExcluirLead;

      	if (LoginService.DataInicial) {
            $scope.dataInicial = LoginService.DataInicial;
            $scope.dataFinal = LoginService.DataFinal;
          }
          else {
            $scope.dataInicial = moment().startOf('week')._d;
            $scope.dataFinal = moment().endOf('week')._d;
          }


          $scope.inptuDataInicialFinal = 
            retornarDataInicialFinal($scope.dataInicial, $scope.dataFinal);
          

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
                $scope.dataInicial = start._d;
                LoginService.DataInicial = start._d;
                LoginService.DataInicialFormat = start.format('YYYY-MM-DD');

                $scope.dataFinal = end._d;
                LoginService.DataFinal = end._d;
                LoginService.DataFinalFormat = end.format('YYYY-MM-DD');

                $scope.inptuDataInicialFinal = 
                    retornarDataInicialFinal(start._d, end._d);


                $scope.consultarLeads();
            });
        });

      $scope.consultarLeads = function() {
            document.getElementById('loaderIndex').style.display = 'block';

            $scope.zerarTotalizador();
            $scope.listaLeads = [];
            
            $scope.listaFiltroOrigem = [];
            $scope.listaFiltroOrigem.push({
              "filtro": "",
              "descricao": "<Todos>"
            });

            $scope.listaFiltroInteresse = [];
            $scope.listaFiltroInteresse.push({
              "filtro": "",
              "descricao": "<Todos>"
            });

            var _data = null;
            var _dataFechamento = null;

            ConsultarLeads
                  .query({
                      objectId: LoginService.objectIdLogin,
                      dataInicial: $scope.dataInicial,
                      dataFinal: $scope.dataFinal
                  }, function(resultado) {
                        resultado.forEach(function(item){
                              $scope.totalizadorLeads++;

                              _data = new Date(item.data);
 
                              if (item.status == 4) {
                                $scope.totalizadorVendas++;
                                _dataFechamento = new Date(item.dataFechamento);

                                if (item.valorFechamento)
                                    $scope.totalizadorValorTotalVendas += item.valorFechamento;
                              }
                              else {
                                _dataFechamento = null;
                                item.valorFechamento = null ;
                              }

                              var _incluirRegistro = true;

                              $scope.listaFiltroOrigem.forEach(function(itemOrigem, indexOrigem, arrayOrigem){
                                  if (itemOrigem.descricao == item.origem)
                                    _incluirRegistro = false;

                                  if ((indexOrigem == arrayOrigem.length - 1) && (_incluirRegistro)) {
                                    $scope.listaFiltroOrigem.push({
                                      "filtro": item.origem,
                                      "descricao": item.origem
                                    });
                                  }
                              });

                              _incluirRegistro = true;

                              $scope.listaFiltroInteresse.forEach(function(itemInteresse, indexInteresse, arrayInteresse){
                                  if (itemInteresse.descricao == item.interesse)
                                    _incluirRegistro = false;

                                  if ((indexInteresse == arrayInteresse.length - 1) && (_incluirRegistro)) {
                                    $scope.listaFiltroInteresse.push({
                                      "filtro": item.interesse,
                                      "descricao": item.interesse
                                    });
                                  }
                              });

                              $scope.listaLeads.push({
                                    "lead": item,
                                    "id": item._id,
                                    "dataEntrada": item.dataEntrada,
                                    "nome": item.nome,
                                    "empresa": item.empresa,
                                    "email": item.email,
                                    "cargo": item.cargo,
                                    "telefone": item.telefone,
                                    "interesse": item.interesse,
                                    "origem": item.origem,
                                    "quantidadeConversoes": item.quantidadeConversoes,
                                    "dataOrdenacao": _data,
                                    "data": 
                                      lpad(_data.getDate(), 2) + "/" + lpad(new Number(_data.getMonth() + 1), 2) + "/" + _data.getFullYear(),
                                    "status": $scope.listaStatus[item.status+1].id,
                                    "valorFechamento": item.valorFechamento,
                                    "dataFechamento": item.dataFechamento,
                                    "dataFechamentoShow": 
                                        (_dataFechamento) 
                                          ? lpad(_dataFechamento.getDate(), 2) + "/" + lpad(new Number(_dataFechamento.getMonth() + 1), 2) + "/" + _dataFechamento.getFullYear()
                                          : null
                              });
                        });

                        $scope.totalizadorTaxaFechamento = 
                          ($scope.totalizadorLeads > 0)
                            ? (($scope.totalizadorVendas / $scope.totalizadorLeads) * 100).toFixed(1)
                            : '0.0';

                        $scope.atualizarDadosSuperiores();
                  });
      },

      $scope.zerarTotalizador = function(){
            $scope.totalizadorLeads = 0;
            $scope.totalizadorTaxaFechamento = '0.0';

            $scope.totalizadorVendas = 0;
            $scope.totalizadorTimingVendas = 0;

            $scope.totalizadorValorTotalVendas = 0;
            $scope.totalizadorCustoAquisicao = 0;

            $scope.totalizadorPrincipalCanalVenda = 0;
            $scope.totalizadorTotalVendasPorCanal = 0;
      },


      $scope.salvarLead = function(lead) {
            _statusAnterior = lead.lead.status;
            _valorFechamentoAnterior = lead.lead.valorFechamento;
            
            lead.dataFechamento = null;
            lead.valorFechamento = null;
            lead.dataFechamentoShow = null;

            lead.lead.status = lead.status;
            lead.lead.dataFechamento = null;
            lead.lead.valorFechamento = null;

            lead.lead.$save();

            if (lead.status == 4) {
                  _leadTelaAtualizar = lead;
                  _leadTabelaAtualizar = lead.lead;

                  $scope.dataFechamento = new Date();
                  $scope.valorFechamento = null;

                  $('#modalFechamento').modal('show');
            } else {
                  $scope.salvarTimelineLead(lead.lead._id, "Status", _statusAnterior, lead.status);

                  if (_statusAnterior == 4) {
                        $scope.totalizadorVendas--;
                        $scope.totalizadorValorTotalVendas -= _valorFechamentoAnterior;

                        $scope.atualizarDadosSuperiores();
                  }
            }
      },

      $scope.salvarTimelineLead = function(idLead, tipo, valorAnterior, valorAtual){
            var _timelineLead = new TimelineLead();

            _timelineLead.objectIdLogin = LoginService.objectIdLogin;
            _timelineLead.objectIdLead = idLead;
            _timelineLead.data = new Date();
            _timelineLead.tipo = tipo;
            _timelineLead.valorAnterior = valorAnterior;
            _timelineLead.valorAtual = valorAtual;

            if ((tipo == "Status") && (valorAtual == 4)) {
                  _timelineLead.dataFechamento = $scope.dataFechamento;
                  _timelineLead.valorFechamento = $scope.valorFechamento;
            }

            _timelineLead.$save();
            _atualizarDataValorFechamento = false;
      },

      $scope.salvarFechamento = function() {
            var _dataFechamento = new Date($scope.dataFechamento);

            _leadTelaAtualizar.dataFechamento = $scope.dataFechamento;
            _leadTelaAtualizar.dataFechamentoShow = _dataFechamento.getDate() + "/" + new Number(_dataFechamento.getMonth() + 1) + "/" + _dataFechamento.getFullYear();
            _leadTelaAtualizar.valorFechamento = $scope.valorFechamento;

            _leadTabelaAtualizar.status = 4;
            _leadTabelaAtualizar.dataFechamento = $scope.dataFechamento;
            _leadTabelaAtualizar.valorFechamento = $scope.valorFechamento;
            _leadTabelaAtualizar.$save();

            $scope.totalizadorVendas++;
            $scope.totalizadorValorTotalVendas += $scope.valorFechamento;

            $scope.atualizarDadosSuperiores();

            if (_atualizarDataValorFechamento) {
                var _data = new Date(_dataFechamentoEdicao);
                var _dataEdicao = _data.getDate() + _data.getMonth() + _data.getFullYear();
                
                _data = new Date($scope.dataFechamento);
                var _dataNova = _data.getDate() + _data.getMonth() + _data.getFullYear();                

                if (_valorFechamentoEdicao != $scope.valorFechamento)
                  $scope.salvarTimelineLead(_leadTabelaAtualizar._id, "Valor fechamento", _valorFechamentoEdicao, $scope.valorFechamento);

                if (_dataEdicao != _dataNova)
                  $scope.salvarTimelineLead(_leadTabelaAtualizar._id, "Data fechamento", _dataFechamentoEdicao, $scope.dataFechamento);
            } else {
                $scope.salvarTimelineLead(_leadTabelaAtualizar._id, "Status", _statusAnterior, _leadTabelaAtualizar.status);  
            }

            $('#modalFechamento').modal('hide');
      },

      $scope.atualizarDadosSuperiores = function(){
      		if ($scope.filtered.length <= 0) {
      			$scope.filtered = $scope.listaLeads;
      		} 

            $scope.calcularTimingVendas();
            $scope.calcularCustoAquisicao();
            $scope.atualizarCanalPrincipal();

            document.getElementById('loaderIndex').style.display = 'none';
      },

      $scope.calcularTimingVendas = function() {
            var _diferenciaDias = 0;

            $scope.filtered.forEach(function(lead){
                  if (lead.status == 4) {
                        _diferenciaDias += 
                              diferencaDatas(new Date(lead.dataEntrada), new Date(lead.dataFechamento));
                  }
            });

            $scope.totalizadorTimingVendas = 
              ($scope.totalizadorVendas > 0)
                ? (_diferenciaDias / $scope.totalizadorVendas).toFixed(0)
                : 0;
      },

      $scope.calcularCustoAquisicao = function() {
            var _listaAuxiliarTotalInvestimento = [];
            var _dataAuxiliar = new Date($scope.dataInicial);

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

                  if (Date.parse(_dataAuxiliar) > Date.parse($scope.dataFinal))
                        break;
            }

            _listaAuxiliarTotalInvestimento.forEach(function(item){
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

                                item.valor = (_valorProjetado / _ultimoDia);
                            } else {
                                item.valor = 0;
                            }                            
                  });
                    

                  setTimeout(function() {
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

                                    item.valor = (_valorRealizado / _ultimoDia);
                                }
                        });
                    }, 
                    200)
                });

                setTimeout(function(){
                    var _diferencaDatas = 
                        diferencaDatas($scope.dataInicial, $scope.dataFinal);

                    var data = new Date($scope.dataInicial);
                    data.setDate(data.getDate() - 1);

                    for (var i = 0; i <= _diferencaDatas; ++i) {
                        data.setDate(data.getDate() + 1);
                        
                        if (_mesInvestimento != (data.getMonth() + 1)) {
                            _mesInvestimento = (data.getMonth() + 1);
                            _anoInvestimento = data.getFullYear();

                            _listaAuxiliarTotalInvestimento.forEach(function(item){
                                if ((new Number(item.vigencia.substr(0,2)) == _mesInvestimento) && (new Number(item.vigencia.substr(3,4)) == _anoInvestimento)) {
                                    _itemProjetadoAuxiliar = item;
                                }
                            });
                        }

                        _valorInvestimento += 
                            parseFloat(_itemProjetadoAuxiliar.valor);

                        if (i == _diferencaDatas) {
                              $scope.totalizadorCustoAquisicao = 
                                ($scope.totalizadorVendas > 0)
                                  ? (_valorInvestimento / $scope.totalizadorVendas).toFixed(0)
                                  : 0;
                        }
                    }
                }, 
                200);
      },

      $scope.atualizarCanalPrincipal = function() {
            var _texto = "";
            var _valor = 0;

            var _listaAgrupamento = {};
            
            for (var i = 0; i < $scope.filtered.length; ++i) {
                  var obj = $scope.filtered[i];

                  if (_listaAgrupamento[obj.origem] == undefined)
                  {
                        _listaAgrupamento[obj.origem] = [obj.origem];
                        _listaAgrupamento[obj.origem][0] = 
                              (obj.valorFechamento == undefined)
                                    ? 0 
                                    : obj.valorFechamento;
                  } else {
                        _listaAgrupamento[obj.origem][0] += 
                              (obj.valorFechamento == undefined)
                                    ? 0 
                                    : obj.valorFechamento;
                  }
            }

            $.each(_listaAgrupamento, function(index, value){
                  if (value > _valor) {
                        _texto = index;
                        _valor = new Number(value);
                  }
            });

            $scope.totalizadorPrincipalCanalVenda = _texto;
            $scope.totalizadorTotalVendasPorCanal = _valor;
      },

      $scope.fichaDoLead = function(lead) {
        FichaLeadService.idLead = lead.id;
        
         $location.path('/fichaLead');
      },

      $scope.exportar = function() {
        var tab_text = "<table border='2px'>";

        tab_text += "<tr>";
        tab_text += "<th> Nome </th>";
        tab_text += "<th> Email </th>";
        tab_text += "<th> Telefone </th>";
        tab_text += "<th> Empresa </th>";
        tab_text += "<th> Cargo </th>";
        tab_text += "<th> Interesse </th>";
        tab_text += "<th> Origem </th>";
        tab_text += "<th> Conversoes </th>";
        tab_text += "<th> Data </th>";
        tab_text += "<th> Status </th>";
        tab_text += "<th> Valor fechamento </th>";
        tab_text += "<th> Data fechamento </th>";
        tab_text += "</tr>";       

        tab_text += "<tr> </tr>";

        $scope.listaLeads.forEach(function(lead){
          tab_text += "<tr>";
          
          tab_text += "<td>";        
          tab_text += lead.nome;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.email;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.telefone;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.empresa;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.cargo;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.interesse;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.origem;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.quantidadeConversoes;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.data;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += $scope.listaStatus[lead.status+1].descricao;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.valorFechamento;
          tab_text += "</td>";

          tab_text += "<td>";        
          tab_text += lead.dataFechamentoShow;
          tab_text += "</td>";

          tab_text += "</tr>";
        });

        tab_text = tab_text + "</table>";

        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");
        tab_text = tab_text.replace(/<img[^>]*>/gi,"");
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, "");

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE "); 

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
        {
            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus(); 

            sa = txtArea1.document.execCommand("SaveAs", true, "Leads.xls");
        }  
        else
           sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));          
      },

      $scope.editarValorDataFechamento = function(itemLead) {
        _atualizarDataValorFechamento = true;
        _dataFechamentoEdicao = itemLead.dataFechamento;
        _valorFechamentoEdicao = itemLead.valorFechamento;

        _leadTelaAtualizar = itemLead;
        _leadTabelaAtualizar = itemLead.lead;

        $scope.dataFechamento = new Date(itemLead.dataFechamento);
        $scope.valorFechamento = itemLead.valorFechamento;

        $('#modalFechamento').modal('show');
      },

      $scope.tooltipLead = function(lead) {
        $scope.nome = lead.nome;
        $scope.cargo = lead.cargo;
        $scope.email = lead.email;
        $scope.telefone = lead.telefone;
      },

      $scope.crescenteDecrescente = function() {
		    $scope.ordemTrueFalse = 
			   !$scope.ordemTrueFalse;		
      },

      $scope.atualizarDadosSuperioresDeAcordoComFiltro = function() {
      	abrirLoader();
      	$scope.zerarTotalizador();

      	setTimeout(function(){
      		$scope.totalizadorLeads = $scope.filtered.length;

      		$scope.filtered.forEach(function(item, index, list) {
      			if (item.status == 4) {
      				$scope.totalizadorVendas++;
      				$scope.totalizadorValorTotalVendas += item.valorFechamento;
      			}

      			if (index == list.length-1) {
      				$scope.totalizadorTaxaFechamento = 
                    	($scope.totalizadorLeads > 0)
                        	? (($scope.totalizadorVendas / $scope.totalizadorLeads) * 100).toFixed(1)
                            : '0.0';

      				$scope.atualizarDadosSuperiores();

      				$scope.$apply();
      				fecharLoader();
      			}
      		});
      	}, 
      	500);      	
      };

      $scope.excluirLead = function(leadExcluir) {
        ConsultarTimelineLead.query({ 
          objectId: LoginService.objectIdLogin,
          idLead: leadExcluir.id
        },
        function(resultadoTimelineLead) {

          if (resultadoTimelineLead.length > 0) {

            resultadoTimelineLead.forEach(function(tl, index, array){
              ExcluirTimelineLead.delete({
                id: tl._id
              });

              if (index == array.length-1)  {
                ExcluirLead.delete({
                  id: leadExcluir.id
                });

                $scope.consultarLeads();
              }
            });
          } else {
            ExcluirLead.delete({
              id: leadExcluir.id
            });

            $scope.consultarLeads();
          }
        });          
    };

    $scope.consultarLeads();
});