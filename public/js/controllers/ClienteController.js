angular.module('reachtarget')
	.controller('ClienteController', function($scope, $location, $resource, ClienteService, LoginService) {

		$scope.menuDadosCadastrais = true;
		$scope.menuOfertas = false;
		$scope.menuSEO = false;
		$scope.menuMetas = false;

		$scope.editarNomeEmpresa = false;
		$scope.botaoEditarNomeEmpresa = false;
		$scope.empresa = "Novo cliente";

		$scope.editarTipo = false;
		$scope.botaoEditarTipo = false;
		$scope.tipo = "M";
		$scope.tipoCliente = "Starter";

		$scope.editarStatus = false;
		$scope.botaoEditarStatus = false;	
		$scope.status = "A";
		$scope.statusDescricao = "Ativo";

		$scope.editarContato = false;
		$scope.botaoEditarContato = false;
		$scope.contato = "E-mail para contato";

		$scope.editarLogin = false;
		$scope.botaoEditarLogin = false;
		$scope.login = "";

		$scope.editarSenha = false;
		$scope.botaoEditarSenha = false;
		$scope.senha = "";

		var _landingPage = null;
		$scope.editarNomeLandingPage = false;
		$scope.botaoEditarNomeLandingpage = false;
		$scope.NomeLandingpage = null;
		$scope.pageID = null;
		$scope.pagePath = null;
		$scope.urlAcesso = null;
		$scope.campanhaAdwords = null; 
		$scope.contaAnalytics = null; 
		$scope.propriedadeAnalytics = null; 
		$scope.vistaAnalytics = null; 

		$scope.perguntaBriefing = "Qual e-mail deverá receber os leads das campanhas ?";
		$scope.perguntaAtualBriefing = 1;
		$scope.totalPerguntasBriefing = 12;
		$scope.placeholderBriefing = "Esse e-mail será utilizado para o login no dashboard e receberá todos os formulários que forem preenchidos e os relatórios de desempenho.";
		$scope.respostaBriefing = "";

		$scope.listaOfertas = [];
		$scope.listaContasAnalytics = [];
		$scope.listaPropriedadesAnalytics = [];
		$scope.listaVistasAnalytics = [];


		$scope.listaTipos = [
	        { id: 'M', descricao: 'Starter' },
	        { id: 'S', descricao: 'Search' },
	        { id: 'I', descricao: 'Inbound' }
    	];

    	$scope.listaStatus = [
	        { id: 'A', descricao: 'Ativo' },
	        { id: 'B', descricao: 'Briefing' },
	        { id: 'I', descricao: 'Inativo' }
    	];


    	var _listaPerguntasBriefing = [
            { Pergunta: 'Qual e-mail deverá receber os leads das campanhas ?', Placeholder: 'Esse e-mail será utilizado para o login no dashboard e receberá todos os formulários que forem preenchidos e os relatórios de desempenho.', Resposta: null }, 
            { Pergunta: 'Qual produtos/serviço será trabalhado ?', Placeholder: 'É indicado trabalhar uma única oferta por campanha, ou seja, um único serviço, produto ou linha de produtos.', Resposta: null },
            { Pergunta: 'Qual a abrangência geográfica que o produto/serviço atende ?', Placeholder: 'Mencione os estados e cidades que lhe interessa gerar demanda para seu produto/serviço.', Resposta: null }, 
            { Pergunta: 'Qual o orçamento de Adwords para este produto/serviço a ser trabalhado ?', Placeholder: 'Conside o que está sendo oferecido pela concorrência e região escolhida.', Resposta: null }, 
            { Pergunta: 'Qual o principal atributo do produto/serviço trabalhado ?', Placeholder: 'Destaque as principais características, pontos fortes e os benefícios que mais chamam a atenção dos clientes.', Resposta: null }, 
            { Pergunta: 'Quem é o público deste produto/serviço que será oferecido ?', Placeholder: 'Mencione características, cargo, segmento de atuação da empresa etc.', Resposta: null }, 
            { Pergunta: 'Como você imagina que seus clientes procuram este produto/serviço no Google ?', Placeholder: 'Quais palavras-chave você imagina que eles procuram.', Resposta: null }, 
            { Pergunta: 'Qual principais diferenciais da sua empresa ?', Placeholder: 'O que faz sua empresa ser especial e diferente da concorrência.', Resposta: null }, 
            { Pergunta: 'Quem são seus principais clientes ?', Placeholder: 'Importante para dar destaque em sua campanha.', Resposta: null }, 
            { Pergunta: 'Quem são seus principais parceiros ?', Placeholder: 'Importante para dar força em sua campanha.', Resposta: null }, 
            { Pergunta: 'Quem são seus principais concorrentes ?', Placeholder: 'Importante para podermos estudar o seu mercado e contextualizá-lo na criação.', Resposta: null }, 
            { Pergunta: 'Existe alguma referência visual que você queira indicar ?', Placeholder: 'Envie links de sites ou nomes de marcas que você admira e poderia nos servir de inspiração.', Resposta: null }
        ];

		var _inclusaoDeCliente = false;
		var _novaLandingPage = false;

		var _dadosLogin = null;
		var _dadosComplemento = null;
		var _oferta = null;

		var _idLoginToken = null;
    	var _accessToken = null;
    	var _refreshToken = null;

    	var NovoLogin = $resource('/login');
    	var NovoComplemento = $resource('/complementoLogin');
		var LoginPorObjectIDLogin = $resource('/login/id/:objectIdLogin');
		var ComplementoObjectIDLogin = $resource('/complementoLogin/:objectIdLogin');
		
		var NovoUnbounce = $resource('/unbounce');
		var OfertasPorObjectID = $resource('/unbounce/:objectId');

		var NovoGoogle = $resource('/google');
		var DadosGooglePorOferta = $resource('/google/:objectIdLogin/:unbouncePageId');

		var NovoBriefing = $resource('/briefing');
		var BriefingPorOferta = $resource('/briefingPorOferta/:objectIdLogin/:objectIdCampanha');
			
 
		$scope.clickMenu = function(menu) {

			$scope.menuDadosCadastrais = (menu == 'dc');
			$scope.menuOfertas = (menu == 'o');
			$scope.menuSEO = (menu == 'seo');

		};

		$scope.abrirTela = function() {
			abrirLoader();
			document.getElementById('divFiltros').style.display = 'none';	

			_inclusaoDeCliente = !ClienteService.objectIdCliente;

			if (!_inclusaoDeCliente)
				$scope.consultarCliente();
			else
				fecharLoader();
		};

		$scope.consultarCliente = function() {
			LoginPorObjectIDLogin.get({

				objectIdLogin: ClienteService.objectIdCliente

			}, function(resLogin) {
				_dadosLogin = resLogin;

				$scope.contato = resLogin.email;
				$scope.login = resLogin.login;
				$scope.senha = resLogin.senha;
				
				$scope.tipo = resLogin.tipo;

				$scope.listaTipos.forEach(function(itemTipo){
					if (itemTipo.id == $scope.tipo)
						$scope.tipoCliente = itemTipo.descricao;
				});

				ComplementoObjectIDLogin.get({

					objectIdLogin: ClienteService.objectIdCliente

				}, function(resComplementoLogin){

					_dadosComplemento = resComplementoLogin;

					$scope.empresa = resComplementoLogin.nome;

					OfertasPorObjectID.query({

						objectId: ClienteService.objectIdCliente

					}, function(resOfertas){

						$scope.listaOfertas = [];

						resOfertas.forEach(function(oferta, indexOferta, lista){

							$scope.listaOfertas.push({
								Objeto: oferta,
								Nome: oferta.nome,
								Google: null,
								Briefing: null
							});

							if (indexOferta == lista.length-1) {
								fecharLoader();
							}
						});
					});
				});
			});			
		};

		$scope.mouseOver = function(campoDeEdicao) {
			if (campoDeEdicao == 'empresa')
				$scope.botaoEditarNomeEmpresa = true;
			else if (campoDeEdicao == 'oferta')
				$scope.botaoEditarNomeLandingpage = true;
			else if (campoDeEdicao == 'tipo')
				$scope.botaoEditarTipo = true;
			else if (campoDeEdicao == 'status')
				$scope.botaoEditarStatus = true;
			else if (campoDeEdicao == 'contato')
				$scope.botaoEditarContato = true;
			else if (campoDeEdicao == 'login')
				$scope.botaoEditarLogin = true;
			else if (campoDeEdicao == 'senha')
				$scope.botaoEditarSenha = true;
		};

		$scope.mouseLeave = function(campoDeEdicao) {
			if (campoDeEdicao == 'empresa')
				$scope.botaoEditarNomeEmpresa = false;
			else if (campoDeEdicao == 'oferta')
				$scope.botaoEditarNomeLandingpage = false;
			else if (campoDeEdicao == 'tipo')
				$scope.botaoEditarTipo = false;
			else if (campoDeEdicao == 'status')
				$scope.botaoEditarStatus = false;
			else if (campoDeEdicao == 'contato')
				$scope.botaoEditarContato = false;
			else if (campoDeEdicao == 'login')
				$scope.botaoEditarLogin = false;
			else if (campoDeEdicao == 'senha')
				$scope.botaoEditarSenha = false;
		};

		$scope.editNomeEmpresa = function(){
			if (($scope.empresa) && ($scope.empresa != null) && ($scope.empresa != ''))
				$scope.editarNomeEmpresa = !$scope.editarNomeEmpresa;

			if ($scope.editarNomeEmpresa) {

				if ($scope.empresa == "Novo cliente")
					$scope.empresa = null;
			}
			else {
				if (_inclusaoDeCliente) {
					$scope.login = removerCaracterEspecial($scope.empresa).toLowerCase();
					$scope.senha = gerarSenha();
				}
			}
		};

		$scope.editNomeLandingpage = function(){
			if (($scope.NomeLandingpage) && ($scope.NomeLandingpage != null) && ($scope.NomeLandingpage != ''))
				$scope.editarNomeLandingPage = !$scope.editarNomeLandingPage;
		};

		$scope.editTipo = function(){
			$scope.editarTipo = !$scope.editarTipo;

			$scope.listaTipos.forEach(function(itemTipo){
				if (itemTipo.id == $scope.tipo)
					$scope.tipoCliente = itemTipo.descricao;
			});
		};

		$scope.editStatus = function(){
			$scope.editarStatus = !$scope.editarStatus;

			$scope.listaStatus.forEach(function(itemStatus){
				if (itemStatus.id == $scope.status)
					$scope.statusDescricao = itemStatus.descricao;
			});
		};

		$scope.editContato = function(){
			$scope.editarContato = !$scope.editarContato;

			if ($scope.editarContato) {

				if ($scope.contato == "E-mail para contato")
					$scope.contato = null;
			}
		};

		$scope.editLogin = function(){
			$scope.editarLogin = !$scope.editarLogin;

			if ($scope.editarLogin) {

				if ($scope.login == "Escolha um login")
					$scope.login = null;
			}
		};

		$scope.editSenha = function(){
			$scope.editarSenha = !$scope.editarSenha;

			if ($scope.editarSenha) {

				if ($scope.senha == "Digite uma senha")
					$scope.senha = null;
			}
		};

		$scope.adicionarNovaLandingpage = function() {

			_novaLandingPage = true;
			$scope.editarNomeLandingPage = true;

			$scope.NomeLandingpage = null;
			$scope.pageID = null;
			$scope.pagePath = null;
			$scope.urlAcesso = null;
			$scope.campanhaAdwords = null;
			$scope.contaAnalytics = null;
			$scope.propriedadeAnalytics = null;
			$scope.vistaAnalytics = null;

			$scope.abrirModalLandingPage();
			$scope.popularListaContas();
		};

		$scope.editarLandingPage = function(paramOferta) {
			abrirLoader();

			_landingPage = paramOferta;

			_novaLandingPage = false;

			$scope.NomeLandingpage = paramOferta.Nome;
			$scope.pageID = paramOferta.Objeto.pageId;
			$scope.pagePath = paramOferta.Objeto.pagePath;
			$scope.urlAcesso = paramOferta.Objeto.url;

			if (paramOferta.Google) {

				$scope.campanhaAdwords = paramOferta.Google.idAdwords;
				$scope.contaAnalytics = paramOferta.Google.accountId;
				$scope.propriedadeAnalytics = paramOferta.Google.webPropertyId;
				$scope.vistaAnalytics = paramOferta.Google.profileId;

				$scope.abrirModalLandingPage();
				$scope.popularListaContas();

			} else {

				DadosGooglePorOferta.get({

					objectIdLogin: ClienteService.objectIdCliente,
					unbouncePageId: paramOferta.Objeto.pageId

				}, function(resDadosGooglePorOferta) {

					if (resDadosGooglePorOferta) {
						paramOferta.Google = resDadosGooglePorOferta;

						$scope.campanhaAdwords = resDadosGooglePorOferta.idAdwords;

						if ((resDadosGooglePorOferta.accountId) && 
							(resDadosGooglePorOferta.webPropertyId) && 
							(resDadosGooglePorOferta.profileId)) {

							$scope.contaAnalytics = resDadosGooglePorOferta.accountId;
							$scope.propriedadeAnalytics = resDadosGooglePorOferta.webPropertyId;
							$scope.vistaAnalytics = resDadosGooglePorOferta.profileId;

							$scope.abrirModalLandingPage();
							$scope.popularListaContas();

						} else {

							$scope.abrirModalLandingPage();
							$scope.popularListaContas();

						}

					} else {

						$scope.abrirModalLandingPage();
						$scope.popularListaContas();

					}
				});
			}
		};

		$scope.abrirModalLandingPage = function() {
			if (!_novaLandingPage)
				$scope.editarNomeLandingPage = false;

			fecharLoader();
			$('#modalLandingPage').modal('show');
		};

		$scope.alterarConta = function() {

			$scope.listaPropriedadesAnalytics = [];
			$scope.listaVistasAnalytics = [];

			$scope.propriedadeAnalytics = null;
			$scope.vistaAnalytics = null;

			$scope.popularListaPropriedades();

		};

		$scope.popularListaContas = function() {
			abrirLoader();

			gapi.client.analytics.management.accounts.list().execute(

    			function(resultadosAccounts) {
    				$scope.listaContasAnalytics = [];	
    				
      				resultadosAccounts.items.forEach(function(item, index, array) {

  						$scope.listaContasAnalytics.push({
    	    				"id": item.id,
        					"nome": item.name + ' (' + item.id + ')'
      					});	          

			        	if (index == array.length-1) {

			        		fecharLoader();

			        		$scope.$apply();

			        		if ($scope.propriedadeAnalytics)
			        			$scope.popularListaPropriedades(); 			        			
      					}
        			});
    		});
		};

		$scope.alterarPropriedade = function() {

			$scope.listaVistasAnalytics = [];
			$scope.vistaAnalytics = null;

			$scope.popularListaVistasDaPropriedade();

		};

		$scope.popularListaPropriedades = function() {
			abrirLoader();

			gapi.client.analytics.management.webproperties.list({ 

      			'accountId': $scope.contaAnalytics

    		}).execute(

    			function (resultadosWebPropertyIds) {

	    			$scope.listaPropriedadesAnalytics = [];

	    			resultadosWebPropertyIds.items.forEach(function(item, index, array) {

	    				$scope.listaPropriedadesAnalytics.push({
		    				"id": item.id,
	    					"nome": item.name + ' (' + item.id + ')'
	  					});	          

			        	if (index == array.length-1) {

			        		fecharLoader();

			        		$scope.$apply();

			        		if ($scope.vistaAnalytics)
			        			$scope.popularListaVistasDaPropriedade();
	  					}

	    			});
    		});
		};

		$scope.popularListaVistasDaPropriedade = function() {
			abrirLoader();

			gapi.client.analytics.management.profiles.list({ 

    			'accountId': $scope.contaAnalytics,
    			'webPropertyId': $scope.propriedadeAnalytics

  			}).execute(

  				function (resultadosProfileIds) {

  					$scope.listaVistasAnalytics = [];

    				resultadosProfileIds.items.forEach(function(item, index, array) {

    					$scope.listaVistasAnalytics.push({
		    				"id": item.id,
	    					"nome": item.name + ' (' + item.id + ')'
	  					});	

        				if (index == array.length-1) {
        					
        					fecharLoader();
        					$scope.$apply();

          				}
 				    });
  			});
		};

		$scope.salvarLandingPage = function() {
			abrirLoader();

			if (_novaLandingPage) {

				$scope.listaOfertas.push({
					Nome: $scope.NomeLandingpage,

					Objeto: {
						nome: $scope.NomeLandingpage,
						pageId: $scope.pageID,
						pagePath: $scope.pagePath,
						url: $scope.urlAcesso
					},

					Google: {
						unbouncePageId: $scope.pageID,
						idAdwords: $scope.campanhaAdwords,
						accountId: $scope.contaAnalytics,
						webPropertyId: $scope.propriedadeAnalytics,
						profileId: $scope.vistaAnalytics
					}
				});

				$scope.fecharModalLandingPage();

			} else {
				$scope.listaOfertas.forEach(function(item) {

					if (item.Objeto._id == _landingPage.Objeto._id) {

						item.Nome = $scope.NomeLandingpage;
						item.Objeto.nome = $scope.NomeLandingpage;
						
						item.Objeto.pageId = $scope.pageID;
						item.Objeto.pagePath = $scope.pagePath;
						item.Objeto.url = $scope.urlAcesso;

						item.Google.unbouncePageId = $scope.pageID;
						item.Google.idAdwords = $scope.campanhaAdwords;
						item.Google.accountId = $scope.contaAnalytics;
						item.Google.webPropertyId = $scope.propriedadeAnalytics;
						item.Google.profileId = $scope.vistaAnalytics;

						$scope.fecharModalLandingPage();
						return;
					}
				});			
			}
		};


		$scope.fecharModalLandingPage = function() {
			fecharLoader();
			$('#modalLandingPage').modal('hide');
		};


		$scope.editarBriefing = function(paramOferta) {
			abrirLoader();
			$scope.perguntaAtualBriefing = 1;

			_oferta = paramOferta;

			if (paramOferta.Briefing) {

				_listaPerguntasBriefing[0].Resposta = paramOferta.Briefing.emailRecebeLeads;
				_listaPerguntasBriefing[1].Resposta = paramOferta.Briefing.produtoServicosTrabalhados;
				_listaPerguntasBriefing[2].Resposta = paramOferta.Briefing.abrangenciaGeografica;
				_listaPerguntasBriefing[3].Resposta = paramOferta.Briefing.orcamentoAdwords;
				_listaPerguntasBriefing[4].Resposta = paramOferta.Briefing.atributosTrabalhados;
				_listaPerguntasBriefing[5].Resposta = paramOferta.Briefing.publicoAlvo;
				_listaPerguntasBriefing[6].Resposta = paramOferta.Briefing.comoClientesProcuramGoogle;
				_listaPerguntasBriefing[7].Resposta = paramOferta.Briefing.pricipaisDiferenciais;
				_listaPerguntasBriefing[8].Resposta = paramOferta.Briefing.clientes;
				_listaPerguntasBriefing[9].Resposta = paramOferta.Briefing.parceiros;
				_listaPerguntasBriefing[10].Resposta = paramOferta.Briefing.concorrentes;
				_listaPerguntasBriefing[11].Resposta = paramOferta.Briefing.referenciaVisual;

				$scope.atualizarDadosBriefing();		
				$('#modalBriefing').modal('show');
				fecharLoader();

			} else {

				if (_inclusaoDeCliente) {

					paramOferta.Briefing = [{

						emailRecebeLeads: '',
						produtoServicosTrabalhados: '',
						abrangenciaGeografica: '',
						orcamentoAdwords: '',
						atributosTrabalhados: '',
						publicoAlvo: '',
						comoClientesProcuramGoogle: '',
						pricipaisDiferenciais: '',
						clientes: '',
						parceiros: '',
						concorrentes: '',
						referenciaVisual: ''

					}];

					$scope.atualizarDadosBriefing();		
					$('#modalBriefing').modal('show');
					fecharLoader();		

				} else {

					console.log(ClienteService.objectIdCliente);
					console.log(paramOferta.Objeto._id);

					BriefingPorOferta.get({

						objectIdLogin: ClienteService.objectIdCliente,
						objectIdCampanha: paramOferta.Objeto._id

					}, function(resBriefingPorOferta) {

						if (resBriefingPorOferta._id) {

							paramOferta.Briefing = resBriefingPorOferta;

							_listaPerguntasBriefing[0].Resposta = resBriefingPorOferta.emailRecebeLeads;
							_listaPerguntasBriefing[1].Resposta = resBriefingPorOferta.produtoServicosTrabalhados;
							_listaPerguntasBriefing[2].Resposta = resBriefingPorOferta.abrangenciaGeografica;
							_listaPerguntasBriefing[3].Resposta = resBriefingPorOferta.orcamentoAdwords;
							_listaPerguntasBriefing[4].Resposta = resBriefingPorOferta.atributosTrabalhados;
							_listaPerguntasBriefing[5].Resposta = resBriefingPorOferta.publicoAlvo;
							_listaPerguntasBriefing[6].Resposta = resBriefingPorOferta.comoClientesProcuramGoogle;
							_listaPerguntasBriefing[7].Resposta = resBriefingPorOferta.pricipaisDiferenciais;
							_listaPerguntasBriefing[8].Resposta = resBriefingPorOferta.clientes;
							_listaPerguntasBriefing[9].Resposta = resBriefingPorOferta.parceiros;
							_listaPerguntasBriefing[10].Resposta = resBriefingPorOferta.concorrentes;
							_listaPerguntasBriefing[11].Resposta = resBriefingPorOferta.referenciaVisual;

						} else {

							_listaPerguntasBriefing[0].Resposta = '';
							_listaPerguntasBriefing[1].Resposta = '';
							_listaPerguntasBriefing[2].Resposta = '';
							_listaPerguntasBriefing[3].Resposta = '';
							_listaPerguntasBriefing[4].Resposta = '';
							_listaPerguntasBriefing[5].Resposta = '';
							_listaPerguntasBriefing[6].Resposta = '';
							_listaPerguntasBriefing[7].Resposta = '';
							_listaPerguntasBriefing[8].Resposta = '';
							_listaPerguntasBriefing[9].Resposta = '';
							_listaPerguntasBriefing[10].Resposta = '';
							_listaPerguntasBriefing[11].Resposta = '';

							paramOferta.Briefing = [{

								emailRecebeLeads: '',
								produtoServicosTrabalhados: '',
								abrangenciaGeografica: '',
								orcamentoAdwords: '',
								atributosTrabalhados: '',
								publicoAlvo: '',
								comoClientesProcuramGoogle: '',
								pricipaisDiferenciais: '',
								clientes: '',
								parceiros: '',
								concorrentes: '',
								referenciaVisual: ''

							}];

						}

						$scope.atualizarDadosBriefing();		
						$('#modalBriefing').modal('show');
						fecharLoader();				 
					});
				}
			}			
		};

		$scope.voltarBriefing = function() {
			_listaPerguntasBriefing[$scope.perguntaAtualBriefing-1].Resposta = $scope.respostaBriefing;

			$scope.perguntaAtualBriefing--;
			$scope.atualizarDadosBriefing();
		};

		$scope.avancarBriefing = function() {
			_listaPerguntasBriefing[$scope.perguntaAtualBriefing-1].Resposta = $scope.respostaBriefing;

			$scope.perguntaAtualBriefing++;
			$scope.atualizarDadosBriefing();
		};

		$scope.atualizarDadosBriefing = function() {
			$scope.perguntaBriefing = _listaPerguntasBriefing[$scope.perguntaAtualBriefing-1].Pergunta;
			$scope.placeholderBriefing = _listaPerguntasBriefing[$scope.perguntaAtualBriefing-1].Placeholder;
			$scope.respostaBriefing = _listaPerguntasBriefing[$scope.perguntaAtualBriefing-1].Resposta;
		};	

		$scope.salvarBriefing = function() {
			_listaPerguntasBriefing[$scope.perguntaAtualBriefing-1].Resposta = 
				$scope.respostaBriefing;

			abrirLoader();

			$scope.listaOfertas.forEach(function(item) {

				if (item.Objeto._id == _oferta.Objeto._id) {

					item.Briefing.emailRecebeLeads = _listaPerguntasBriefing[0].Resposta;
					item.Briefing.produtoServicosTrabalhados = _listaPerguntasBriefing[1].Resposta;
					item.Briefing.abrangenciaGeografica = _listaPerguntasBriefing[2].Resposta;
					item.Briefing.orcamentoAdwords = _listaPerguntasBriefing[3].Resposta;
					item.Briefing.atributosTrabalhados = _listaPerguntasBriefing[4].Resposta;
					item.Briefing.publicoAlvo = _listaPerguntasBriefing[5].Resposta;
					item.Briefing.comoClientesProcuramGoogle = _listaPerguntasBriefing[6].Resposta;
					item.Briefing.pricipaisDiferenciais = _listaPerguntasBriefing[7].Resposta;
					item.Briefing.clientes = _listaPerguntasBriefing[8].Resposta;
					item.Briefing.parceiros = _listaPerguntasBriefing[9].Resposta;
					item.Briefing.concorrentes = _listaPerguntasBriefing[10].Resposta;
					item.Briefing.referenciaVisual = _listaPerguntasBriefing[11].Resposta;

					$scope.fecharModalBriefing();
				}
			});
		};

		$scope.fecharModalBriefing = function() {
			fecharLoader();
			$('#modalBriefing').modal('hide');
		};
		

		$scope.voltar = function() {
			$location.path('/administrativo');
		};

		$scope.salvar = function() {
			abrirLoader();

			$scope.salvarDadosCadastrais(
				function(){

					$scope.salvarOfertas(
						function(){

							fecharLoader();
							$location.path('/administrativo');
					});
			});
		};

		$scope.salvarDadosCadastrais = function(callback) {
			var _novoLogin = new NovoLogin();

			if (!_inclusaoDeCliente)
				_novoLogin._id = _dadosLogin._id;

			_novoLogin.status = $scope.status;
			_novoLogin.login = $scope.login;
			_novoLogin.email = $scope.contato;
			_novoLogin.senha = $scope.senha;
			_novoLogin.tipo = $scope.tipo;

			_novoLogin.$save(function(resultadoNovoLogin){
				var _novoComplemento = new NovoComplemento();

				if (!_inclusaoDeCliente) {
					_novoComplemento._id = _dadosComplemento._id;
					_novoComplemento.objectIdLogin = _dadosLogin._id;
					_novoComplemento.dataInclusao = _dadosComplemento.dataInclusao;
				}
				else {
					_novoComplemento.dataInclusao = new Date();

					_novoComplemento.objectIdLogin = resultadoNovoLogin._id;
					_dadosLogin = resultadoNovoLogin._id;
				}

				_novoComplemento.nome = $scope.empresa;				

				_novoComplemento.$save(
					function(){
						callback();
					});
			});
		};

		$scope.salvarOfertas = function(callback) {
			$scope.listaOfertas.forEach(function(oferta, index, lista) {

				var _novoUnbounce = new NovoUnbounce();

				if (oferta.Objeto._id) {

					_novoUnbounce._id = oferta.Objeto._id;
					_novoUnbounce.dataEntrada = new Date();
					_novoUnbounce.status = oferta.Objeto.status;

				} else {
					_novoUnbounce.dataEntrada = oferta.Objeto.dataEntrada;
					_novoUnbounce.status = "B";
				}				

				if (!_inclusaoDeCliente)
					_novoUnbounce.objectIdLogin = ClienteService.objectIdCliente;
				else 
					_novoUnbounce.objectIdLogin = _dadosLogin;

				_novoUnbounce.pageId = oferta.Objeto.pageId;
				_novoUnbounce.pagePath = oferta.Objeto.pagePath;
				_novoUnbounce.url = oferta.Objeto.url;
				_novoUnbounce.nome = oferta.Objeto.nome;

				_novoUnbounce.$save(function(salvoUnbounce){

					if (oferta.Google)
						$scope.salvarDadosGoogle(oferta.Google);

					if (oferta.Briefing)
						$scope.salvarDadosBriefing(oferta.Briefing, salvoUnbounce._id);

				});

				if (index == lista.length-1) {
					callback();
				}
			});
		};

		$scope.salvarDadosGoogle = function(paramDadosGoogle) {
			var _novoGoogle = new NovoGoogle();

			if (paramDadosGoogle._id) 
				_novoGoogle._id = paramDadosGoogle._id;

			if (_inclusaoDeCliente)
				_novoGoogle.objectIdLogin = _dadosLogin;
			else 
				_novoGoogle.objectIdLogin = ClienteService.objectIdCliente;

			_novoGoogle.unbouncePageId = paramDadosGoogle.unbouncePageId;
			_novoGoogle.idAdwords = paramDadosGoogle.idAdwords;
			_novoGoogle.accountId = paramDadosGoogle.accountId;
			_novoGoogle.webPropertyId = paramDadosGoogle.webPropertyId;
			_novoGoogle.profileId = paramDadosGoogle.profileId;

			_novoGoogle.$save();
		};

		$scope.salvarDadosBriefing = function(paramBriefing, idOferta) {
			var _novoBriefing = new NovoBriefing();

			if (paramBriefing._id) 
				_novoBriefing._id = paramBriefing._id;

			if (_inclusaoDeCliente)
				_novoBriefing.objectIdLogin = _dadosLogin;
			else 
				_novoBriefing.objectIdLogin = ClienteService.objectIdCliente;

			_novoBriefing.objectIdCampanha = idOferta;
			_novoBriefing.emailRecebeLeads = paramBriefing.emailRecebeLeads;
			_novoBriefing.produtoServicosTrabalhados = paramBriefing.produtoServicosTrabalhados;
			_novoBriefing.abrangenciaGeografica = paramBriefing.abrangenciaGeografica;
			_novoBriefing.orcamentoAdwords = paramBriefing.orcamentoAdwords;
			_novoBriefing.atributosTrabalhados = paramBriefing.atributosTrabalhados;
			_novoBriefing.publicoAlvo = paramBriefing.publicoAlvo;
			_novoBriefing.comoClientesProcuramGoogle = paramBriefing.comoClientesProcuramGoogle;
			_novoBriefing.pricipaisDiferenciais = paramBriefing.pricipaisDiferenciais;
			_novoBriefing.clientes = paramBriefing.clientes;
			_novoBriefing.parceiros = paramBriefing.parceiros;
			_novoBriefing.concorrentes = paramBriefing.concorrentes;
			_novoBriefing.referenciaVisual = paramBriefing.referenciaVisual;

			_novoBriefing.$save();
		};

		$scope.abrirTela();
});