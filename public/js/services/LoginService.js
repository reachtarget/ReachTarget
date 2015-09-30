angular.module('reachtarget')
	.service('LoginService', function() {
		var login = null;

		var objectIdLogin = "";
		var accountIDUnbounce = "";
		var tipoLogin = "";
		
		var nomeEmpresa = "";
		var complementoLogin = null;

		var TipoAdministrativo = "";
		var PermiteExcluirLead;

		var URLAcesso = "";
		var ApiKey = "";
		var ClienteID = "";
		var ClientSecret = "";
		var RedirectUri = "";
		var tokenGoogle = "";

		var DataInicial = "";
		var DataInicialFormat = "";
		var DataFinal = "";
		var DataFinalFormat = "";

		var AbriuPeloLogin = false;

		var CampanhaSelecionada = null;
		var ListaCampanhas = [];
		var SelectedIndex = 0;


		this.clickAtualizarFiltro = function(){
			clickAtualizar();
		};
});