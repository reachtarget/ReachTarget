angular.module('reachtarget')
	.controller('LoginController', function($scope, $location, $resource, LoginService, $rootScope) {
		$scope.login = '';
		$scope.senha = '';

		$scope.TituloDaPagina = "Marketing as a Service";
		$scope.lembrarDeMim = false;
		$scope.senhaAnterior = "";
		$scope.novaSenha = "";

		$scope.disparoEmailLoginSenha = false;

		$scope.usuarioSenhaInvalido = false;
		$scope.mensagemUsuarioSenhaInvalido = 'Usuário/senha inválido.';

		$rootScope.logado = false;
		$scope.esqueciSenha = false;

		$scope.administrador = false;
		$scope.searchOuInbound = false;

		$scope.campanhaSelecionada = "";
		
		var _accessToken = "";
		var _refreshToken = "";

		var NovoLogin = $resource('/login');
		var Login = $resource('/login/:login');
		var EnviarEmailLogin = $resource('/email/novo/login');
		var ComplementoLogin = $resource('/complementoLogin/:objectIdLogin');

		var TokenGoogle = $resource('/google/:objectIdLogin');
		var RefreshToken = $resource('/token/analytics/:accessToken/:refreshToken/:id');

		var CampanhasPorUsuario = $resource('/unbounce/:objectId');
		var GoogleAnalyticsPorCampanha = $resource('/google/:objectIdLogin/:unbouncePageId');


		$scope.atualizarPopover = function() {
			$('#selectCampanhas')
				.find('option')
				.remove();

			$("[data-toggle=popover]").popover({
			    html : true,
		        trigger: 'manual',

		        content: function() {
		          	var content = $(this).attr("data-popover-content");
		          	return $(content).children(".popover-body").html();
		        },

		        title: function() {
		          	var title = $(this).attr("data-popover-content");
		          	return $(title).children(".popover-heading").html();
		        }
		    })
		    .click(function() {
				$("[data-toggle=popover]").popover('show');

				$('.popover').css('width', '350px');
				$('.popover').css('max-width', '350px');
				$('.popover .arrow').css('left', '50px');

				if ($('#selectCampanhas')[0].length <= 0) {
					$scope.popularDadosDate();

					$.each(LoginService.ListaCampanhas, function (i, item, lista) {
					    $('#selectCampanhas').append(
					    	$('<option>', 
					    		{ 
					        		value: item.IDPagina,
					        		text: item.Nome
					    		}));
						});

					if (LoginService.SelectedIndex) {
						$('#selectCampanhas')[0].selectedIndex = LoginService.SelectedIndex;
					}

					$("#bttnFecharFiltros").click(
						function(){
							$("[data-toggle=popover]").popover('hide');
						});

					$("#bttnAtualizarFiltros").click(
				    	function(){
				    		var e = document.getElementById("selectCampanhas");

				    		$('#campanhaSelecionada')[0].innerText = 
				    			e.options[e.selectedIndex].text;
							
							$('#periodoSelecionado')[0].innerHTML =
								retornarDataInicialFinal(LoginService.DataInicial, LoginService.DataFinal);


							LoginService.SelectedIndex = e.selectedIndex;

				    		LoginService.ListaCampanhas.forEach(function(item) {

				    			if (item.IDPagina == e.options[e.selectedIndex].value) {

				    				$("[data-toggle=popover]").popover('hide');
				    				
				    				LoginService.CampanhaSelecionada = item;
				    				LoginService.clickAtualizarFiltro();
				    				
				    			}
				    		});
				    });
				}
		    });
		};

        $scope.popularDadosDate = function() {
        	if (!LoginService.DataInicial) {

	    		LoginService.DataInicial = moment().subtract(6, 'days')._d;
	    		LoginService.DataInicialFormat = moment().subtract(6, 'days').format('YYYY-MM-DD');
	    		
				LoginService.DataFinal = moment()._d;
	    		LoginService.DataFinalFormat = moment().format('YYYY-MM-DD');
    		}


    		$('#daterange')[0].value = 
    			retornarDataInicialFinal(
    				LoginService.DataInicial, LoginService.DataFinal);

        	$('#periodoSelecionado')[0].innerHTML = 
        		$('#daterange')[0].value;


    		$('#daterange').daterangepicker({
    			format: 'YYYY-MM-DD',
    			startDate: LoginService.DataInicialFormat,
    			endDate: LoginService.DataFinalFormat,
    			opens: 'left',
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
				LoginService.DataInicial = start._d;
    			LoginService.DataInicialFormat = start.format('YYYY-MM-DD');

				LoginService.DataFinal = end._d;
    			LoginService.DataFinalFormat = end.format('YYYY-MM-DD');

    			$('#daterange')[0].value = 
    				retornarDataInicialFinal(
    					LoginService.DataInicial, LoginService.DataFinal);
			});
        };

		$scope.sair = function() {
			apagarCookie('rtmaassiteinaloginsenha');

			$location.path('/login');
		};

		$scope.abrirTela = function() {
			var _cookie = lerCookie('rtmaassiteinaloginsenha');
			$scope.PermiteExcluirLead = false;

			if ((_cookie != null) && (_cookie != "")) {
					$scope.abrirDadosCookie(_cookie);
			} else {
				_cookie = lerCookie('abrirDashboardMaaS');

				if ((_cookie != null) && (_cookie != "")) {
					$scope.PermiteExcluirLead = true;

					$scope.abrirDadosCookie(_cookie);
					apagarCookie('abrirDashboardMaaS');
				}
			}
		};

		$scope.abrirDadosCookie = function(parametroCookie)  {
			var _lista = parametroCookie.split('#');

			$scope.login = _lista[2];
			$scope.senha = _lista[4];

			abrirLoader();

			setTimeout(function(){
				$scope.validarLogin();
			}, 
			500);			
		};

		$scope.enter = function(keyEvent){
			if (keyEvent.which === 13) {
    			$scope.validarLogin();
			}
		};

		$scope.desabilitarNavBar = function() {
			$scope.definicoesViaURL();

			document.getElementById('headerNav').style.display = 'none';
			
			$scope.abrirTela();
		};

		$scope.ajustarHeader = function(opcao) {
			document.getElementById('headerNav').style.display = 'block';

			if (opcao == 'adm') {

				document.getElementById('logoCliente').style.display = 'none';
				
				document.getElementById('leads').style.visibility = 'hidden';
				document.getElementById('resultados').style.visibility = 'hidden';
				document.getElementById('acoes').style.visibility = 'hidden';
				document.getElementById('estrategia').style.visibility = 'hidden';
				document.getElementById('menuDadosCadastraisMaaS').style.display = 'none';
				document.getElementById('menuFaturasMaaS').style.visibility = 'hidden';
				
			} else if (opcao == 'maas') {

				document.getElementById('leads').style.visibility = 'visible';
				document.getElementById('resultados').style.visibility = 'visible';
				document.getElementById('acoes').style.visibility = 'visible';
				document.getElementById('estrategia').style.visibility = 'visible';
				document.getElementById('menuDadosCadastraisMaaS').style.display = 'block';
				document.getElementById('menuFaturasMaaS').style.visibility = 'visible';

				document.getElementById('logoCliente').style.display = 'block';
				document.getElementById('logoCliente').src = 'https://s3-ap-southeast-2.amazonaws.com/siteina/maas/logo-clientes/' + $scope.login + '.png';
			} 
			
			LoginService.AbriuPeloLogin = true;
		};

		$scope.definicoesViaURL = function() {
			var _favicon = 'vendor/bootstrap/img/siteina/favicon.ico';
			var _login = 'vendor/bootstrap/img/siteina/logo-siteina-login.png';
			var _topo = 'vendor/bootstrap/img/siteina/turbina-siteina-top.png';

			if (!LoginService.URLAcesso)
				LoginService.URLAcesso = document.URL;

			var _urlAcesso = document.URL.substr(7, 6);

			if (_urlAcesso == 'localh') {

				_favicon = 'vendor/bootstrap/img/maas/favicon.ico'
				_login = 'vendor/bootstrap/img/maas/logotipo-marketing-as-a-service.png';
				_topo = 'vendor/bootstrap/img/maas/marketing-as-a-service-logo.png';

				LoginService.ApiKey = "AIzaSyDUOhF8MLsDonJgYk9Q6vRWi9dyJd8pNEo";
				LoginService.ClienteID = "863929293926-e0vpdck7kc9tgo3eoqgemrrdm5jludg9.apps.googleusercontent.com";
				LoginService.ClientSecret = "eAoscMWb7lWWfeKIBwxko9lM";
				LoginService.RedirectUri = "http://localhost:3000/oauth2callback";
				LoginService.TipoAdministrativo = "M";

				$scope.TituloDaPagina = "Dashboard - Marketing as a Service";

			} else if (_urlAcesso == 'app.si') {

				_favicon = 'vendor/bootstrap/img/siteina/favicon.ico';
				_login = 'vendor/bootstrap/img/siteina/logo-siteina-login.png';
				_topo = 'vendor/bootstrap/img/siteina/turbina-siteina-top.png';

				LoginService.ApiKey = "AIzaSyCAdyjjMHGNEjrYBsGSJ2i5Hds8ITWxy3Y";
				LoginService.ClienteID = "863929293926-tphcv8l06anerpb3pp3j2l7qmpd3el7i.apps.googleusercontent.com";
				LoginService.ClientSecret = "0tvPEJOtfB73Xx5wAZJb_tNS";
				LoginService.RedirectUri = "http://app.siteina.com.br/oauth2callback";
				LoginService.TipoAdministrativo = "S";

				$scope.TituloDaPagina = "Dashboard - Siteina";

			} else if (_urlAcesso == 'app.ma') {

				_favicon = 'vendor/bootstrap/img/maas/favicon.ico'
				_login = 'vendor/bootstrap/img/maas/logotipo-marketing-as-a-service.png';
				_topo = 'vendor/bootstrap/img/maas/marketing-as-a-service-logo.png';

				LoginService.ApiKey = "AIzaSyA5L6mZ0dHDEDLqNAghtbPbv-PJHNgQZpU";
				LoginService.ClienteID = "863929293926-fejn11qs6o2nmlmu78asmtlog5ovjupq.apps.googleusercontent.com";
				LoginService.ClientSecret = "i1pf3CSeD8fPClFqfsOH6SBl";
				LoginService.RedirectUri = "http://app.marketingasaservice.com.br/oauth2callback";
				LoginService.TipoAdministrativo = "M";

				$scope.TituloDaPagina = "Marketing as a Service";

			} else if (_urlAcesso == 'app.re') {

				_favicon = '';
				_login = '';
				_topo = '';

				LoginService.ApiKey = "AIzaSyCaNF8bF-q_HtKcZRniQ6u5ErP1S0Ol-C0";
				LoginService.ClienteID = "863929293926-e6jsrke6hh3olpps5b04a1a515lt8586.apps.googleusercontent.com";
				LoginService.ClientSecret = "btSSS0N7x0dGgfYq1FDpQwM-";
				LoginService.RedirectUri = "http://app.reachtarget.com.br/oauth2callback";
				LoginService.TipoAdministrativo = "C";

				$scope.TituloDaPagina = "ReachTarget";

			} else if (_urlAcesso == 'homolo') {

				_favicon = 'vendor/bootstrap/img/maas/favicon.ico'
				_login = 'vendor/bootstrap/img/maas/logotipo-marketing-as-a-service.png';
				_topo = 'vendor/bootstrap/img/maas/marketing-as-a-service-logo.png';

				LoginService.ApiKey = "AIzaSyCRufP9DpO_dFh_JC7BLtmTY4L7PyFfDYM";
				LoginService.ClienteID = "863929293926-mdjncleikusp23iukjip8c3cthb3lu1v.apps.googleusercontent.com";
				LoginService.ClientSecret = "vPToXTnMnVGp1nW86RBGzvb6";
				LoginService.RedirectUri = "http://homologacao.marketingasaservice.com.br/oauth2callback";
				LoginService.TipoAdministrativo = "M";

				$scope.TituloDaPagina = "Marketing as a Service";

			}

			var link = document.createElement('link');
    		link.type = 'image/x-icon';
    		link.rel = 'shortcut icon';
    		link.href = _favicon;
    		document.getElementsByTagName('head')[0].appendChild(link);


			var _imgLogin = document.getElementById('imgLogin');

			if (_imgLogin) 
				_imgLogin.src = _login;


			var _imgTopo = document.getElementById('logoTopo');

			if (_imgTopo)
				_imgTopo.src = _topo;
		};

		$scope.validarLogin = function() {
			if (($scope.login == '') || ($scope.login == null) ||
				($scope.senha == '') || ($scope.senha == null)) 
				return;


			abrirLoader();

			$scope.administrador = false;
			$scope.searchOuInbound = false;
			$scope.disparoEmailLoginSenha = false;
			
			Login.get({ 

				login: $scope.login 

			}, function(resultadoLogin){
				
				if ((resultadoLogin) && (resultadoLogin.senha == $scope.senha) && 
					((resultadoLogin.status == "A") || (resultadoLogin.status == "B"))) {
					
					LoginService.login = resultadoLogin;
					LoginService.objectIdLogin = resultadoLogin._id;
					LoginService.accountIDUnbounce = "1109373";
					LoginService.tipoLogin = resultadoLogin.tipo;

					if ((resultadoLogin.tipo != 'A') && (LoginService.TipoAdministrativo != resultadoLogin.tipo)) {

						$scope.mensagemUsuarioSenhaInvalido = 'Usuário/senha inválido.';
						$scope.loginSenhaInvalidos();

					} else {

						ComplementoLogin.get({

							objectIdLogin: LoginService.objectIdLogin

						}, function(resultadoComplemento){
							
							if (resultadoComplemento) {
								LoginService.nomeEmpresa = resultadoComplemento.nome;
								LoginService.complementoLogin = resultadoComplemento;
							}

						});

						$scope.logado = true;

						if (resultadoLogin.tipo == 'A') {

							$scope.administrador = true;

							$scope.ajustarHeader('adm');
							$location.path('/administrativo');

							$scope.incluirFiltrosAdministrativos();

						} else if (resultadoLogin.status == 'B') {

							$scope.ajustarHeader('adm');
							$location.path('/briefing');

						} else {

							if ($scope.lembrarDeMim) {
								gravarCookie(
									'rtmaassiteinaloginsenha', 
									'#l#' + $scope.login + '#s#' + $scope.senha, 
									90);								
							}

							LoginService.PermiteExcluirLead = $scope.PermiteExcluirLead;
							$scope.consultarCampanhasPorUsuario();							
						}
					}

				} else {

					$scope.mensagemUsuarioSenhaInvalido = 'Usuário/senha inválido.';
					$scope.loginSenhaInvalidos();

				}
			});
		};

		$scope.incluirFiltrosAdministrativos = function() {
			LoginService.ListaCampanhas = [];

			$('#campanhaSelecionada')[0].innerText = 'Clientes ativos';

			LoginService.ListaCampanhas.push({
				IDPagina: 'A',
				Nome: 'Clientes ativos',
				PagePath: '/',
				ProfileID: '',
				Adwords: '-'
			});

			LoginService.ListaCampanhas.push({
				IDPagina: 'B',
				Nome: 'Cliente em ativação',
				PagePath: '/',
				ProfileID: '',
				Adwords: '-'
			});

			LoginService.ListaCampanhas.push({
				IDPagina: 'I',
				Nome: 'Clientes inativos',
				PagePath: '/',
				ProfileID: '',
				Adwords: '-'
			});

			LoginService.CampanhaSelecionada = LoginService.ListaCampanhas[0];
			LoginService.SelectedIndex = 0;

			$scope.popularDadosDate();
			$scope.atualizarPopover();
		};

		$scope.consultarCampanhasPorUsuario = function() {
			var _todas = false;
			LoginService.ListaCampanhas = [];

			CampanhasPorUsuario.query({

				objectId: LoginService.objectIdLogin

			}, function(resultadoCampanhasPorUsuario) {

				if (resultadoCampanhasPorUsuario.length > 1) {
						
					if (LoginService.ListaCampanhas.length == 0)
					{
						$('#campanhaSelecionada')[0].innerText = '<Todas>';

						_todas = true;

						LoginService.ListaCampanhas.push({
							IDPagina: '-',
							Nome: '<Todas>',
							PagePath: '/',
							ProfileID: '',
							Adwords: '-'
						});
					}
				}

				resultadoCampanhasPorUsuario.forEach(function(itemCampanha, indexCampanha, listaCampanha) {

					GoogleAnalyticsPorCampanha.get({
						
						objectIdLogin: LoginService.objectIdLogin,
						unbouncePageId: itemCampanha.pageId

					}, function(resultadoGoogleAnalyticsPorCampanha) {

						LoginService.ListaCampanhas.push({
							IDCampanha: itemCampanha._id,
							IDPagina: itemCampanha.pageId,
							Nome: itemCampanha.nome,
							PagePath: itemCampanha.pagePath,
							ProfileID: resultadoGoogleAnalyticsPorCampanha.profileId,
							Adwords: resultadoGoogleAnalyticsPorCampanha.idAdwords,
							Campanha: resultadoGoogleAnalyticsPorCampanha
						});

						if (indexCampanha == listaCampanha.length-1) {
							if (_todas)
								LoginService.ListaCampanhas[0].ProfileID = LoginService.ListaCampanhas[1].ProfileID;

							$('#campanhaSelecionada')[0].innerText = LoginService.ListaCampanhas[0].Nome;
							LoginService.CampanhaSelecionada = LoginService.ListaCampanhas[0];
							LoginService.SelectedIndex = 0;

							$scope.popularDadosDate();
							$scope.consultarAnalytics();				
							$scope.atualizarPopover();
						}
					});
				});
			});
		};

		$scope.consultarAnalytics = function() {
			Login.get({

    			login: 'maas'

    		}, function(resLoginToken) {

    			TokenGoogle.get({

    				objectIdLogin: resLoginToken._id

    			}, function(resTokenGoogle){

	    			_idLoginToken = resTokenGoogle._id;
    				_accessToken = resTokenGoogle.accessToken;
    				_refreshToken = resTokenGoogle.refreshToken;    

    				$scope.validarGAPI(true);	    				
    			});
    		});				
		};

		$scope.validarGAPI = function(token) {
			if (token) {
				gapi.client.setApiKey(LoginService.ApiKey);

    			gapi.auth.setToken({
					access_token: _accessToken
				});
			}	

			gapi.client.load('analytics', 'v3', function(){
				var _data = new Date();
				var _dataTesteGA = _data.getFullYear() + "-" + lpad(new Number(_data.getMonth() + 1), 2) + "-" + lpad(_data.getDate(), 2);

				gapi.client.analytics.data.ga.get({
                	'ids': 'ga:60998176',
                	'start-date': _dataTesteGA,
                	'end-date': _dataTesteGA,
                	'metrics': 'ga:sessions',
            	})
            	.execute(function(resultado) {   
            		if ((resultado.code) && (resultado.code == 401)) {
						$scope.refreshToken();
            		} else {
            			fecharLoader();

						$scope.ajustarHeader('maas');

						$location.path('/resultados/estatisticas');
            			$scope.$apply();
            		}
            	});
			});		
		};

		$scope.refreshToken = function() {
			RefreshToken.get({

				accessToken: _accessToken,
				refreshToken: _refreshToken,
				id: _idLoginToken

			}, function(resRefreshToken){

				_accessToken = resRefreshToken.accessToken;
				_refreshToken = resRefreshToken.refreshToken;

				gapi.client.setApiKey(LoginService.ApiKey);

    			gapi.auth.setToken({
					access_token: _accessToken
				});

    			setTimeout(function() {
					$scope.validarGAPI(false);	
				},
				5000);    
			});
		};

		$scope.loginSenhaInvalidos = function() {
			fecharLoader();
			$scope.usuarioSenhaInvalido = true;
		};		

		$scope.functionEsqueciSenha = function() {
			$scope.esqueciSenha = !$scope.esqueciSenha;
		};

		$scope.enviarNovaSenha = function() {

			Login.get({ 

				login: $scope.login 

			}, function(resultadoLogin){

				if (resultadoLogin._id) {

					abrirLoader();
					var _enviarEmailLogin = new EnviarEmailLogin();

					_enviarEmailLogin.id = resultadoLogin.email;
					_enviarEmailLogin.login = resultadoLogin.login;
					_enviarEmailLogin.senha = resultadoLogin.senha;
					
					_enviarEmailLogin.$save(
						function() {
							$scope.functionEsqueciSenha();
							fecharLoader();

							$scope.disparoEmailLoginSenha = true;
						});

				} else {

					$scope.mensagemUsuarioSenhaInvalido = 'Usuário inválido.';
					$scope.loginSenhaInvalidos();

				}
			});

		};

		$scope.desabilitarNavBar();
});
