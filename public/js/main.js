angular.module('reachtarget', ['ngRoute', 'ngResource'])
	.config(function($routeProvider, $locationProvider) {

		/*
		$locationProvider.html5Mode({
  			enabled: true,
  			requireBase: false
		});
		*/

		$routeProvider.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginController'
		});


		$routeProvider.when('/administrativo', {
			templateUrl: 'partials/administrativo.html',
			controller: 'AdministrativoController'
		});


		$routeProvider.when('/administrativo/novoCliente', {
			templateUrl: 'partials/cliente.html',
			controller: 'ClienteController'
		});

		$routeProvider.when('/administrativo/cliente', {
			templateUrl: 'partials/cliente.html',
			controller: 'ClienteController'
		});


		$routeProvider.when('/briefing', {
			templateUrl: 'partials/briefingMaaS.html',
			controller: 'BriefingMaaSController'
		});


		$routeProvider.when('/leads', {
			templateUrl: 'partials/leadsMaaS.html',
			controller: 'LeadsMaaSController'
		});

		$routeProvider.when('/leads/fichaDoLead', {
			templateUrl: 'partials/fichaLeadMaaS.html',
			controller: 'FichaLeadMaaSController'
		});


		$routeProvider.when('/resultados/estatisticas', {
			templateUrl: 'partials/estatisticasMaaS.html',
			controller: 'EstatisticasMaaSController'
		});

		$routeProvider.when('/resultados/leads', {
			templateUrl: 'partials/analiseLeadsMaaS.html',
			controller: 'AnaliseLeadsMaaSController'
		});

		$routeProvider.when('/resultados/canais', {
			templateUrl: 'partials/canaisMaaS.html',
			controller: 'CanaisMaaSController'
		});


		$routeProvider.when('/acoes/adwords', {
			templateUrl: 'partials/adwordsMaaS.html',
			controller: 'AdwordsMaaSController'
		});


		$routeProvider.when('/estrategia/objetivos', {
			templateUrl: 'partials/objetivosMaaS.html',
			controller: 'ObjetivosMaaSController'
		});

		$routeProvider.when('/estrategia/timeline', {
			templateUrl: 'partials/timelineMaaS.html',
			controller: 'TimelineMaaSController'
		});

		$routeProvider.when('/estrategia/metas', {
			templateUrl: 'partials/metasMaaS.html',
			controller: 'MetasMaaSController'
		});


		$routeProvider.when('/configuracoes/dadosCadastrais', {
			templateUrl: 'partials/dadosCadastraisMaaS.html',
			controller: 'DadosCadastraisMaaSController'
		});



		$routeProvider.otherwise({redirectTo: '/login'});
	});