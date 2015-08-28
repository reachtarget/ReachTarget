angular.module('reachtarget')
	.controller('ProjecaoController', function($resource, $scope, $location, LoginService) {

		$scope.semestre = "";	
		$scope.semestreAno = "";	

		$scope.aplicarPercMensal = false;
		$scope.valorPercMensal = 0;

		$scope.mesCol0107 = "";
		$scope.mesCol0208 = "";
		$scope.mesCol0309 = "";
		$scope.mesCol0410 = "";
		$scope.mesCol0511 = "";
		$scope.mesCol0612 = "";

		$scope.acessos0107 = 0;
		$scope.acessos0208 = 0;
		$scope.acessos0309 = 0;
		$scope.acessos0410 = 0;
		$scope.acessos0511 = 0;
		$scope.acessos0612 = 0;

		$scope.leads0107 = 0;
		$scope.leads0208 = 0;
		$scope.leads0309 = 0;
		$scope.leads0410 = 0;
		$scope.leads0511 = 0;
		$scope.leads0612 = 0;

		$scope.vendas0107 = 0;
		$scope.vendas0208 = 0;
		$scope.vendas0309 = 0;
		$scope.vendas0410 = 0;
		$scope.vendas0511 = 0;
		$scope.vendas0612 = 0;

		$scope.listaMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

		var dataAtual = new Date();
		var dataInicial = new Date();
		var dataFinal = new Date();

		var jaEstaGravando = false;

		var Projecao = $resource('/projecao');
		var ProjecaoPorSemestre = $resource('/projecao/:objectId/:dataInicial/:dataFinal');


		$scope.exibirSemestreAno = function() {
			if (new Number(dataAtual.getMonth() + 1) < 7) {
				$scope.semestre = "1";
				$scope.semestreAno = "1";

				$scope.mesCol0107 = $scope.listaMes[0];
				$scope.mesCol0208 = $scope.listaMes[1];
				$scope.mesCol0309 = $scope.listaMes[2];
				$scope.mesCol0410 = $scope.listaMes[3];
				$scope.mesCol0511 = $scope.listaMes[4];
				$scope.mesCol0612 = $scope.listaMes[5];

				dataInicial = new Date(dataAtual.getFullYear(), 0, 1);
				dataFinal = new Date(dataAtual.getFullYear(), 5, 30);
			} else {
				$scope.semestre = "2";
				$scope.semestreAno = "2";

				$scope.mesCol0107 = $scope.listaMes[6];
				$scope.mesCol0208 = $scope.listaMes[7];
				$scope.mesCol0309 = $scope.listaMes[8];
				$scope.mesCol0410 = $scope.listaMes[9];
				$scope.mesCol0511 = $scope.listaMes[10];
				$scope.mesCol0612 = $scope.listaMes[11];

				dataInicial = new Date(dataAtual.getFullYear(), 6, 1);
				dataFinal = new Date(dataAtual.getFullYear(), 11, 31);
			}

			$scope.semestreAno += "o. semestre / " + dataAtual.getFullYear();
		};

		$scope.semestreAnterior = function() {
			dataAtual.setMonth(dataAtual.getMonth()-6);

			$scope.exibirSemestreAno();
			$scope.consultarValoresPorSemestre();
		};

		$scope.proximoSemestre = function() {
			dataAtual.setMonth(dataAtual.getMonth()+6);

			$scope.exibirSemestreAno();
			$scope.consultarValoresPorSemestre();
		};

		$scope.consultarValoresPorSemestre = function() {
			$scope.limparValoresScope(function() {
				var _mesScope = 0;
				var _auxiliarScope = "";

				ProjecaoPorSemestre.query({ 
					objectId: LoginService.objectIdLogin,
					dataInicial: dataInicial,
					dataFinal: dataFinal
				},
				function(resultadoValoresPorSemestre) {
					resultadoValoresPorSemestre.forEach(function(itemAtual) {
						_mesScope = new Number(new Date(itemAtual.vigencia).getMonth() + 1);
						_auxiliarScope = itemAtual.metrica;

						if ($scope.semestre == "1")
							_auxiliarScope += lpad(_mesScope, 2) + lpad(new Number(_mesScope + 6), 2);
						else 
							_auxiliarScope += lpad(new Number(_mesScope - 6), 2) + lpad(_mesScope, 2);

						$scope[_auxiliarScope] = itemAtual.valor;
					});
				},
				function(error) {
					console.log(error);
				});
			});
		};

		$scope.salvarProjecao = function(metrica, mes, paramAplicarPerc) {
			var _id = null;
			var _projecao = null;

			var _mesVigencia = 
				($scope.semestre == "1")
					? mes.substr(0, 2)
					: mes.substr(2, 2);

			var _vigencia = 
				new Date(dataAtual.getFullYear(), new Number(_mesVigencia-1), 1);

			
			_projecao = new Projecao();			

			_projecao.objectIdLogin = LoginService.objectIdLogin;
			_projecao.metrica = metrica;
			_projecao.valor = $scope[metrica + mes];
			_projecao.vigencia = _vigencia;

			_projecao.$save();

			if (($scope.aplicarPercMensal) && (paramAplicarPerc)) {
				$scope.aplicarPorcentagemMensal(_projecao.valor, metrica, mes, _mesVigencia);
			}			
		};

		$scope.aplicarPorcentagemMensal = function(paramValor, paramMetrica, paramMes, paramMesVigencia) {
			var _auxiliarMetrica = "";
			var _auxiliarMes = "";

			var _ateQualMes = 12;
			var _valor = paramValor;

			for (i = new Number(paramMesVigencia) + 1; i <= _ateQualMes; i++) {
				_auxiliarMetrica = paramMetrica;

				if ($scope.semestre == "1")
					_auxiliarMes = lpad(i, 2) + lpad(new Number(i + 6), 2);
				else 
					_auxiliarMes = lpad(new Number(i - 6), 2) + lpad(i, 2);


				_valor = _valor + (_valor * ($scope.valorPercMensal / 100));

				$scope[_auxiliarMetrica + _auxiliarMes] = parseFloat(_valor.toFixed(0));
				$scope.salvarProjecao(_auxiliarMetrica, _auxiliarMes, false);
			}
		};

		$scope.limparValoresScope = function(callback) {
			$scope.acessos0107 = 0;
			$scope.acessos0208 = 0;
			$scope.acessos0309 = 0;
			$scope.acessos0410 = 0;
			$scope.acessos0511 = 0;
			$scope.acessos0612 = 0;

			$scope.leads0107 = 0;
			$scope.leads0208 = 0;
			$scope.leads0309 = 0;
			$scope.leads0410 = 0;
			$scope.leads0511 = 0;
			$scope.leads0612 = 0;

			$scope.vendas0107 = 0;
			$scope.vendas0208 = 0;
			$scope.vendas0309 = 0;
			$scope.vendas0410 = 0;
			$scope.vendas0511 = 0;
			$scope.vendas0612 = 0;

			callback();
		};

		$scope.exibirSemestreAno();
		$scope.consultarValoresPorSemestre();
});	