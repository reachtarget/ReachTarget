diferencaDatas = function(dataInicial, dataFinal) {
    var minuto = 60000; 
    var dia = minuto * 60 * 24;
    var horarioVerao = 0;

    var _dataInicial = new Date(dataInicial);
    _dataInicial.setHours(0);
    _dataInicial.setMinutes(0);
    _dataInicial.setSeconds(0);

    var _dataFinal = new Date(dataFinal);
    _dataFinal.setHours(0);
    _dataFinal.setMinutes(0);
    _dataFinal.setSeconds(0);
    
    var fh1 = _dataInicial.getTimezoneOffset();
    var fh2 = _dataFinal.getTimezoneOffset(); 
    
    if(_dataFinal > _dataInicial) {
        horarioVerao = (fh2 - fh1) * minuto;
    } 
    else {
        horarioVerao = (fh1 - fh2) * minuto;    
    }
    
    var dif = Math.abs(_dataFinal.getTime() - _dataInicial.getTime()) - horarioVerao;
    return Math.ceil(dif / dia);
};

lpad = function(value, length) {
    return Array(Math.max(length - String(value).length + 1, 0)).join(0) + value;
};

gravarCookie = function(nome, valor, dias) {
    var _data = new Date();
    var _expirar = null;
    
    _data.setTime(_data.getTime() + (dias * 24 * 60 * 60 * 1000));
    _expirar = "; expires=" + _data.toGMTString();

    document.cookie = nome + "=" + valor + _expirar + "; path=/";
};

lerCookie = function (nome) {
    var i = null;
    var c = null;
    var _cookie = null;
    var nameEQ = nome + "=";

    _cookie = document.cookie.split(';');

    for(i=0;i < _cookie.length;i++) {
        c = _cookie[i];
        
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }

        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }

    return '';
};

apagarCookie = function(nome) {
    var _data = new Date(1970, 1, 1);
    var _expirar = null;
    
    _expirar = "; expires=" + _data.toGMTString();

    document.cookie = nome + "=" + _expirar + "; path=/";
};

abrirLoader = function() {
    document.getElementById('loaderIndex').style.display = 'block';
};

fecharLoader = function() {
    document.getElementById('loaderIndex').style.display = 'none';
};

formarData = function(data) {
	var _data = new Date(data);

	var _formatar = 
		lpad(_data.getDate(), 2) + "/" +
		lpad(new Number(_data.getMonth() + 1), 2) + "/" +
		_data.getFullYear();

	return _formatar;
};

retornarMes = function(mes) {
    var _meses = [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ];

    return _meses[mes];
};
 
retornarDataInicialFinal = function(dataInicial, dataFinal) {
    var _meses = [ "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dev" ];

    var _texto = 
        dataInicial.getDate() +  " " + 
        _meses[dataInicial.getMonth()] + " " + 
        dataInicial.getFullYear() + " até " + 

        dataFinal.getDate() +  " " + 
        _meses[dataFinal.getMonth()] + " " + 
        dataFinal.getFullYear();

    return _texto;
};


var _metodoDeAtualizacao;

clickAtualizar = function() {
    _metodoDeAtualizacao();
};

function formatReal(mixed) {
    if (mixed == 0) {

        return '0,00';
        
    } else {

        var int = parseInt(mixed.toFixed(2).toString().replace(/[^\d]+/g, ''));
        var tmp = int + '';

        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");

        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
    }    
};

function formatarValor(valor){
    var _auxiliar = valor;
    var tam = valor.toString().length;

    if (tam >= 4) {
        _auxiliar = 
            valor.toString().substr(0, tam - 3) + '.' + 
            valor.toString().substr(tam - 3, tam);
    }

    return _auxiliar;
}