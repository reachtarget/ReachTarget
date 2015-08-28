angular.module('reachtarget')
	.controller('ClienteController', function($scope, $location, $resource, ClienteService, LoginService) {
		$scope.TituloCampanhaOuLanding = '';
		$scope.CampanhaOuLanding = '';
		$scope.filtro = '';

		$scope.status = false;
		$scope.empresa = '';
		$scope.email = '';
		$scope.login = '';
		$scope.senha = '';
		$scope.empresa = '';
		$scope.tipo = 'S';
		$scope.paginaNome = "";
		$scope.paginaPageID = "";
		$scope.paginaPagePath = "";
		$scope.paginaAdwords = "";

		$scope.accounts = null;
		$scope.webPropertyIds = null;
		$scope.profileIds = null;		

		$scope.adwords = '';
		$scope.contaSelecionada = '';
		$scope.propriedadeSelecionada = '';
		$scope.perfilSelecionado = '';		
		$scope.apikeymailchimp = '';

		$scope.nomeEmpresa = null;
		$scope.emailRecebeLeads = null;
		$scope.produtoServicosTrabalhados = null;
		$scope.abrangenciaGeografica = null;
		$scope.orcamentoAdwords = null;
		$scope.atributosTrabalhados = null;
		$scope.publicoAlvo = null;
		$scope.comoClientesProcuramGoogle = null;
		$scope.pricipaisDiferenciais = null;
		$scope.clientes = null;
		$scope.parceiros = null;
		$scope.concorrentes = null;
		$scope.referenciaVisual = null;

		$scope.dataInicialBudget = null;
		$scope.dataFinalBudget = null;
		$scope.budgetDisponivel = 0;
		$scope.budgetConsumido = 0;
		$scope.listaBudgetAdwords = [];

		$scope.lista = [];
		$scope.listaSelecionar = [];


		var _login;
		var _google;
		var _mc;
		var _listaItensExcluir = [];
		var _idLoginToken;
    	var _accessToken;
    	var _refreshToken;
    	var _totalPaginas;
    	var _itemListaPopulado;
    	var _idBriefing = null;
    	var _idAdwords = null;



		var TokenGoogle = $resource('/google/:objectIdLogin');
		var RefreshToken = $resource('/token/analytics/:accessToken/:refreshToken/:id');
		
    	var NovoLogin = $resource('/login');
		var Login = $resource('/login/id/:objectIdLogin');
		var ComplementoLogin = $resource('/complementoLogin/:objectIdLogin');
		
    	var NovoGoogle = $resource('/google');
		var Google = $resource('/google/:objectIdLogin');
		var GooglePorUnbouncePage = $resource('/google/:objectIdLogin/:unbouncePageId');
		var GooglePorCampanha = $resource('/google/campanha/:objectIdLogin/:campaignId');
    	var DeleteGoogle = $resource('/excluir/google/:id');

    	var NovoMailChimp = $resource('/mailchimp');
		var MailChimp = $resource('/mailchimp/:objectIdLogin');
		var ListaCampanhasMailChimp = $resource('/mailchimp/listas/retornarTodas/:apikey');

    	var NovoUnbounce = $resource('/unbounce');
		var Unbounce = $resource('/unbounce/:objectId');
    	var DeleteUnbounce = $resource('/excluir/unbounce/:id');

    	var NovaCampanha = $resource('/campanha');
    	var ListaCampanha = $resource('/campanha/:objectIdLogin');
		var DeleteCampanha = $resource('/excluir/campanha/:id');

		var Briefing = $resource('/briefing');
		var BriefingPorLogin = $resource('/briefing/:objectIdLogin');

		var BudgetAdwords = $resource('/budgetAdwords');
		var BudgetAdwordsPorLogin = $resource('/budgetAdwords/:objectIdLogin');


		$scope.abrirTela = function() {
			document.getElementById('loaderIndex').style.display = 'block';

    		TokenGoogle.get({

    			objectIdLogin: LoginService.objectIdLogin
    			
    		}, function(resTokenGoogle) {
    			_idLoginToken = resTokenGoogle._id;
    			_accessToken = resTokenGoogle.accessToken;
    			_refreshToken = resTokenGoogle.refreshToken;

				$scope.validarGAPI(true);	
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
            			$scope.consultarCliente();
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

		$scope.voltar = function() {
			$location.path('/administrativo');
		};

		$scope.consultarCliente = function() {
			_totalPaginas = 0;
    		_itemListaPopulado = 0;

			Login.get({
				objectIdLogin: ClienteService.objectIdCliente
			}, function(resLogin) {
				_login = resLogin;

				$scope.status = (resLogin.status == 'A');
				$scope.tipo = resLogin.tipo;
				$scope.email = resLogin.email;
				$scope.login = resLogin.login;
				$scope.senha = resLogin.senha;

				ComplementoLogin.get({
					objectIdLogin: ClienteService.objectIdCliente
				}, function(resComplementoLogin){
					$scope.empresa = resComplementoLogin.nome;

					if (resLogin.tipo == 'S') {

						Google.get({
							objectIdLogin: ClienteService.objectIdCliente
						}, function(resGoogle) {
							$scope.adwords = resGoogle.idAdwords;
							$scope.contaSelecionada = resGoogle.accountId;
							$scope.propriedadeSelecionada = resGoogle.webPropertyId;
							$scope.perfilSelecionado = resGoogle.profileId;

							_google = resGoogle;


							MailChimp.get({
								objectIdLogin: ClienteService.objectIdCliente
							}, function(mc){
								$scope.apikeymailchimp = mc.apiKey;
								_mc = mc;
							});


							ListaCampanha.query({

								objectIdLogin: ClienteService.objectIdCliente

							}, function(listaCampanhas){
								$scope.lista = [];

								_totalPaginas = listaCampanhas.length;

								listaCampanhas.forEach(function(campanha){

									var _item = {
											
										Objeto: campanha,
										ObjetoGoogle: null,
										Check: campanha.status == 'A',
										DataEntrada: '',

										IDPagina: campanha.campaignId,
										Nome: '',
										URL: '',

										Adwords: '',
										NomeShow: campanha.nome,

										PageID: '',

										accounts: [],
										webPropertyIds: [],
										profileIds: [],

										ContaSelecionada: '',
										PropriedadeSelecionada: '',
										PerfilSelecionado: ''
									};

									GooglePorCampanha.get({

										objectIdLogin: ClienteService.objectIdCliente,
										campaignId: campanha.campaignId

									}, function(resGooglePorCampanha){

										if (resGooglePorCampanha) {

											_item.ObjetoGoogle = resGooglePorCampanha;
											_item.Adwords = resGooglePorCampanha.idAdwords;
											_item.PageID = resGooglePorCampanha.unbouncePageId;
											_item.accounts = [];
											_item.webPropertyIds = [];
											_item.profileIds = [];
											_item.ContaSelecionada = resGooglePorCampanha.accountId;
											_item.PropriedadeSelecionada = resGooglePorCampanha.webPropertyId;
											_item.PerfilSelecionado = resGooglePorCampanha.profileId;

											if (resGooglePorCampanha.accountId)
												$scope.popularListaAccounts(true, _item, false);

										} else {

											$scope.lista.push(_item);

										}
									});									
								});
							});


							$scope.popularListaAccounts(true);
						});
					} else {
						BriefingPorLogin.get({

							objectIdLogin: ClienteService.objectIdCliente

						}, function(resultadoBriefingPorLogin) {

							if (resultadoBriefingPorLogin._id) {

								_idBriefing = resultadoBriefingPorLogin._id;

								$scope.nomeEmpresa = resultadoBriefingPorLogin.nomeEmpresa;
								$scope.emailRecebeLeads = resultadoBriefingPorLogin.emailRecebeLeads;
								$scope.produtoServicosTrabalhados = resultadoBriefingPorLogin.produtoServicosTrabalhados;
								$scope.abrangenciaGeografica = resultadoBriefingPorLogin.abrangenciaGeografica;
								$scope.orcamentoAdwords = resultadoBriefingPorLogin.orcamentoAdwords;
								$scope.atributosTrabalhados = resultadoBriefingPorLogin.atributosTrabalhados;
								$scope.publicoAlvo = resultadoBriefingPorLogin.publicoAlvo;
								$scope.comoClientesProcuramGoogle = resultadoBriefingPorLogin.comoClientesProcuramGoogle;
								$scope.pricipaisDiferenciais = resultadoBriefingPorLogin.pricipaisDiferenciais;
								$scope.clientes = resultadoBriefingPorLogin.clientes;
								$scope.parceiros = resultadoBriefingPorLogin.parceiros;
								$scope.concorrentes = resultadoBriefingPorLogin.concorrentes;
								$scope.referenciaVisual = resultadoBriefingPorLogin.referenciaVisual;

							}

						});


						BudgetAdwordsPorLogin.query({

							objectIdLogin: ClienteService.objectIdCliente

						}, function(resultadoAdwordsPorLogin) {

							if (resultadoAdwordsPorLogin.length > 0) {

								resultadoAdwordsPorLogin.forEach(function(itemBudgetAdwords){

									$scope.listaBudgetAdwords.push(
										{
											id: itemBudgetAdwords._id,
											dataShow: formarData(itemBudgetAdwords.data),

											dataInicial: itemBudgetAdwords.dataInicial,
											dataInicialShow: formarData(itemBudgetAdwords.dataInicial),

											dataFinal: itemBudgetAdwords.dataFinal,
											dataFinalShow: formarData(itemBudgetAdwords.dataFinal),

											budgetConsumido: itemBudgetAdwords.budgetConsumido,
											budgetDisponivel: itemBudgetAdwords.budgetDisponivel											
										});
								});
							}
						});
						

						Unbounce.query({

							objectId: ClienteService.objectIdCliente

						}, function(resUnbounce){

							$scope.lista = [];
							_totalPaginas = resUnbounce.length;

							resUnbounce.forEach(function(page){

								GooglePorUnbouncePage.get({
									
									objectIdLogin: ClienteService.objectIdCliente,
									unbouncePageId: page.pageId

								}, function(resGooglePorUnbouncePage){

									var _item = {

										Objeto: page,
										ObjetoGoogle: resGooglePorUnbouncePage,
										Check: page.status == 'A',
										DataEntrada: new Date(page.dataEntrada),
										PagePath: page.pagePath,
										IDPagina: page.pageId,
										Nome: page.nome,
										URL: page.url,
										Adwords: resGooglePorUnbouncePage.idAdwords,

										accounts: [],
										webPropertyIds: [],
										profileIds: [],

										ContaSelecionada: resGooglePorUnbouncePage.accountId,
										PropriedadeSelecionada: resGooglePorUnbouncePage.webPropertyId,
										PerfilSelecionado: resGooglePorUnbouncePage.profileId
									};

									$scope.popularListaAccounts(true, _item, false);
									
								});
							});
						});
					}
				});
			});			
		};

		$scope.popularListaAccounts = function(incluir, itemListaPaginas, alteracao) {
			gapi.client.analytics.management.accounts.list().execute(
    			function(resultadosAccounts) {
    				if (itemListaPaginas) {
    					itemListaPaginas.accounts = [];
    				} else {
    					$scope.accounts = [];	
    				}

      				resultadosAccounts.items
        				.forEach(function(item, index, array)
        				{
        					if (itemListaPaginas) {
	          					itemListaPaginas.accounts.push({
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
				        		if (incluir)
				        			$scope.popularListaWebPropertyId(incluir, itemListaPaginas, alteracao);
          					}
        				});
    		});
		};

		$scope.popularListaWebPropertyId = function(incluir, itemListaPaginas, alteracao) {
			gapi.client.analytics.management.webproperties.list(
    		{ 
      			'accountId': ((itemListaPaginas) ? itemListaPaginas.ContaSelecionada : $scope.contaSelecionada)
    		})
    		.execute(function (resultadosWebPropertyIds) {
    			if (itemListaPaginas) {
    				itemListaPaginas.webPropertyIds = []
    				itemListaPaginas.profileIds = [];
    			} else {
    				$scope.webPropertyIds = [];	
    			}      			

			    resultadosWebPropertyIds.items
        			.forEach(function(item, index, array)
        			{
        				if (itemListaPaginas) {
        					itemListaPaginas.webPropertyIds.push(
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

          				if (index == array.length-1) {
          					if (incluir)
				        		$scope.popularListaProfileId(incluir, itemListaPaginas);
          				}
        			});
    		});
		};

		$scope.popularListaProfileId = function(incluir, itemListaPaginas, alteracao) {
			gapi.client.analytics.management.profiles.list(
  			{ 
    			'accountId': (itemListaPaginas) ? itemListaPaginas.ContaSelecionada : $scope.contaSelecionada,
    			'webPropertyId': (itemListaPaginas) ? itemListaPaginas.PropriedadeSelecionada : $scope.propriedadeSelecionada
  			})
  			.execute(function (resultadosProfileIds) {
  				if (itemListaPaginas) {
  					itemListaPaginas.profileIds = [];
  				} else {
  					$scope.profileIds = [];	
  				}    			

    			resultadosProfileIds.items
      				.forEach(function(item, index, array)
      				{
      					if (itemListaPaginas) {
      						itemListaPaginas.profileIds.push(
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

        				if (index == array.length-1) {
        					if ((!alteracao) && (incluir) && (itemListaPaginas)) {
        						$scope.lista.push(itemListaPaginas);	

        						_itemListaPopulado++;

        						if (_itemListaPopulado == _totalPaginas) {
        							document.getElementById('loaderIndex').style.display = 'none';
        						}
        					}
				        
				        	document.getElementById('loaderIndex').style.display = 'none';	
				        	$scope.$apply();
          				}
 				    });
  			});
		};

		$scope.selecionar = function() {
			if ($scope.tipo == 'M') { 
				$scope.paginaNome = "";
				$scope.paginaPageID = "";
				$scope.paginaPagePath = "";
				$scope.paginaAdwords = "";
				$scope.contaSelecionada = "";
				$scope.propriedadeSelecionada = "";
				$scope.perfilSelecionado = "";

				$scope.popularListaAccounts(false);

				$('#modal').modal('show');
			}
			else {

				if ($scope.listaSelecionar.length <= 0) {
					
					document.getElementById('loaderIndex').style.display = 'block';	

					if ($scope.tipo == 'S') { 

						ListaCampanhasMailChimp.query({

							apikey: $scope.apikeymailchimp

						}, function(resListaCampanhasMailChimp){

							resListaCampanhasMailChimp.forEach(function(campanha, indexCampanha, listaCamp){

								if ((campanha.authenticate) && (campanha.status == 'sent')) {

									$scope.listaSelecionar.push({
										Check: false,

										IDPagina: campanha.id,
										Nome: campanha.title,
										URL: campanha.subject,
										DataEntrada: new Date(),

										Adwords: '',
										NomeShow: '',

										PageID: '',

										accounts: [],
										webProperty: [],
										profileIds: [],

										ContaSelecionada: '',
										PropriedadeSelecionada: '',
										PerfilSelecionado: ''
									});
								}

								if (indexCampanha == listaCamp.length-1) {

									document.getElementById('loaderIndex').style.display = 'none';	
									$('#modal').modal('show');

								}
							});
						});
					}
				} else {
					$('#modal').modal('show');
				}
			}
		};

		$scope.novaCampanha = function() {
			$('#modalNovaCampanha').modal('show');
		};

		$scope.fecharNovaCampanha = function() {
			$('#modalNovaCampanha').modal('hide');
		};

		$scope.apagar = function(itemListaPaginas) {
			_listaItensExcluir.push(itemListaPaginas);

			$scope.lista = 
				$.grep($scope.lista, function(val, index){
					return val != itemListaPaginas;
				});
		};

		$scope.salvar = function() {
			var _alterarLogin = new NovoLogin();

			_alterarLogin._id = _login._id;
			_alterarLogin.status = $scope.status ? "A" : "I";
			_alterarLogin.empresa = $scope.empresa;
			_alterarLogin.email = $scope.email;
			_alterarLogin.login = $scope.login;
			_alterarLogin.senha = $scope.senha;
			_alterarLogin.tipo = _login.tipo;

			_alterarLogin.$save();


			if ($scope.tipo == 'S') {
				var _novoGoogle = new NovoGoogle();

				_novoGoogle._id = _google._id;
				_novoGoogle.objectIdLogin = _google.objectIdLogin;
				_novoGoogle.idAdwords = $scope.adwords;
				_novoGoogle.accountId = $scope.contaSelecionada;
				_novoGoogle.webPropertyId = $scope.propriedadeSelecionada;
				_novoGoogle.profileId = $scope.perfilSelecionado;

				_novoGoogle.$save();


				var _novoMailChimp = new NovoMailChimp();

				_novoMailChimp._id = _mc._id;
				_novoMailChimp.objectIdLogin = _mc.objectIdLogin;
				_novoMailChimp.apiKey = $scope.apikeymailchimp;

				_novoMailChimp.$save();				



				$scope.lista.forEach(function(pagina, indexPagina, listaPagina) {
					var _novaCampanha = new NovaCampanha();

					if (pagina.Objeto) {
						_novaCampanha._id = pagina.Objeto._id;
					} 

					_novaCampanha.status = pagina.Check ? 'A' : 'I';
					_novaCampanha.objectIdLogin = ClienteService.objectIdCliente;
					_novaCampanha.campaignId = pagina.IDPagina;
					_novaCampanha.nome = pagina.NomeShow;
					_novaCampanha.$save();



					var _novoGoogle = new NovoGoogle();

					if (pagina.ObjetoGoogle) {
						_novoGoogle._id = pagina.ObjetoGoogle._id;
					} 

					_novoGoogle.objectIdLogin = ClienteService.objectIdCliente;
					_novoGoogle.campaignId = pagina.IDPagina;
					_novoGoogle.unbouncePageId = pagina.PageID;
					_novoGoogle.idAdwords = pagina.Adwords;
					_novoGoogle.accountId = pagina.ContaSelecionada;
					_novoGoogle.webPropertyId = pagina.PropriedadeSelecionada;
					_novoGoogle.profileId = pagina.PerfilSelecionado;

					_novoGoogle.$save();

				});

			} else {
				var _briefing = new Briefing();

				if (_idBriefing)
					_briefing._id = _idBriefing;				

				_briefing.objectIdLogin = ClienteService.objectIdCliente;
				_briefing.dataPreenchimento = new Date();
				_briefing.nomeEmpresa = $scope.nomeEmpresa;
				_briefing.emailRecebeLeads = $scope.emailRecebeLeads;
				_briefing.produtoServicosTrabalhados = $scope.produtoServicosTrabalhados;
				_briefing.abrangenciaGeografica = $scope.abrangenciaGeografica;
				_briefing.orcamentoAdwords = $scope.orcamentoAdwords;
				_briefing.atributosTrabalhados = $scope.atributosTrabalhados;
				_briefing.publicoAlvo = $scope.publicoAlvo;
				_briefing.comoClientesProcuramGoogle = $scope.comoClientesProcuramGoogle;
				_briefing.pricipaisDiferenciais = $scope.pricipaisDiferenciais;
				_briefing.clientes = $scope.clientes;
				_briefing.parceiros = $scope.parceiros;
				_briefing.concorrentes = $scope.concorrentes;
				_briefing.referenciaVisual = $scope.referenciaVisual;

				_briefing.$save();


				$scope.listaBudgetAdwords.forEach(
					function(budgetAdwords, indexBudgetAdwords, listaBudgetAdwords) {

						if (!budgetAdwords.id) {

							var _budgetAdwords = new BudgetAdwords();
							
							_budgetAdwords.objectIdLogin = ClienteService.objectIdCliente;
							_budgetAdwords.data = new Date();
							_budgetAdwords.dataInicial = budgetAdwords.dataInicial;
							_budgetAdwords.dataFinal = budgetAdwords.dataFinal;
							_budgetAdwords.budgetDisponivel = budgetAdwords.budgetDisponivel;
							_budgetAdwords.budgetConsumido = budgetAdwords.budgetConsumido;

							_budgetAdwords.$save();

						} 

					});


				/*
				var _adwords = new Adwords();

				if (_idAdwords)
					_adwords._id = _idAdwords;

				_adwords.objectIdLogin = ClienteService.objectIdCliente;
				_adwords.keywords = $scope.keywords;
				_adwords.budget = $scope.budget;
				_adwords.budgetConsumido = $scope.budgetConsumido;

				_adwords.$save();
				*/



				var _novoUnbounce;

				$scope.lista.forEach(function(pagina, indexPagina, listaPagina) {
					var _novoUnbounce = new NovoUnbounce();

					if (pagina.Objeto) {
						_novoUnbounce._id = pagina.Objeto._id;
					} 

					_novoUnbounce.status = pagina.Check ? 'A' : 'I';
					_novoUnbounce.objectIdLogin = ClienteService.objectIdCliente;
					_novoUnbounce.pageId = pagina.IDPagina;
					_novoUnbounce.pagePath = pagina.PagePath;
					_novoUnbounce.nome = pagina.Nome;
					_novoUnbounce.dataEntrada = new Date(pagina.DataEntrada);

					_novoUnbounce.$save();



					var _novoGoogle = new NovoGoogle();

					if (pagina.ObjetoGoogle) {
						_novoGoogle._id = pagina.ObjetoGoogle._id;
					} 

					_novoGoogle.objectIdLogin = ClienteService.objectIdCliente;
					_novoGoogle.unbouncePageId = pagina.IDPagina;
					_novoGoogle.idAdwords = pagina.Adwords;
					_novoGoogle.accountId = pagina.ContaSelecionada;
					_novoGoogle.webPropertyId = pagina.PropriedadeSelecionada;
					_novoGoogle.profileId = pagina.PerfilSelecionado;

					_novoGoogle.$save();					
				});
			}

			if (_listaItensExcluir.length > 0) {
				_listaItensExcluir.forEach(function(itemPaginaExcluir, index, lista) {
					DeleteGoogle.delete({
						id: itemPaginaExcluir.ObjetoGoogle._id
					});

					if ($scope.tipo == 'S') {
						DeleteCampanha.delete({
							id: itemPaginaExcluir.Objeto._id
						});
					} else {
						DeleteUnbounce.delete({
							id: itemPaginaExcluir.Objeto._id
						});
					}

					if (index == lista.length-1) {
						_listaItensExcluir = [];
					}
				});
			}

			$location.path('/administrativo');
		};

		$scope.excluir = function(itemListaPaginas) {
			//
		};

		$scope.fecharModal = function() {
			$scope.lista.push({
				Objeto: null,
				ObjetoGoogle: null,
				Check: true,
				DataEntrada: new Date(),
				IDPagina: $scope.paginaPageID,
				Nome: $scope.paginaNome,
				PagePath: $scope.paginaPagePath,
				URL: '',
				Adwords: $scope.paginaAdwords,
				NomeShow: $scope.paginaNome,
				PageID: $scope.paginaPageID,
				accounts: $scope.accounts,
				webPropertyIds: $scope.webPropertyIds,
				profileIds: $scope.profileIds,
				ContaSelecionada: $scope.contaSelecionada,
				PropriedadeSelecionada: $scope.propriedadeSelecionada,
				PerfilSelecionado: $scope.perfilSelecionado
			});

			$('#modal').modal('hide');
		};

		$scope.incluirBudget = function() {
			$scope.listaBudgetAdwords.push({

				data: new Date(),
				dataShow: formarData(new Date()),
				dataInicial: $scope.dataInicial,
				dataInicialShow: formarData($scope.dataInicial),
				dataFinal: $scope.dataFinal,
				dataFinalShow: formarData($scope.dataFinal),
				budgetConsumido: $scope.budgetConsumido,
				budgetDisponivel: $scope.budgetDisponivel

			});


			$scope.dataInicial = null;
			$scope.dataFinal = null;
			$scope.budgetConsumido = null;
			$scope.budgetDisponivel = null;
		};

		$scope.abrirTela();
	});