angular.module('reachtarget')
	.controller('AdministrativoController', function($scope, $location, $resource, ClienteService, LoginService) {

		$scope.filtro = "";

		$scope.ordenacao = "Nome";
		$scope.opcaoReverse = false;

		$scope.clientesAtivos = true;
		$scope.listaClientesInativos = [];

		$scope.enviarSM = "S";
		$scope.MaasOuSiteina = LoginService.TipoAdministrativo;
		$scope.comentario = '';
		$scope.logadoGA = false;
		$scope.botaoGA = "Login GA";
		$scope.inptuDataInicialFinal = "";
		$scope.quantidadeDeClientes = 0;

		$scope.listaClientes = [];
		var _listaClientesMaas = [];

		$scope.listaHistoricoResumo = [];

		$scope.tipoEnvioEmailSelecionado = "S";
		$scope.listaTipoEnvioEmail = [
	        { id: "S", descricao: 'Semanal' },
    	    { id: "M", descricao: 'Mensal' }];

    	$scope.filtroPorTipo = '';

		var _i = 0;
		var _listaAnalytics = [];
		var _listaProfilesID = [];

		var _semanalOuMensal;

		var _tokenGoogle = null
		var _idLoginToken = '';
		var _accessToken = '';
		var _refreshToken = '';

		var _envioEmailConsultoria = {};

		var _abertura = true;
		var _atualizar = false;
		var _refresh = false;


		var ClientesAtivos = $resource('/clientesAtivos');
		var ClientesInativos = $resource('/clientesInativos');
		var ClientesBriefing = $resource('/clientesBriefing');

		var ComplementoLogin = $resource('/complementoLogin/:objectIdLogin');
		var TokenGoogle = $resource('/google/:objectIdLogin');
		var RefreshToken = $resource('/token/analytics/:accessToken/:refreshToken/:id');		
		var GoogleAnalyticsPorUnbouncePage = $resource('/google/:objectIdLogin/:unbouncePageId');
		var PaginasUnbouncePorUsuario = $resource('/unbounce/:objectId');
		var ConsultarLeadsMaaS = $resource('/lead/maas/:objectId/:dataInicial/:dataFinal/:pagina');
		var EnviarEmail = $resource('/email/resumo');
    	var DeleteGoogle = $resource('/excluir/google/:id');
    	var Analytics = $resource('/analytics/:code/:objectIdLogin');
    	var ConsultarLeads = $resource('/lead/:objectId/:dataInicial/:dataFinal');
    	var HistoricoResumo = $resource('/historicoResumo');
    	var ConsultarHistoricoResumo = $resource('/historicoResumo/:objectIdLogin');
    	var AlterarLogin = $resource('/login');

    	$(document).ready(function() {
			document.getElementById('divFiltros').style.display = 'block';
			$('[data-toggle="tooltip"]').tooltip();

			_metodoDeAtualizacao = function(){
				if (LoginService.CampanhaSelecionada.IDPagina == "A") {
					
					$scope.clientesAtivos = true;
					$scope.retornarClientes();

				} else if (LoginService.CampanhaSelecionada.IDPagina == "B") {
					
					$scope.clientesAtivos = false;
					$scope.retornarClientesBriefing();

				} else {

					$scope.clientesAtivos = false;					
					$scope.retornarClientesInativos();
					
				}
			};			
		});

		$scope.novoCliente = function() {
			ClienteService.objectIdCliente = null;

			$location.path('/administrativo/novoCliente');
		};

		$scope.abrirCliente = function(cliente) {
			ClienteService.objectIdCliente = cliente.ID;

			$location.path('/administrativo/cliente');
		};

		$scope.abrirTela = function() {
			document.getElementById('loaderIndex').style.display = 'block';

			TokenGoogle.get({

    			objectIdLogin: LoginService.objectIdLogin
    			
    		}, function(resTokenGoogle){
    			if (resTokenGoogle._id) {
    				$scope.botaoGA = "Logout GA";
    				$scope.logadoGA = true;

    				_tokenGoogle = resTokenGoogle;

    				_idLoginToken = resTokenGoogle._id;
    				_accessToken = resTokenGoogle.accessToken;
    				_refreshToken = resTokenGoogle.refreshToken;

					$scope.validarGAPI(true);
    			} else {
    				$scope.botaoGA = "Login GA";
    				$scope.logadoGA = false;
					
					document.getElementById('loaderIndex').style.display = 'none';
    			}
    		});
		};

		$scope.popularDadosCliente = function(item) {
			abrirLoader();


			ComplementoLogin.get({

				objectIdLogin: item._id

				}, function(resComplementoLogin) {

					if ((resComplementoLogin) && (resComplementoLogin._id)) {

						var _cliente = {
							Show: false,
							DadosAtualizados: false,
							ID: item._id,
							Nome: resComplementoLogin.nome,
							Email: item.email,
							Login: item.login,
							Senha: item.senha,
							Tipo: item.tipo,
							
							TipoDescricao: 
								(item.tipo == 'M')
									? 'Starter'
									: (item.tipo == 'S')
										? 'Search'
										: 'Inbound',

							Visualizacoes: 0,
							Visitantes: 0,
							Leads: 0,
							TaxaConversao: '0.0',
							ListaLP: [],
							ListaLeads: []
						};

						$scope.listaClientes.push(_cliente);
					}

					if (_i < _listaDadosClientes.length-1) {
						
						_i++;
						$scope.popularDadosCliente(_listaDadosClientes[_i]);	

					} else {

						fecharLoader();

					}

					/*

					PaginasUnbouncePorUsuario.query({

						objectId: _cliente.ID

					}, function(resultadoPaginasUnbouncePorUsuario) {

						var _ok = false;
						var _qtdePagina = 0;

						resultadoPaginasUnbouncePorUsuario.forEach(function(itemPagina, indexPagina, listaPagina) {

							GoogleAnalyticsPorUnbouncePage.get({

								objectIdLogin:  _cliente.ID,
								unbouncePageId: itemPagina.pageId

							}, function(resGoogleAnalyticsPorUnbouncePage) {

								var _landing = {
									IDPage: itemPagina.pageId,
									NomeLanding: itemPagina.nome, 
									ProfileID: resGoogleAnalyticsPorUnbouncePage.profileId,
									Visualizacoes: 0,
									Visitantes: 0,
									Leads: 0,
									ListaLeads: [],
									TaxaConversao: '0.0'
								};


								if (_listaProfilesID.indexOf(_landing.ProfileID) == -1) {

									_listaProfilesID.push(_landing.ProfileID);
									
									gapi.client.analytics.data.ga.get({
										'ids': 'ga:' + _landing.ProfileID,
										'start-date': LoginService.DataInicialFormat,
										'end-date': LoginService.DataFinalFormat,
										'metrics': 'ga:pageviews,ga:uniquePageviews',
										'dimensions': 'ga:pagePath'											
									})
									.execute(function(resGAPI) {

										if (resGAPI.rows) {
											_listaAnalytics.push(resGAPI.rows);
											
											_ok = true;

											resGAPI.rows.forEach(function(itemAnalytics) {

												if (itemAnalytics[0] == itemPagina.pagePath) {

													_landing.Visualizacoes = new Number(itemAnalytics[1]);
													_landing.Visitantes = new Number(itemAnalytics[2]);

													_cliente.Visualizacoes += new Number(itemAnalytics[1]);
													_cliente.Visitantes += new Number(itemAnalytics[2]);


													if (_landing.Visitantes > 0)
														_landing.TaxaConversao = ((_landing.Leads / _landing.Visitantes) * 100).toFixed(1);
													else 
														_landing.TaxaConversao = '0.0';
												}
											});											
										}

										if (indexPagina == listaPagina.length-1) {

											if (_i < _listaDadosClientes.length-1) {
												if (_cliente.Visitantes > 0)
													_cliente.TaxaConversao = ((_cliente.Leads / _cliente.Visitantes) * 100).toFixed(1);
												else 
													_cliente.TaxaConversao = '0.0';

												_i++;
												$scope.popularDadosCliente(_listaDadosClientes[_i]);	
											}												
										}
									});

								} else {

									var refreshIntervalId = 
										setInterval(function() {
											if (_ok) {

												_listaAnalytics.forEach(function(itemAnalytics) {

													itemAnalytics.forEach(function(item0) {

														if (item0[0] == itemPagina.pagePath) {

															_landing.Visualizacoes = new Number(item0[1]);
															_landing.Visitantes = new Number(item0[2]);

															_cliente.Visualizacoes += new Number(item0[1]);
															_cliente.Visitantes += new Number(item0[2]);


															if (_landing.Visitantes > 0)
																_landing.TaxaConversao = ((_landing.Leads / _landing.Visitantes) * 100).toFixed(1);
															else 
																_landing.TaxaConversao = '0.0';
														}
													});														
												});	

												clearInterval(refreshIntervalId);

												if (indexPagina == listaPagina.length-1) {

													if (_i < _listaDadosClientes.length-1) {
														if (_cliente.Visitantes > 0)
															_cliente.TaxaConversao = ((_cliente.Leads / _cliente.Visitantes) * 100).toFixed(1);
														else 
															_cliente.TaxaConversao = '0.0';

														_i++;
														$scope.popularDadosCliente(_listaDadosClientes[_i]);	
													}												
												}
											}
										},
										250);										
								}


								ConsultarLeadsMaaS.query({

									objectId: _cliente.ID,
									dataInicial: LoginService.DataInicial,
									dataFinal: LoginService.DataFinal,
									pagina: itemPagina.pageId

								}, function(resultadoLeadsPaginaUnbounce) {

									_landing.Leads += resultadoLeadsPaginaUnbounce.length;
									_landing.ListaLeads = resultadoLeadsPaginaUnbounce;

									if (_landing.Visitantes > 0)
										_landing.TaxaConversao = ((_landing.Leads / _landing.Visitantes) * 100).toFixed(1);
									else 
										_landing.TaxaConversao = '0.0';

									_cliente.Leads += resultadoLeadsPaginaUnbounce.length;

									if (resultadoLeadsPaginaUnbounce.length > 0) {
										resultadoLeadsPaginaUnbounce.forEach(function(item){
											_cliente.ListaLeads.push(item);
										});
									}
									
									_cliente.ListaLP.push(_landing);										
								});
							});
						});
					});
					*/
			});
		}

		$scope.atualizarDadosCliente = function(cliente) {

			abrirLoader();

			PaginasUnbouncePorUsuario.query({

				objectId: cliente.ID

			}, function(resultadoPaginasUnbouncePorUsuario) {

				var _ok = false;
				var _qtdePagina = 0;

				resultadoPaginasUnbouncePorUsuario.forEach(function(itemPagina, indexPagina, listaPagina) {

					GoogleAnalyticsPorUnbouncePage.get({

						objectIdLogin:  cliente.ID,
						unbouncePageId: itemPagina.pageId

					}, function(resGoogleAnalyticsPorUnbouncePage) {

						var _landing = {
							IDPage: itemPagina.pageId,
							NomeLanding: itemPagina.nome, 
							ProfileID: resGoogleAnalyticsPorUnbouncePage.profileId,
							Visualizacoes: 0,
							Visitantes: 0,
							Leads: 0,
							ListaLeads: [],
							TaxaConversao: '0.0'
						};


						if (_listaProfilesID.indexOf(_landing.ProfileID) == -1) {

							_listaProfilesID.push(_landing.ProfileID);
							
							gapi.client.analytics.data.ga.get({
								'ids': 'ga:' + _landing.ProfileID,
								'start-date': LoginService.DataInicialFormat,
								'end-date': LoginService.DataFinalFormat,
								'metrics': 'ga:pageviews,ga:uniquePageviews',
								'dimensions': 'ga:pagePath'											
							})
							.execute(function(resGAPI) {

								if (resGAPI.rows) {
									_listaAnalytics.push(resGAPI.rows);
									
									_ok = true;

									resGAPI.rows.forEach(function(itemAnalytics) {

										if (itemAnalytics[0] == itemPagina.pagePath) {

											_landing.Visualizacoes = new Number(itemAnalytics[1]);
											_landing.Visitantes = new Number(itemAnalytics[2]);

											cliente.Visualizacoes += new Number(itemAnalytics[1]);
											cliente.Visitantes += new Number(itemAnalytics[2]);


											if (_landing.Visitantes > 0)
												_landing.TaxaConversao = ((_landing.Leads / _landing.Visitantes) * 100).toFixed(1);
											else 
												_landing.TaxaConversao = '0.0';
										}
									});											
								}

								if (indexPagina == listaPagina.length-1) {

									if (_i < _listaDadosClientes.length-1) {
										if (cliente.Visitantes > 0)
											cliente.TaxaConversao = ((cliente.Leads / cliente.Visitantes) * 100).toFixed(1);
										else 
											cliente.TaxaConversao = '0.0';

										_i++;
										$scope.popularDadosCliente(_listaDadosClientes[_i]);	
									}												
								}
							});

						} else {

							var refreshIntervalId = 
								setInterval(function() {
									if (_ok) {

										_listaAnalytics.forEach(function(itemAnalytics) {

											itemAnalytics.forEach(function(item0) {

												if (item0[0] == itemPagina.pagePath) {

													_landing.Visualizacoes = new Number(item0[1]);
													_landing.Visitantes = new Number(item0[2]);

													cliente.Visualizacoes += new Number(item0[1]);
													cliente.Visitantes += new Number(item0[2]);


													if (_landing.Visitantes > 0)
														_landing.TaxaConversao = ((_landing.Leads / _landing.Visitantes) * 100).toFixed(1);
													else 
														_landing.TaxaConversao = '0.0';
												}
											});														
										});	

										clearInterval(refreshIntervalId);

										if (indexPagina == listaPagina.length-1) {

											if (_i < _listaDadosClientes.length-1) {
												if (cliente.Visitantes > 0)
													cliente.TaxaConversao = ((cliente.Leads / cliente.Visitantes) * 100).toFixed(1);
												else 
													cliente.TaxaConversao = '0.0';

												_i++;
												$scope.popularDadosCliente(_listaDadosClientes[_i]);	
											}												
										}
									}
								},
								250);										
						}


						ConsultarLeadsMaaS.query({

							objectId: cliente.ID,
							dataInicial: LoginService.DataInicial,
							dataFinal: LoginService.DataFinal,
							pagina: itemPagina.pageId

						}, function(resultadoLeadsPaginaUnbounce) {

							_landing.Leads += resultadoLeadsPaginaUnbounce.length;
							_landing.ListaLeads = resultadoLeadsPaginaUnbounce;

							if (_landing.Visitantes > 0)
								_landing.TaxaConversao = ((_landing.Leads / _landing.Visitantes) * 100).toFixed(1);
							else 
								_landing.TaxaConversao = '0.0';

							cliente.Leads += resultadoLeadsPaginaUnbounce.length;

							if (resultadoLeadsPaginaUnbounce.length > 0) {
								resultadoLeadsPaginaUnbounce.forEach(function(item){
									cliente.ListaLeads.push(item);
								});
							}

							fecharLoader();

							cliente.DadosAtualizados = true;
							cliente.ListaLP.push(_landing);										
						});
					});
				});
			});

		};


		$scope.retornarClientes = function() {
			abrirLoader();
			
			_listaAnalytics = [];
			_listaProfilesID = [];

			document.getElementById('loaderIndex').style.display = 'block';

			$scope.listaClientes = [];
			_listaClientesMaas = [];

			ClientesAtivos
				.query(function(resClientes) {

					$scope.quantidadeDeClientes = resClientes.length;

					if (resClientes.length == 0) {

						document.getElementById('loaderIndex').style.display = 'none';

					} else {
						_listaDadosClientes = [];						

						resClientes.forEach(function(item, index, lista) {
							_listaDadosClientes.push(item);							

							if (index == lista.length-1) {
								fecharLoader();

								_i = 0;
								$scope.popularDadosCliente(resClientes[_i]);
							}
						});
					}
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
                	'metrics': 'ga:pageviews',
            	})
            	.execute(function(resultado) {
            		if ((resultado.code) && (resultado.code == 401)) {
						$scope.refreshToken();
            		} else {
            			$scope.retornarClientes();
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

		$scope.GA = function() {
			if ($scope.logadoGA) {
				DeleteGoogle.delete({
					id: _tokenGoogle._id
				});

				$scope.listaClientes = [];

				_tokenGoogle = null;
				$scope.logadoGA = false;
				$scope.botaoGA = "Login GA";
			} else {
				gapi.auth.authorize({    				
    				client_id: LoginService.ClienteID,
    				scope: 'https://www.googleapis.com/auth/analytics.readonly',
    				response_type: 'code',
    				approval_prompt: 'force',
    				access_type: 'offline',
    				immediate: false
    			}, function(response){
    				abrirLoader();

    				Analytics.get({
    					code: response.code,
    					objectIdLogin: LoginService.objectIdLogin
    				});

    				setTimeout(function(){
    					$scope.abrirTela();	
    				}, 
    				1000);    					
    			});

				$scope.logadoGA = true;
				$scope.botaoGA = "Logout GA";
			}			
		};

		$scope.abrirDetalhes = function(parametroItemCliente) {
			parametroItemCliente.Show = !parametroItemCliente.Show;
		};

		$scope.abrirDashboard = function(parametroItemCliente) {
			gravarCookie(
				'abrirDashboardMaaS', 
				'#l#' + parametroItemCliente.Login + '#s#' + parametroItemCliente.Senha, 
				1);

			var win = window.open(LoginService.URLAcesso, '_blank');
          	win.focus();
		};

		$scope.enviarEmailComent = function(parametroCliente) {
			abrirLoader();

			$scope.comentario = '';
			$scope.listaHistoricoResumo = [];

			_envioEmailConsultoria = {
				Tipo: '',
				Comentario: '',

				ID: parametroCliente.ID,
				Nome: parametroCliente.Nome,
				Email: parametroCliente.Nome + ' <' + parametroCliente.Email + '>',

				Acessos: parametroCliente.Visualizacoes,
				Visitantes: parametroCliente.Visitantes,
				Leads: parametroCliente.Leads,
				Taxa: parametroCliente.TaxaConversao,
				
				DataInicial: LoginService.DataInicial,
				DataFinal: LoginService.DataFinal,

				Paginas: parametroCliente.ListaLP,
				ListaLeads: parametroCliente.ListaLeads
			};


			ConsultarHistoricoResumo.query({
				objectIdLogin: parametroCliente.ID
			}, function(resultadoConsultarHistoricoResumo) {

				if (resultadoConsultarHistoricoResumo.length > 0) {

					resultadoConsultarHistoricoResumo.forEach(function(consultarHistoricoResumo, indexHistorico, listaHistorico){
						$scope.listaHistoricoResumo.push({
							DataEnvio: formarData(consultarHistoricoResumo.dataEnvioResumo),
							
							Periodo: 
								formarData(consultarHistoricoResumo.dataDe) + ' ~ ' +
								formarData(consultarHistoricoResumo.dataAte),

							Acessos: consultarHistoricoResumo.acessos,
							Visualizacoes: consultarHistoricoResumo.visualizacoes,
							Leads: consultarHistoricoResumo.leads,
							Conversao: consultarHistoricoResumo.taxaConversao,

							Comentario: consultarHistoricoResumo.comentario
						});

						if (indexHistorico == listaHistorico.length-1) {
							fecharLoader();
							$('#modalEnvioResumo').modal('show');			
						}
					});
				} else {
					fecharLoader();
					$('#modalEnvioResumo').modal('show');
				}
			});
		};

		$scope.retornarMes = function(mes) {
			var _meses = [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ];

    		return _meses[mes];
		};

		$scope.enviarEmailResumo = function() {
			$('#modalEnvioResumo').modal('hide');


			_envioEmailConsultoria.Tipo = $scope.tipoEnvioEmailSelecionado;
			_envioEmailConsultoria.Comentario = $scope.comentario;

			_envioEmailConsultoria.Periodo =
				($scope.tipoEnvioEmailSelecionado == 'S')
					? formarData(LoginService.DataInicial) + " até " + formarData(LoginService.DataFinal)
					: $scope.retornarMes(LoginService.DataInicial.getMonth()) + "/" + LoginService.DataFinal.getFullYear();


			var _enviarEmail = new EnviarEmail();
			_enviarEmail.listaClientes = []; 
			_enviarEmail.listaClientes.push(_envioEmailConsultoria);

			abrirLoader();

			_enviarEmail.$save(
				function() {
					var _historicoResumo = new HistoricoResumo();

					_historicoResumo.objectIdLogin = _envioEmailConsultoria.ID;
					_historicoResumo.dataEnvioResumo = new Date()
					_historicoResumo.dataDe = _envioEmailConsultoria.DataInicial;
					_historicoResumo.dataAte = _envioEmailConsultoria.DataFinal;
					_historicoResumo.acessos = _envioEmailConsultoria.Acessos;
					_historicoResumo.visualizacoes = _envioEmailConsultoria.Visitantes;
					_historicoResumo.leads = _envioEmailConsultoria.Leads;
					_historicoResumo.taxaConversao = _envioEmailConsultoria.Taxa;
					
					_historicoResumo.comentario = 
						($scope.tipoEnvioEmailSelecionado == 'S')
							? 'Resumo semanal'
							: _envioEmailConsultoria.Comentario;

					_historicoResumo.$save();

					fecharLoader();				
				});
		};

		$scope.ordenarLista = function(campoOrdernar) {
			$scope.ordenacao = campoOrdernar;
			$scope.opcaoReverse = !$scope.opcaoReverse;
		};

		$scope.retornarClientesInativos = function()  {
			abrirLoader();
			$scope.listaClientesInativos = [];

			ClientesInativos.query(
				function(resultado){
					if (resultado.length > 0) {
						resultado.forEach(function(cliente, index, array){

							ComplementoLogin.get({
								objectIdLogin: cliente._id
							}, function(resComplementoLogin){

								$scope.listaClientesInativos.push({
									ObjectId: cliente,
									ID: cliente._id,
									Nome: resComplementoLogin.nome									
								});

								if (index == array.length-1) {
									fecharLoader();
								}
							});
						});
					} else {
						fecharLoader();
					}
			});
		};

		$scope.retornarClientesBriefing = function()  {
			abrirLoader();
			$scope.listaClientesInativos = [];

			ClientesBriefing.query(
				function(resultado){
					if (resultado.length > 0) {
						resultado.forEach(function(cliente, index, array){

							ComplementoLogin.get({

								objectIdLogin: cliente._id

							}, function(resComplementoLogin){

								$scope.listaClientesInativos.push({
									ObjectId: cliente,
									ID: cliente._id,
									Nome: resComplementoLogin.nome									
								});

								if (index == array.length-1) {
									fecharLoader();
								}
							});
						});
					} else {
						fecharLoader();
					}
			});
		};

		$scope.ativarCliente = function(clientesInativo) {
			var _alterarLogin = new AlterarLogin();

			_alterarLogin._id = clientesInativo.ObjectId._id;
			_alterarLogin.empresa = clientesInativo.ObjectId.empresa;
			_alterarLogin.email = clientesInativo.ObjectId.email;
			_alterarLogin.login = clientesInativo.ObjectId.login;
			_alterarLogin.senha = clientesInativo.ObjectId.senha;
			_alterarLogin.tipo = clientesInativo.ObjectId.tipo;
			_alterarLogin.status = "A";

			_alterarLogin.$save();


			for (var i = $scope.listaClientesInativos.length - 1; i >= 0; i--) {
    			if($scope.listaClientesInativos[i] == clientesInativo) {
       				$scope.listaClientesInativos.splice(i, 1);
    			}
			}
		};

		$scope.abrirTela();
	});