angular.module('reachtarget')
	.controller('NovoClienteController', function($scope, $location, $resource, LoginService) {
		$scope.listaOfertas = [];

		$scope.empresa = "";
		$scope.email = "";
		$scope.login = "";
		$scope.senha = "";
		$scope.tipoCliente = "M";
		
		$scope.nomeEntradaOferta = "";
		$scope.dataEntradaOferta = "";

		$scope.listaTipos = [
	        { id: 'M', descricao: 'Starter' },
	        { id: 'S', descricao: 'Search' },
	        { id: 'I', descricao: 'Inbound' }
    	];


		var NovoLogin = $resource('/login');
		var NovoComplemento = $resource('/complementoLogin');
		var NovoUnbounce = $resource('/unbounce');

		var EnviarEmailLogin = $resource('/email/novo/login');

		$(document).ready(function() {
			document.getElementById('divFiltros').style.display = 'none';
		});

		$scope.adicionarOfertas = function() {
			$scope.listaOfertas.push({
				Nome: $scope.nomeEntradaOferta,
				DataEntrada: $scope.dataEntradaOferta,
				DataEntradaShow: formarData($scope.dataEntradaOferta)
			});

			$scope.nomeEntradaOferta = "";
			$scope.dataEntradaOferta = "";
		};
		
		$scope.voltar = function() {
			$location.path('/administrativo');
		};

		$scope.salvar = function() {
			var _enviarEmailLogin = new EnviarEmailLogin();

			_enviarEmailLogin.id = $scope.email;
			_enviarEmailLogin.login = $scope.login;
			_enviarEmailLogin.senha = $scope.senha;

			_enviarEmailLogin.$save();


			var _novoLogin = new NovoLogin();

			_novoLogin.email = $scope.email;
			_novoLogin.login = $scope.login;
			_novoLogin.senha = $scope.senha;
			_novoLogin.tipo = $scope.tipoCliente;
			_novoLogin.status = "B";

			_novoLogin.$save(function(novo) {
				var _novoComplemento = new NovoComplemento();

				_novoComplemento.objectIdLogin = novo._id;
				_novoComplemento.nome = $scope.empresa;
				_novoComplemento.dataInclusao = new Date();

				_novoComplemento.$save();

				if ($scope.tipoCliente == "M") { 
					$scope.listaOfertas.forEach(
						function(pagina, index, lista) {
							var _novoUnbounce = new NovoUnbounce();

							_novoUnbounce.objectIdLogin = novo._id;
							_novoUnbounce.nome = pagina.Nome;
							_novoUnbounce.status = "B";
							_novoUnbounce.dataEntrada = new Date(pagina.DataEntrada);

							_novoUnbounce.$save();

							if (index == lista.length - 1) {
								$location.path('/administrativo');
							}
						});
				}
			});
		};
	});