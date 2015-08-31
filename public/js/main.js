angular.module('reachtarget', ['ngRoute', 'ngResource'])
	.config(function($routeProvider, $locationProvider) {

		/*
		$locationProvider.html5Mode({
  			enabled: true,
  			requireBase: false
		});
		*/

		/*

		$routeProvider.when('/novoCliente', {
			templateUrl: 'partials/novoCliente.html',
			controller: 'NovoClienteController'
		});

		$routeProvider.when('/projecao', {
			templateUrl: 'partials/projecao.html',
			controller: 'ProjecaoController'
		});

		
		$routeProvider.when('/administrativo', {
			templateUrl: 'partials/administrativo.html',
			controller: 'AdministrativoController'
		});

		$routeProvider.when('/analise', {
			templateUrl: 'partials/analise.html',
			controller: 'AnaliseController'
		});


		$routeProvider.when('/campanhas', {
			templateUrl: 'partials/campanhas.html',
			controller: 'CampanhasController'
		});

		$routeProvider.when('/cliente', {
			templateUrl: 'partials/cliente.html',
			controller: 'ClienteController'
		});

		$routeProvider.when('/dashboard', {
			templateUrl: 'partials/dashboard.html',
			controller: 'DashboardController'
		});

		$routeProvider.when('/fichaLead', {
			templateUrl: 'partials/fichaLead.html',
			controller: 'FichaLeadController'
		});

		$routeProvider.when('/googleAnalytics', {
			templateUrl: 'partials/googleAnalytics.html',
			controller: 'GoogleAnalyticsController'
		});

		$routeProvider.when('/historico', {
			templateUrl: 'partials/historico.html',
			controller: 'HistoricoController'
		});

		$routeProvider.when('/investimento', {
			templateUrl: 'partials/investimento.html',
			controller: 'InvestimentoController'
		});

		$routeProvider.when('/leads', {
			templateUrl: 'partials/leads.html',
			controller: 'LeadsController'
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
			templateUrl: 'partials/novoCliente.html',
			controller: 'NovoClienteController'
		});

		$routeProvider.when('/administrativo/cliente', {
			templateUrl: 'partials/cliente.html',
			controller: 'ClienteController'
		});


		$routeProvider.when('/leads', {
			templateUrl: 'partials/leadsMaaS.html',
			controller: 'LeadsMaaSController'
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