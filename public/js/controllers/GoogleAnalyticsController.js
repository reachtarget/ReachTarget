angular.module('reachtarget')
	.controller('GoogleAnalyticsController', function($resource, $scope, $location, LoginService) {
		$scope.habilitarBotaoGA = false;

		$scope.contaSelecionada = '';
		$scope.propriedadeSelecionada = '';
		$scope.perfilSelecionado = '';

		$scope.accounts = null;
		$scope.webPropertyIds = null;
		$scope.profileIds = null;

	  	gapi.analytics.ready(function() {
			gapi.analytics.auth.authorize({
				container: 'embed-api-auth-container',
		    	clientid: '863929293926-en9k6pp6u8pni12osmel9do4pk615ep1.apps.googleusercontent.com',
		    	userInfoLabel: '',
		    	immediate: false
			});

			gapi.analytics.auth.on('success', function(response) {
				$scope.popularAccounts();
				$scope.habilitarBotaoGA = true;

				LoginService.accessToken = gapi.auth.getToken().access_token;
			});
		});

		$scope.popularAccounts = function() {
			gapi.client.analytics.management.accounts.list().execute(
				function(resultadosAccounts) {
					$scope.accounts = [];

					resultadosAccounts.items
					 	.forEach(function(item)
					 	{
					 		$scope.accounts.push(
								{
									"id": item.id,
									"nome": item.name + ' (' + item.id + ')'
								});
						});

					$scope.$apply();
			});
		};

		$scope.popularWebPropertyId = function(account) {
			gapi.client.analytics.management.webproperties.list(
				{ 
					'accountId': account
				})
				.execute(function (resultadosWebPropertyIds) {
					$scope.webPropertyIds = [];

					resultadosWebPropertyIds.items
						.forEach(function(item)
						{
							$scope.webPropertyIds.push(
								{
									"id": item.id,
									"nome": item.name + ' (' + item.id + ')'
								});
						});

					$scope.$apply();
			});	
		};

		$scope.popularProfileId = function(account, webProperty) {
			gapi.client.analytics.management.profiles.list(
				{ 
					'accountId': account,
					'webPropertyId': webProperty,
				})
				.execute(function (resultadosProfileIds) {
					$scope.profileIds = [];

					resultadosProfileIds.items
						.forEach(function(item)
						{
							$scope.profileIds.push(
								{
									"id": item.id,
									"nome": item.name + ' (' + item.id + ')'
								});
						});

					$scope.$apply();
			});
		};


		var GA = $resource('/ga');

		$scope.gravarDadosAnalytics = function() {
			var ga = new GA();

			ga.idLogin = LoginService.idUsuarioLogado;
			ga.accessToken = LoginService.accessToken; 
			ga.accountId = $scope.contaSelecionada;
			ga.webPropertyId = $scope.propriedadeSelecionada;
			ga.profileId = $scope.perfilSelecionado;

			ga.$save()
				.then(function() {
					LoginService.googleAnalyticsAutorizado = true;
					$location.path('/analise');
				});
		};
});
