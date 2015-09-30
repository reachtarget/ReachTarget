angular.module('reachtarget')
    .controller('DadosCadastraisMaaSController', function($resource, $scope, $location, LoginService) {

    $scope.empresa = "";
    $scope.eMailContato = "";
    $scope.novaSenha = "";
    $scope.repetirNovaSenha = "";

    $scope.usuarioSenhaInvalido = true;
    $scope.mensagemUsuarioSenhaInvalido = "";

    var NovoLogin = $resource('/login');
    var ComplementoLogin = $resource('/complementoLogin');

    $scope.consultarDadosCadastrais = function() {
    	$scope.empresa = LoginService.nomeEmpresa;
    	$scope.eMailContato = LoginService.login.email;
    };

    $scope.salvarDadosCadastrais = function() {
    	if ((!$scope.empresa) || ($scope.empresa == null) || ($scope.empresa == '')) {

    		$scope.usuarioSenhaInvalido = true;
    		$scope.mensagemUsuarioSenhaInvalido = "Empresa não pode ser nula.";

    	} else if ((!$scope.eMailContato) || ($scope.eMailContato == null) || ($scope.eMailContato == '')) {

    		$scope.usuarioSenhaInvalido = true;
    		$scope.mensagemUsuarioSenhaInvalido = "E-mail de contato não pode ser nulo.";

    	} else if ($scope.novaSenha != $scope.repetirNovaSenha) {

    		$scope.usuarioSenhaInvalido = true;
    		$scope.mensagemUsuarioSenhaInvalido = "Senhas estão diferentes.";

    	} else {

    		abrirLoader();

    		$scope.usuarioSenhaInvalido = false;

            var _complementoLogin = new ComplementoLogin();

            _complementoLogin._id = LoginService.complementoLogin._id;
            _complementoLogin.objectIdLogin = LoginService.complementoLogin.objectIdLogin;
            _complementoLogin.nome = $scope.empresa;
            _complementoLogin.dataInclusao = LoginService.dataInclusao;

            _complementoLogin.$save();
            LoginService.nomeEmpresa = $scope.empresa;


            if (($scope.novaSenha != null) && ($scope.novaSenha != '')) {
        		
                var _novoLogin = new NovoLogin();

    			_novoLogin._id = LoginService.login._id;
    			_novoLogin.email = $scope.eMailContato;
    			_novoLogin.login = LoginService.login.login;
    			_novoLogin.senha = $scope.novaSenha;
    			_novoLogin.tipo = LoginService.login.tipo;
    			_novoLogin.status = LoginService.login.status;

    			_novoLogin.$save();
            }

			$scope.novaSenha = "";
			$scope.repetirNovaSenha = "";			
    	}

    	setTimeout(function(){ fecharLoader(); }, 500);
    };

    $scope.consultarDadosCadastrais();

});