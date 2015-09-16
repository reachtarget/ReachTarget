angular.module('reachtarget')
    .controller('BriefingMaaSController', function($resource, $scope, $location, LoginService) {

    	$scope.BemVindo = false;
    	$scope.Ofertas = false;
    	$scope.Obrigado = false;

    	$scope.Voltar = false;

        $scope.NomeDaOferta = "";
        $scope.OfertaAtual = 0;
        $scope.TotalOfertas = 0;

        $scope.Pergunta = "";
        $scope.PerguntaAtual = 0;
        $scope.TotalPerguntas = 12;
        $scope.Placeholder = "";
        $scope.Resposta = null;

        $scope.ProximaOuSalvar = "Avançar";

        var _ofertaAtual = null;
        var _iOfertas = 0;
        var _iPerguntas = 0;

    	var _listaOfertas = [];
        var _listaPerguntas = [
            { Pergunta: 'Qual e-mail deverá receber os leads das campanhas ?', Placeholder: 'Esse e-mail será utilizado para o login no dashboard e receberá todos os formulários que forem preenchidos e os relatórios de desempenho.' }, 
            { Pergunta: 'Qual produtos/serviço será trabalhado ?', Placeholder: 'É indicado trabalhar uma única oferta por campanha, ou seja, um único serviço, produto ou linha de produtos.' },
            { Pergunta: 'Qual a abrangência geográfica que o produto/serviço atende ?', Placeholder: 'Mencione os estados e cidades que lhe interessa gerar demanda para seu produto/serviço.' }, 
            { Pergunta: 'Qual o orçamento de Adwords para este produto/serviço a ser trabalhado ?', Placeholder: 'Conside o que está sendo oferecido pela concorrência e região escolhida.' }, 
            { Pergunta: 'Qual o principal atributo do produto/serviço trabalhado ?', Placeholder: 'Destaque as principais características, pontos fortes e os benefícios que mais chamam a atenção dos clientes.' }, 
            { Pergunta: 'Quem é o público deste produto/serviço que será oferecido ?', Placeholder: 'Mencione características, cargo, segmento de atuação da empresa etc.' }, 
            { Pergunta: 'Como você imagina que seus clientes procuram este produto/serviço no Google ?', Placeholder: 'Quais palavras-chave você imagina que eles procuram.' }, 
            { Pergunta: 'Qual principais diferenciais da sua empresa ?', Placeholder: 'O que faz sua empresa ser especial e diferente da concorrência.' }, 
            { Pergunta: 'Quem são seus principais clientes ?', Placeholder: 'Importante para dar destaque em sua campanha.' }, 
            { Pergunta: 'Quem são seus principais parceiros ?', Placeholder: 'Importante para dar força em sua campanha.' }, 
            { Pergunta: 'Quem são seus principais concorrentes ?', Placeholder: 'Importante para podermos estudar o seu mercado e contextualizá-lo na criação.' }, 
            { Pergunta: 'Existe alguma referência visual que você queira indicar ?', Placeholder: 'Envie links de sites ou nomes de marcas que você admira e poderia nos servir de inspiração.' }
        ];

        var SalvarOferta = $resource('/unbounce');
        var SalvarBriefing = $resource('/briefing');
    	var OfertasPorUsuario = $resource('/unbounce/:objectId');
        var EnviarEmailBriefing = $resource('/email/ofertas/briefing');

    	$scope.consultarOfertasContratadas = function() {

    		OfertasPorUsuario.query({
				objectId: LoginService.objectIdLogin
			}, function(resultadoOfertasContratadas) {

				resultadoOfertasContratadas.forEach(function(item, index, lista) {

					if (item.status == 'B')
						_listaOfertas.push({
                            item: item,

                            nome: item.nome,

                            emailRecebeLeads: null,
                            produtoServicosTrabalhados: null,
                            abrangenciaGeografica: null,
                            orcamentoAdwords: null,
                            atributosTrabalhados: null,
                            publicoAlvo: null,
                            comoClientesProcuramGoogle: null,
                            pricipaisDiferenciais: null,
                            clientes: null,
                            parceiros: null,
                            concorrentes: null,
                            referenciaVisual: null
                        });

					if (index == lista.length-1) {

                        $scope.BemVindo = (_listaOfertas.length > 0);
                        $scope.Obrigado = (_listaOfertas.length == 0);

						fecharLoader();

					}
				});
			});
    	};

    	$scope.iniciarBriefing = function() {

            _iOfertas = 0;
            _iPerguntas = 0;

            $scope.atualizarDadosOfertas();
            $scope.atualizarDadosPerguntas();

            $scope.BemVindo = false;
            $scope.Ofertas = true;
    	};

        $scope.iniciarPerguntas = function() {

            $scope.Ofertas = false;
            $scope.Perguntas = true;

        };

        $scope.atualizarDadosOfertas = function() {

            _ofertaAtual = _listaOfertas[_iOfertas];

            $scope.NomeDaOferta = _listaOfertas[_iOfertas].nome;
            $scope.OfertaAtual = _iOfertas + 1;
            $scope.TotalOfertas = _listaOfertas.length;

        };

        $scope.atualizarDadosPerguntas = function() {

            $scope.Pergunta = _listaPerguntas[_iPerguntas].Pergunta;
            $scope.PerguntaAtual = _iPerguntas+1;
            $scope.TotalPerguntas = _listaPerguntas.length;
            $scope.Placeholder = _listaPerguntas[_iPerguntas].Placeholder;
            
        };

        $scope.voltar = function() {
            _iPerguntas--;

            $scope.perguntasParaResposta();
            $scope.atualizarDadosPerguntas();
        };

        $scope.avancar = function() {
            $scope.respostaParaPergunta();
            $scope.Resposta = null;            

            if (_iPerguntas == _listaPerguntas.length-1) {
                
                if (_iOfertas == _listaOfertas.length-1) {

                    abrirLoader();
                    $scope.salvarBriefing();

                } else {

                    _iOfertas++;
                    _iPerguntas = 0;

                    $scope.atualizarDadosOfertas();
                    $scope.atualizarDadosPerguntas();

                    $scope.Ofertas = true;
                    $scope.Perguntas = false;
                }

            } else {
                _iPerguntas++;
                $scope.atualizarDadosPerguntas();
                $scope.perguntasParaResposta();

                if (_iPerguntas == _listaPerguntas.length-1)
                    $scope.ProximaOuSalvar = "Salvar";
            }
        };

        $scope.perguntasParaResposta = function() {
            switch (_iPerguntas) {
                case 0:
                    $scope.Resposta = _ofertaAtual.emailRecebeLeads;
                    break;
                case 1:
                    $scope.Resposta = _ofertaAtual.produtoServicosTrabalhados;
                    break;
                case 2:
                    $scope.Resposta = _ofertaAtual.abrangenciaGeografica;
                    break;
                case 3:
                    $scope.Resposta = _ofertaAtual.orcamentoAdwords;
                    break;
                case 4:
                    $scope.Resposta = _ofertaAtual.atributosTrabalhados;
                    break;
                case 5:
                    $scope.Resposta = _ofertaAtual.publicoAlvo;
                    break;
                case 6:
                    $scope.Resposta = _ofertaAtual.comoClientesProcuramGoogle;
                    break;
                case 7:
                    $scope.Resposta = _ofertaAtual.pricipaisDiferenciais;
                    break;
                case 8:
                    $scope.Resposta = _ofertaAtual.clientes;
                    break;
                case 9:
                    $scope.Resposta = _ofertaAtual.parceiros;
                    break;
                case 10:
                    $scope.Resposta = _ofertaAtual.concorrentes;
                    break;
                case 11:
                    $scope.Resposta = _ofertaAtual.referenciaVisual;
                    break;
            }

        };

        $scope.respostaParaPergunta = function() {
            switch (_iPerguntas) {
                case 0:
                    _ofertaAtual.emailRecebeLeads = $scope.Resposta;
                    break;
                case 1:
                    _ofertaAtual.produtoServicosTrabalhados = $scope.Resposta;
                    break;
                case 2:
                    _ofertaAtual.abrangenciaGeografica = $scope.Resposta;
                    break;
                case 3:
                    _ofertaAtual.orcamentoAdwords = $scope.Resposta;
                    break;
                case 4:
                    _ofertaAtual.atributosTrabalhados = $scope.Resposta;
                    break;
                case 5:
                    _ofertaAtual.publicoAlvo = $scope.Resposta;
                    break;
                case 6:
                    _ofertaAtual.comoClientesProcuramGoogle = $scope.Resposta;
                    break;
                case 7:
                    _ofertaAtual.pricipaisDiferenciais = $scope.Resposta;
                    break;
                case 8:
                    _ofertaAtual.clientes = $scope.Resposta;
                    break;
                case 9:
                    _ofertaAtual.parceiros = $scope.Resposta;
                    break;
                case 10:
                    _ofertaAtual.concorrentes = $scope.Resposta;
                    break;
                case 11:
                    _ofertaAtual.referenciaVisual = $scope.Resposta;
                    break;
            }
        };

        $scope.salvarBriefing = function() {

            $scope.Perguntas = false;
            $scope.Obrigado = true;

            _listaOfertas.forEach(
                function(oferta, index, lista) {

                    var _alterarOferta = new SalvarOferta();
                    _alterarOferta._id = oferta.item._id;
                    _alterarOferta.dataEntrada = oferta.item.dataEntrada;
                    _alterarOferta.nome = oferta.item.nome;
                    _alterarOferta.objectIdLogin = LoginService.objectIdLogin;
                    _alterarOferta.status = "A";
                    _alterarOferta.$save();

                    var _salvarBriefing = new SalvarBriefing();
                    _salvarBriefing.objectIdLogin = LoginService.objectIdLogin
                    _salvarBriefing.objectIdCampanha = oferta.item._id;
                    _salvarBriefing.emailRecebeLeads = oferta.emailRecebeLeads;
                    _salvarBriefing.produtoServicosTrabalhados = oferta.produtoServicosTrabalhados;
                    _salvarBriefing.abrangenciaGeografica = oferta.abrangenciaGeografica;
                    _salvarBriefing.orcamentoAdwords = oferta.orcamentoAdwords;
                    _salvarBriefing.atributosTrabalhados = oferta.atributosTrabalhados;
                    _salvarBriefing.publicoAlvo = oferta.publicoAlvo;
                    _salvarBriefing.comoClientesProcuramGoogle = oferta.comoClientesProcuramGoogle;
                    _salvarBriefing.pricipaisDiferenciais = oferta.pricipaisDiferenciais;
                    _salvarBriefing.clientes = oferta.clientes;
                    _salvarBriefing.parceiros = oferta.parceiros;
                    _salvarBriefing.concorrentes = oferta.concorrentes;
                    _salvarBriefing.referenciaVisual = oferta.referenciaVisual;
                    _salvarBriefing.$save(function() {

                        var _enviarEmailBriefing = new EnviarEmailBriefing();

                        _enviarEmailBriefing.nomeCliente = LoginService.nomeEmpresa;
                        _enviarEmailBriefing.nomeOferta = oferta.item.nome;
                        _enviarEmailBriefing.briefing = {
                            emailRecebeLeads: oferta.emailRecebeLeads,
                            produtoServicosTrabalhados: oferta.produtoServicosTrabalhados,
                            abrangenciaGeografica: oferta.abrangenciaGeografica,
                            orcamentoAdwords: oferta.orcamentoAdwords,
                            atributosTrabalhados: oferta.atributosTrabalhados,
                            publicoAlvo: oferta.publicoAlvo,
                            comoClientesProcuramGoogle: oferta.comoClientesProcuramGoogle,
                            pricipaisDiferenciais: oferta.pricipaisDiferenciais,
                            clientes: oferta.clientes,
                            parceiros: oferta.parceiros,
                            concorrentes: oferta.concorrentes,
                            referenciaVisual: oferta.referenciaVisual
                        };

                        _enviarEmailBriefing.$save();

                    });

                    if (index == lista.length-1) {

                        fecharLoader();
                    };
                });
        }


    	$scope.consultarOfertasContratadas();
});