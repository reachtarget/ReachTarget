angular.module('reachtarget')
	.controller('FichaLeadController', function($resource, $scope, $location, LoginService, FichaLeadService) {

	$scope.nome = "";
	$scope.cargo = "";
	$scope.empresa = "";
	$scope.email = "";
	$scope.telefone = "";
	$scope.conversoes = "";
	$scope.interesse = "";
	$scope.origem = "";
	$scope.status = "";
	$scope.dataFechamento = "";
	$scope.valorFechamento = "";

	$scope.listaStatus = [
        { "id": 0, "descricao": 'Qualificado' }, 
        { "id": 1, "descricao": 'Desqualificado' }, 
        { "id": 2, "descricao": 'Oportunidade aberta' }, 
        { "id": 3, "descricao": 'Oportunidade perdida' }, 
        { "id": 4, "descricao": 'Fechada' }
      ];

    $scope.listaTimeline = [];

    var _data = null;
    var _valorAnterior = null;
    var _valorAtual = null;    

	var ConsultarLeadPorID = $resource('/lead/:objectId/:idLead');
	var ConsultarTimelineLead = $resource('/timelineLead/:objectId/:idLead');



	$scope.consultarDadosLead = function(){
		ConsultarLeadPorID.get({ 
			objectId: LoginService.objectIdLogin,
			idLead: FichaLeadService.idLead
		},
		function(lead) { 

			if (lead.dataFechamento) {
				var _data = new Date(lead.dataFechamento);

				$scope.dataFechamento = _data.getDate() + "/" + new Number(_data.getMonth() + 1) + "/" + _data.getFullYear();
				$scope.valorFechamento = lead.valorFechamento;
			}

			$scope.nome = lead.nome;
			$scope.cargo = lead.cargo;
			$scope.empresa = lead.empresa;
			$scope.email = lead.email;
			$scope.telefone = lead.telefone;
			$scope.conversoes = lead.quantidadeConversoes;
			$scope.interesse = lead.interesse;
			$scope.origem = lead.origem;
			$scope.status = $scope.listaStatus[lead.status].descricao;

			$scope.consultarTimeline();
		});
	};

	$scope.consultarTimeline = function(){
		ConsultarTimelineLead.query({ 

			objectId: LoginService.objectIdLogin,
			idLead: FichaLeadService.idLead
			
		},
		function(timelineLead) {

			timelineLead.forEach(function(timeline){
				var _data = new Date(timeline.data);

				if (timeline.tipo == "Status") {
					_valorAnterior = $scope.listaStatus[timeline.valorAnterior].descricao;
					_valorAtual = $scope.listaStatus[timeline.valorAtual].descricao;
				} else {
					if (timeline.tipo == "Data fechamento") {
						var _dataFechamento = new Date(timeline.valorAnterior);
						_valorAnterior = _dataFechamento.getDate() + "/" + new Number(_dataFechamento.getMonth() + 1) + "/" + _dataFechamento.getFullYear();

						_dataFechamento = new Date(timeline.valorAtual);
						_valorAtual = _dataFechamento.getDate() + "/" + new Number(_dataFechamento.getMonth() + 1) + "/" + _dataFechamento.getFullYear();
					} else {
						_valorAnterior = timeline.valorAnterior;
						_valorAtual = timeline.valorAtual;	
					}					
				}

            	$scope.listaTimeline.push({
                    "tipo": timeline.tipo,
                    "valorAnterior": _valorAnterior,
                    "valorAtual": _valorAtual,
                    "data": _data.getDate() + "/" + new Number(_data.getMonth() + 1) + "/" + _data.getFullYear()
                });
			});
		});
	};

	$scope.consultarDadosLead();	
});
