angular.module('reachtarget')
    .controller('LeadsMaaSController', function($resource, $scope, $location, LoginService) {

	$scope.listaLeads = [];
    $scope.permiteExcluirLead = false;

    $scope.leads = 0;
    $scope.vendas = 0;
    $scope.timingVendas = 0;
    $scope.valorVendas = 0;
    $scope.filtro = "";
    $scope.temCampanhaSelecionada = true;

    var NovoLead = $resource('/lead');
	var ExcluirLead = $resource('/excluir/lead/:id');
	var ConsultarLeads = $resource('/lead/maas/:objectId/:dataInicial/:dataFinal/:pagina');

	$scope.listaStatus = [
        { id: 0, descricao: 'Qualificado', mostrar: true },
        { id: 1, descricao: 'Desqualificado', mostrar: true },
        { id: 2, descricao: 'Oportunidade aberta', mostrar: true },
        { id: 3, descricao: 'Oportunidade perdida', mostrar: true },
        { id: 4, descricao: 'Fechada', mostrar: true }
    ];

    $scope.origemSelecionada = "";
   	$scope.listaOrigens = ['Adwords', 'Orgânica', 'Direta', 'Referência', 'Outros', 'Social', 'E-mail'];

   	$(document).ready(function() {
		$('[data-toggle="tooltip"]').tooltip();

		$scope.permiteExcluirLead = 
			LoginService.PermiteExcluirLead;

		_metodoDeAtualizacao = function(){
			$scope.consultarLeads();
		};
	});

	$scope.zerarTotais = function() {
		$scope.leads = 0;
    	$scope.vendas = 0;
    	$scope.timingVendas = 0;
    	$scope.valorVendas = 0;
	};

	$scope.atualizarDadosSuperiores = function() {
		abrirLoader();
		$scope.zerarTotais();

		var _diferenciaDias = 0;

		$scope.listaLeads.forEach(function(item, index, lista){
			$scope.leads++;

			if (item.IDStatus == 4) {
				$scope.vendas++;
				$scope.valorVendas += new Number(item.Valor);

				_diferenciaDias += 
                	diferencaDatas(new Date(item.Entrada), new Date(item.DataFechamento));
			}

			if (index == lista.length-1) {

				if ($scope.vendas > 0) {
					$scope.timingVendas = (_diferenciaDias / $scope.vendas).toFixed(0);
				}

				$scope.valorVendas = formatReal($scope.valorVendas);
				fecharLoader();
			}
		});
	};

	$scope.consultarLeads = function() {
		$scope.temCampanhaSelecionada = 
			LoginService.CampanhaSelecionada.IDPagina != "-";

		abrirLoader();
		$scope.zerarTotais();

		$scope.listaLeads = [];

		ConsultarLeads.query({

			objectId: LoginService.objectIdLogin,
			dataInicial: LoginService.DataInicial,
			dataFinal: LoginService.DataFinal,
			pagina: LoginService.CampanhaSelecionada.IDPagina

		}, function(resultadoLeads) {

			var _listaEmails = [];

			if (resultadoLeads.length > 0) {
				
				resultadoLeads.forEach(function(lead, index, lista) {

					var _jaExisteOEmail = 
						$.grep(_listaEmails, function(val, index){
							return val == lead.email;
						});

					if (_jaExisteOEmail.length <= 0) {
						_listaEmails.push(lead.email);

						_data = new Date(lead.data);
						_dataTabela = lpad(_data.getDate(), 2) + "/" + lpad(new Number(_data.getMonth() + 1), 2) + "/" + _data.getFullYear();
						_dataFechamentoTabela = null;
						_fechamento = null;

						if (lead.valorFechamento) {
							_fechamento = 'R$ ' + formatReal(lead.valorFechamento);

							_dataFechamento = new Date(lead.dataFechamento);

							_dataFechamentoTabela = 
								lpad(_dataFechamento.getDate(), 2) + "/" + 
								lpad(new Number(_dataFechamento.getMonth() + 1), 2) + "/" + 
								_dataFechamento.getFullYear();
						}

						$scope.listaLeads.push({
							Lead: lead,
							_id: lead._id,
							Nome: lead.nome,
							Email: lead.email,
							Telefone: lead.telefone,
							Empresa: lead.empresa,													
							Cargo: lead.cargo,
							Interesse: lead.interesse,
							Entrada: _data,
							DataEntrada: _dataTabela,
							IDStatus: lead.status,
							Status: $scope.listaStatus[lead.status].descricao,
							ValorTabela: _fechamento,
							Valor: lead.valorFechamento,
							DataFechamentoTabela: _dataFechamentoTabela,
							DataFechamento: lead.dataFechamento
						});
					}

					if (index == lista.length-1) {
						$scope.atualizarDadosSuperiores();
					}
				});							
			} else {
				fecharLoader();
			}
		});
	};

	$scope.salvarLead = function(leadAlteracao) {

		var _alterarLead = new NovoLead(leadAlteracao.Lead);

		if (leadAlteracao.IDStatus == 4) {

			$('#propriedades' + leadAlteracao._id).popover({
			    placement : 'right',
			    trigger: 'manual',
			    html: true,
			    content: function() {
	          		return $('#contentLeadFechamento' + leadAlteracao._id).html();
	        	}
			});

			$('#propriedades' + leadAlteracao._id).popover('show');

			$("#valorFechamento" + leadAlteracao._id).maskMoney({
    				showSymbol: true, 
    				prefix: "R$ ", 
    				decimal: ",", 
    				thousands: "."
    		});

			$('.popover .arrow').css('top', '50%');

			$('#bttnSalvarLeadFechamento' + leadAlteracao._id).click(function() {

				var _valor = $("#valorFechamento" + leadAlteracao._id).maskMoney('unmasked')[0];
				var _data = new Date($('#dataFechamentoLead' + leadAlteracao._id).val());
				_data.setDate(_data.getDate() + 1);

				leadAlteracao.Valor = _valor;
				leadAlteracao.ValorTabela = 'R$ ' + formatReal(_valor);
				leadAlteracao.DataFechamento = _data;
				leadAlteracao.DataFechamentoTabela = lpad(_data.getDate(), 2) + "/" + lpad(new Number(_data.getMonth() + 1), 2) + "/" + _data.getFullYear();

				_alterarLead.status = leadAlteracao.IDStatus;
				_alterarLead.valorFechamento = _valor;
				_alterarLead.dataFechamento = _data;

				_alterarLead.$save(function(){
					$scope.atualizarDadosSuperiores();
					$('#propriedades' + leadAlteracao._id).popover('hide');
				});
			});

		} else {

			leadAlteracao.Valor = null;
			leadAlteracao.ValorTabela = null;
			leadAlteracao.DataFechamento = null;
			leadAlteracao.DataFechamentoTabela = null;

			_alterarLead.status = leadAlteracao.IDStatus;
			_alterarLead.valorFechamento = null;
			_alterarLead.dataFechamento = null;

			_alterarLead.$save();
			$scope.atualizarDadosSuperiores();
		}
	};

	$scope.excluirLead = function(leadExcluir) {
    	ExcluirLead.delete({
			id: leadExcluir._id
		});

		for (var i = $scope.listaLeads.length - 1; i >= 0; i--) {
			if($scope.listaLeads[i] == leadExcluir) {
   				$scope.listaLeads.splice(i, 1);
			}
		}
    };

    $scope.novoLead = function() {
    	$('#littleButton').popover({
		    placement : 'left',
		    trigger: 'manual',
		    html: true,
		    content: function() {
          		return $('#contentNovoLead').html();
        	}
		});

		$('#littleButton').popover('show');

		$('.popover').css('top', '-121px');
		$('.popover .arrow').css('top', '126px');


		$('#bttnSalvarNovoLead').click(function() {
			var _origem = document.getElementsByName('novoLeadOrigem')[0];			
			var _novoLead = new NovoLead();

			var _data = new Date(document.getElementsByName('novoLeadEntrada')[0].value);
			_data.setDate(_data.getDate() + 1);

			_novoLead.objectIdLogin = LoginService.objectIdLogin;
			_novoLead.dataEntrada = new Date(document.getElementsByName('novoLeadEntrada')[0].value);
			_novoLead.nome = document.getElementsByName('novoLeadNome')[0].value;
			_novoLead.empresa = document.getElementsByName('novoLeadEmpresa')[0].value;
			_novoLead.email = document.getElementsByName('novoLeadEmail')[0].value;
			_novoLead.cargo = document.getElementsByName('novoLeadCargo')[0].value;
			_novoLead.telefone = document.getElementsByName('novoLeadTelefone')[0].value;
			_novoLead.interesse = LoginService.CampanhaSelecionada.Nome;
			_novoLead.quantidadeConversoes = 1;
			_novoLead.data = _data;
			_novoLead.status = 0;
			_novoLead.dataFechamento = null;
			_novoLead.valorFechamento = 0;
			_novoLead.pagina = LoginService.CampanhaSelecionada.IDPagina;
			
			_novoLead.$save(
				function(){

					$scope.consultarLeads();	
					$('#littleButton').popover('hide');

				});
		});

		$('#bttnFecharNovoLead').click(function() {
			$('#littleButton').popover('hide');
		});
    };

    $scope.mouseOver = function(lead) {
    	$('#empresa' + lead._id).popover({
		    placement: 'top',
		    trigger: 'manual',
		    container : 'body',
		    html: true,
		    content: function() {
          		return $('#contentHover' + lead._id).html();
        	}
		});

		$('#empresa' + lead._id).popover('show');			
    };

    $scope.mouseLeave = function(lead) {
    	$('#empresa' + lead._id).popover('hide');
    };

    $scope.consultarLeads();
});