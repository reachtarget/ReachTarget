angular.module('reachtarget')
	.controller('NovoClienteController', function($scope, $location, $resource, LoginService) {
		$scope.contaSelecionada = '';
		$scope.propriedadeSelecionada = '';
		$scope.perfilSelecionado = '';

		$scope.accounts = null;
		$scope.webPropertyIds = null;
		$scope.profileIds = null;		

		$scope.listaPaginasUnbounce = [];

		$scope.empresa = "";
		$scope.email = "";
		$scope.login = "";
		$scope.senha = "";
		$scope.adwords = "";
		$scope.apikeymailchimp = "";

		$scope.tipoSelecionado = (LoginService.TipoAdministrativo == "S") ? "C" : "M";

		$scope.paginaNome = "";
		$scope.paginaPageID = "";
		$scope.paginaPagePath = "";
		$scope.paginaAdwords = "";


		var _accessToken = "";
		var _refreshToken = "";


		var NovoLogin = $resource('/login');
		var NovoComplemento = $resource('/complementoLogin');
		var NovoGoogle = $resource('/google');
		var NovoMailchimp = $resource('/mailchimp');
		var NovoUnbounce = $resource('/unbounce');

		var Google = $resource('/google/:objectIdLogin');
		var Analytics = $resource('/analytics/:code/:objectIdLogin');
		var Token = $resource('/token/analytics/:accessToken/:refreshToken/:id');

		var EnviarEmailLogin = $resource('/email/novo/login');


		$scope.conectarGA = function() {
			gapi.client.setApiKey(LoginService.ApiKey);

			Google.get({
				objectIdLogin: LoginService.objectIdLogin
			}, function(resultado) {
				if (resultado.accessToken) {
					Token.get({
						accessToken: resultado.accessToken,
						refreshToken: resultado.refreshToken,
						id: resultado._id
					}, function(token){
						_accessToken = resultado.accessToken;
						_refreshToken = resultado.refreshToken;

						gapi.auth.setToken({
							access_token: token.accessToken
						});

						$scope.carregarAPIAnalytics();
					});					
				} else {
					gapi.auth.authorize({
    					client_id: LoginService.ClienteID,
    					scope: 'https://www.googleapis.com/auth/analytics.readonly',
    					response_type: 'code',
    					approval_prompt: 'force',
    					access_type: 'offline',
    					immediate: false
    				}, function(response){
    					Analytics.get({
    						code: response.code,
    						objectIdLogin: LoginService.objectIdLogin
    					}, function(){
    						$scope.carregarAPIAnalytics();
    					});
    				});
				}
			});
		};

		$scope.carregarAPIAnalytics = function() {
			gapi.client.load('analytics', 'v3', function(){
      			$scope.popularListaAccounts();	
	      	});	
		};

		$scope.popularListaAccounts = function(itemLead) {
			gapi.client.analytics.management.accounts.list().execute(
    			function(resultadosAccounts) {
    				if (itemLead) {
    					itemLead.accounts = [];
    				} else {
    					$scope.accounts = [];	
    				}

      				resultadosAccounts.items
        				.forEach(function(item, index, array)
        				{
        					if (itemLead) {
	          					itemLead.accounts.push({
        	    					"id": item.id,
            						"nome": item.name + ' (' + item.id + ')'
          						});
	          				} else {
	          					$scope.accounts.push({
        	    					"id": item.id,
            						"nome": item.name + ' (' + item.id + ')'
          						});	          					
	          				}

				        	if (index == array.length-1) {
				        		$scope.$apply();
          					}
        				});
    		});
		};

		$scope.popularListaWebPropertyId = function(itemLead) {
			gapi.client.analytics.management.webproperties.list(
    		{ 
      			'accountId': ((itemLead) ? itemLead.ContaSelecionada : $scope.contaSelecionada)
    		})
    		.execute(function (resultadosWebPropertyIds) {
    			if (itemLead) {
    				itemLead.webPropertyIds = []
    			} else {
    				$scope.webPropertyIds = [];	
    			}      			

			    resultadosWebPropertyIds.items
        			.forEach(function(item, index, array)
        			{
        				if (itemLead) {
        					itemLead.webPropertyIds.push(
          					{
	            				"id": item.id,
    	        				"nome": item.name + ' (' + item.id + ')'
        	  				});
        				}
        				else {
          					$scope.webPropertyIds.push(
          					{
	            				"id": item.id,
    	        				"nome": item.name + ' (' + item.id + ')'
        	  				});
          				}
        			});
    		});
		};

		$scope.popularListaProfileId = function(itemLead) {
			gapi.client.analytics.management.profiles.list(
  			{ 
    			'accountId': (itemLead) ? itemLead.ContaSelecionada : $scope.contaSelecionada,
    			'webPropertyId': (itemLead) ? itemLead.PropriedadeSelecionada : $scope.propriedadeSelecionada
  			})
  			.execute(function (resultadosProfileIds) {
  				if (itemLead) {
  					itemLead.profileIds = [];
  				} else {
  					$scope.profileIds = [];	
  				}    			

    			resultadosProfileIds.items
      				.forEach(function(item, index, array)
      				{
      					if (itemLead) {
      						itemLead.profileIds.push(
        					{
          						"id": item.id,
          						"nome": item.name + ' (' + item.id + ')'
        					});
      					}
      					else {
        					$scope.profileIds.push(
        					{
          						"id": item.id,
          						"nome": item.name + ' (' + item.id + ')'
        					});
        				}
 				    });
  			});
		};

		$scope.unbounce = function() {		
			$scope.paginaNome = "";
			$scope.paginaPageID = "";
			$scope.paginaPagePath = "";
			$scope.paginaAdwords = "";
			$scope.contaSelecionada = "";
			$scope.propriedadeSelecionada = "";
			$scope.perfilSelecionado = "";

			$('#modalUnbounce').modal('show');		
		};

		$scope.fecharModalUnbounce = function() {
			$scope.listaPaginasUnbounce.push({
				IDPagina: $scope.paginaPageID,
				Nome: $scope.paginaNome,
				NomeLanding: $scope.paginaNome,
				PagePath: $scope.paginaPagePath,
				Adwords: $scope.paginaAdwords,
				DataEntrada: new Date(),
				ContaSelecionada: $scope.contaSelecionada,
				PropriedadeSelecionada: $scope.propriedadeSelecionada,
				PerfilSelecionado: $scope.perfilSelecionado
			});

			$('#modalUnbounce').modal('hide');
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
			_novoLogin.tipo = ($scope.tipoSelecionado == "C") ? "S" : "M";
			_novoLogin.status = "A";

			_novoLogin.$save(function(novo){
				var _novoComplemento = new NovoComplemento();

				_novoComplemento.objectIdLogin = novo._id;
				_novoComplemento.nome = $scope.empresa;
				_novoComplemento.dataInclusao = new Date();

				_novoComplemento.$save();


				if ($scope.tipoSelecionado == "C") { 
					var _novoGoogle = new NovoGoogle();

					_novoGoogle.objectIdLogin = novo._id;
					_novoGoogle.idAdwords = $scope.adwords;
					_novoGoogle.accountId = $scope.contaSelecionada;
					_novoGoogle.webPropertyId = $scope.propriedadeSelecionada;
					_novoGoogle.profileId = $scope.perfilSelecionado;
					_novoGoogle.accessToken = _accessToken;
					_novoGoogle.refreshToken = _refreshToken;

					_novoGoogle.$save();	


					var _novoMailchimp = new NovoMailchimp();

					_novoMailchimp.objectIdLogin = novo._id;
					_novoMailchimp.apiKey = $scope.apikeymailchimp;

					_novoMailchimp.$save();


					
					$location.path('/administrativo');

				} else if ($scope.tipoSelecionado == "M") { 
					$scope.listaPaginasUnbounce
						.forEach(function(paginaUnbounce, index, lista) {

							var _novoUnbounce = new NovoUnbounce();

							_novoUnbounce.objectIdLogin = novo._id;
							_novoUnbounce.pageId = paginaUnbounce.IDPagina;
							_novoUnbounce.nome = paginaUnbounce.NomeLanding;
							_novoUnbounce.pagePath = paginaUnbounce.PagePath;
							_novoUnbounce.status = "A";
							_novoUnbounce.dataEntrada = new Date(paginaUnbounce.DataEntrada);

							_novoUnbounce.$save();


							var _novoGoogle = new NovoGoogle();

							_novoGoogle.objectIdLogin = novo._id;
							_novoGoogle.unbouncePageId = paginaUnbounce.IDPagina;
							_novoGoogle.idAdwords = paginaUnbounce.Adwords;
							_novoGoogle.accountId = paginaUnbounce.ContaSelecionada;
							_novoGoogle.webPropertyId = paginaUnbounce.PropriedadeSelecionada;
							_novoGoogle.profileId = paginaUnbounce.PerfilSelecionado;
							_novoGoogle.accessToken = gapi.auth.getToken().access_token;

							_novoGoogle.$save();


							if (index == lista.length - 1) {
								$location.path('/administrativo');
							}
					});
				}
			});
		};

		$scope.conectarGA();
	});