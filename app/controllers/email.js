var nodemailer = require('nodemailer');

module.exports = function(app) {
    var Login = app.models.login;
	var controller = {};

    var _usuarioEmail = "suporte@siteina.com.br";
    var _senhaEmail = "siteina@67";
    

    controller.enviarEmail = function(req, res) {
        var _i = -1;

        var transporter = 
            nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: _usuarioEmail,
                    pass: _senhaEmail
                }
            });

        var _listaMensagens = [];

        req.body.listaClientes.forEach(function(cliente, indexCliente, listaCliente){
            var message = {
                from: 'MaaS <' + _usuarioEmail + '>',
                to: cliente.Email,
                bcc: 'Henrique <henrique@siteina.com.br>, Guilherme <guilherme.casimiro@siteina.com.br>',
                html: ''
            };

            if (cliente.Tipo == 'S') {
                message.subject = 'Resumo semanal - ' + cliente.Nome;

                message.html = 
                    htmlEstrutura(
                        cliente.Tipo, 
                        cliente.ListaLeads, 
                        {
                            Visualizacoes: cliente.Acessos,
                            Visitantes: cliente.Visitantes,
                            Leads: cliente.Leads,
                            TaxaDeConversao: cliente.Taxa
                        }, 
                        cliente.Periodo,
                        cliente.Comentario);

                setTimeout(function(){
                    transporter.sendMail(message, function(){
                        _i++;

                        if (_i == listaCliente.length-1){
                            res.json('ok');
                        }
                    });
                },
                500);                

            } else {
                message.subject = 'Resumo mensal - ' + cliente.Nome;

                message.html = 
                    htmlEstrutura(
                        'M', 
                        cliente.Paginas, 
                        null,
                        cliente.Periodo,
                        cliente.Comentario);

                setTimeout(function(){
                    transporter.sendMail(message, function(){
                        _i++;

                        if (_i == listaCliente.length-1){
                            res.json('ok');
                        }
                    });
                }, 
                500);
            }  
        });
    };

    controller.enviarEmailLead = function(req, res) {
        if (((req.query.nome != null) && (req.query.nome != "")) &
            ((req.query.email != null) && (req.query.email != "")) &
            ((req.query.telefone != null) && (req.query.telefone != ""))) {

            var _to = req.query.id;
            var _nome = req.query.nome;
            var _email = req.query.email;
            var _telefone = req.query.telefone;
            var _empresa = '';
            var _interesse = '';
            var _cargo = '';

            if (_to == 'henrique@siteina.com.br') {
                res.json('ok');
                return;
            }

            if ((req.query.empresa != null) && (req.query.empresa != ""))
                _empresa = req.query.empresa;

            if ((req.query.interesse != null) && (req.query.interesse != ""))
                _interesse = req.query.interesse;

            if ((req.query.cargo != null) && (req.query.cargo != ""))
                _cargo = req.query.cargo;


            var transporter = 
                nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: _usuarioEmail,
                        pass: _senhaEmail
                    }
                });

            var message = {
                from: 'MaaS <' + _usuarioEmail + '>',
                to: _to,
                bcc: 'Henrique <henrique@siteina.com.br>, Guilherme <guilherme.casimiro@siteina.com.br>',
                subject: 'Novo lead',            
                headers: {
                    'X-Laziness-level': 1000
                },            
                html: htmlEstrutura(
                    'L', 
                    null, 
                    {
                        Nome: _nome,
                        Email: _email,
                        Telefone: _telefone,
                        Empresa: _empresa,
                        Interesse: _interesse,
                        Cargo: _cargo
                })
            };

            transporter.sendMail(message, function(error, info) {
                if (error) {
                    return;
                } else {
                    res.json('ok');
                }
            }); 
        } else {
            res.json('ok');
        }
    };

    controller.enviarEmailNovoLogin = function(req, res) {
        var _to = req.body.id;
        var _login = req.body.login;
        var _senha = req.body.senha;

        var transporter = 
            nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: _usuarioEmail,
                    pass: _senhaEmail
                }
            });

        var message = {
            from: 'MaaS <' + _usuarioEmail + '>',
            to: _to,
            bcc: 'Henrique <henrique@siteina.com.br>, Guilherme <guilherme.casimiro@siteina.com.br>',
            subject: 'Seu login',            
            headers: {
                'X-Laziness-level': 1000
            },            
            html: 
                htmlEstrutura(
                'NL', 
                null, 
                {
                    Login: _login,
                    Senha: _senha
                })
        };

        transporter.sendMail(message, function(error, info) {
            if (error) {
                return;
            } else {
                res.json('ok');
            }
        }); 
    };


    htmlEstrutura = function(mensalSemanalLead, lista, estruturaAuxiliar, periodo, comentario) {
        var _textoAuxiliar = '';

        var _html = '<body bgcolor="#E1E1E1" style="text-align: center;">';

        _html += '<table bgcolor="#E1E1E1" style="display: inline-table;" border="0" cellpadding="0" cellspacing="40" width="600">';
        _html += '  <tbody><tr bgcolor="#FFFFFF">';
        _html += '   <td><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="600">';
        _html += '      <tbody>';
        _html += '      <tr>';
        _html += '       <td><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="600">';
        _html += '          <tbody><tr>';
        _html += '          <td height="15"></td></tr><tr>';

        if (mensalSemanalLead == 'C') 
            _html += '           <td width="20"></td><td><img name="Siteina" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/logotipo-siteina.png" width="79" height="52" border="0" id="maas-logo" alt="Siteina" style="display: block;"></td>';
        else 
            _html += '           <td width="20"></td><td><img name="Marketing as a Service" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/logotipo-maas.gif" width="79" height="52" border="0" id="maas-logo" alt="Marketing as a Service" style="display: block;"></td>';

        _html += '          <td valign="bottom" align="right">';

        if (mensalSemanalLead == 'M')
            _textoAuxiliar = 'RESUMO MENSAL';
        else if ((mensalSemanalLead == 'S') || (mensalSemanalLead == 'C'))
            _textoAuxiliar = 'RESUMO SEMANAL';
        
        if (mensalSemanalLead != 'L') 
            _html += '  <font color="#134D65" size="3" face="Arial"><b>' + _textoAuxiliar + '</b></font>';

        _html += '</td><td width="20"></td></tr>';
        _html += '        <tr>';
        _html += '          <td height="15"></td></tr></tbody></table></td>';
        _html += '      </tr>';
        _html += '      <tr>';
        _html += '          <td height="8"><img name="shadow" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/shadow-header.gif" width="100%" height="8" border="0" id="shadow" alt="Marketing as a Service" style="display: block;"></td></tr><tr bgcolor="#F6F6F6">';
        _html += '       <td align="center" valign="bottom" height="50">';
        
        if (mensalSemanalLead == 'L')
            _textoAuxiliar = 'Novo lead'; 
        else if (mensalSemanalLead == 'NL')
            _textoAuxiliar = 'Login / Senha'; 
        else 
            _textoAuxiliar = periodo;

        _html += '  <font color="#999" size="5" face="Arial"><b>' + _textoAuxiliar + '</b></font>';

        _html += '</td>';
        _html += '      </tr>';
        _html += '      <tr bgcolor="#F6F6F6">';
        _html += '       <td height="30"></td>';
        _html += '      </tr>';
        _html += '<tr bgcolor="#EDEDED">';
        _html += '       <td height="1"></td>';
        _html += '      </tr>';
        _html += '      <tr>';
        _html += '       <td height="30"></td>';
        _html += '      </tr>';        


        if ((mensalSemanalLead == 'S') || (mensalSemanalLead == 'C')) {

            _html += htmlQuadroResumos(
                estruturaAuxiliar.Visualizacoes,
                estruturaAuxiliar.Visitantes, 
                estruturaAuxiliar.Leads, 
                estruturaAuxiliar.TaxaDeConversao);

            if (comentario)
                _html += htmlComentario(comentario);

        } else if (mensalSemanalLead == 'M') {

            lista.forEach(function(lp, indexLP, listaForeachLP){
                _html += htmlQuadroResumos(
                    lp.Visualizacoes,
                    lp.Visitantes, 
                    lp.Leads, 
                    lp.TaxaConversao,
                    lp.NomeLanding);

                if (indexLP == listaForeachLP.length-1) {
                    if (comentario)
                        _html += htmlComentario(comentario);

                   _html += htmlFinal(mensalSemanalLead);
                }
            });            
        } else if ((mensalSemanalLead == 'L') || (mensalSemanalLead == 'NL')) {
        	if (mensalSemanalLead == 'NL')
            	_html += htmlTextoNovoLogin();

            _html += htmlCabecalhoTable();
        }

        if ((mensalSemanalLead == 'S') || (mensalSemanalLead == 'C')) {
            if ((lista) && (lista.length > 0)) {
                _html += htmlCabecalhoTable();

                _html += '                                        <tr bgcolor="#E5E5E5" color="#A6ADAD" align="left">';
                _html += '                                            <td width="10"></td>';
                _html += '                                            <td width="230" height="22"><font color="#838F8F" size="2" face="Arial"><b>Empresa</b></font></td>';
                _html += '                                            <td width="230" height="22"><font color="#838F8F" size="2" face="Arial"><b>E-mail</b></font></td>';
                _html += '                                            <td width="80" height="22"><font color="#838F8F" size="2" face="Arial"><b>Data</b></font></td>';
                _html += '                                            <td width="10"></td>';
                _html += '                                        </tr>';

                lista.forEach(function(lead, indexLead, listaForeachLead){
                    _html += htmlListaLead(lead);

                    if (indexLead == listaForeachLead.length-1) {
                        _html += htmlFinalTable();      

                        _html += htmlFinal(mensalSemanalLead);
                    }
                });
            }
            else {
                _html += htmlFinal(mensalSemanalLead);   
            }
        } else if (mensalSemanalLead == 'L') {
            _html += htmlTableLead('Nome', estruturaAuxiliar.Nome);
            _html += htmlTableLead('Email', estruturaAuxiliar.Email);
            _html += htmlTableLead('Telefone', estruturaAuxiliar.Telefone);

            if (estruturaAuxiliar.Empresa != '')
                _html += htmlTableLead('Empresa', estruturaAuxiliar.Empresa);

            if (estruturaAuxiliar.Interesse != '')
                _html += htmlTableLead('Interesse', estruturaAuxiliar.Interesse);

            if (estruturaAuxiliar.Cargo != '')
                _html += htmlTableLead('Cargo', estruturaAuxiliar.Cargo);

            _html += htmlFinalTable();
            _html += htmlFinal(mensalSemanalLead);
        } else if (mensalSemanalLead == 'NL') {
            _html += htmlTableLead('Login', estruturaAuxiliar.Login);
            _html += htmlTableLead('Senha', estruturaAuxiliar.Senha);

            _html += htmlFinalTable();
            _html += htmlFinal(mensalSemanalLead);
        }

        return _html;
    };  

        


    htmlQuadroResumos = function(visualizacoes, visitas, leads, taxaDeConversao, nome) {
        var _htmlQuadroResumos = "";

        _htmlQuadroResumos += '      <tr>';

        _htmlQuadroResumos += '       <td>';
        _htmlQuadroResumos += '       <table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="600">';
        _htmlQuadroResumos += '          <tbody>';

        if (nome) {
            _htmlQuadroResumos += '      <tr>';
            _htmlQuadroResumos += '        <td width="20"></td><td width="1" ></td>';
            _htmlQuadroResumos += '        <td align="left" height="18" valign="bottom">';
            _htmlQuadroResumos += '          <font color="#999" size="1" face="Arial">&nbsp;&nbsp;';
            _htmlQuadroResumos +=            nome;
            _htmlQuadroResumos += '          </font>';
            _htmlQuadroResumos += '        </td>';
            _htmlQuadroResumos += '      </tr>';
            _htmlQuadroResumos += '      <tr>';
            _htmlQuadroResumos += '      </tr>';
        }

        _htmlQuadroResumos += '           <tr><td width="20"></td><td width="1" bgcolor="#ececec"></td>';
        _htmlQuadroResumos += '           <td><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="125" border-color="#EDEDED">';
        _htmlQuadroResumos += '              <tbody><tr>';
        _htmlQuadroResumos += '               <td height="1" bgcolor="#ececec">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td align="left" height="18" valign="bottom">';
        _htmlQuadroResumos += ' <font color="#999" size="1" face="Arial">&nbsp;&nbsp;';
        _htmlQuadroResumos += ' VISUALIZAÇÕES';
        _htmlQuadroResumos += '</font></td>';
        _htmlQuadroResumos += '              </tr>';
        _htmlQuadroResumos += '              <tr>';
        _htmlQuadroResumos += '               <td height="10"><img name="divider" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/divider.jpg" width="125" height="3" border="0" id="divider" alt="Visualizações"></td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td height="6"></td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td align="left"><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="125" border-color="#EDEDED">';
        _htmlQuadroResumos += '              <tbody><tr>';
        _htmlQuadroResumos += '               <td width="10">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              <td align="left"><font color="#457588" size="5" face="Arial"><b>' + visualizacoes + '</b></font></td><td width="10">';
        _htmlQuadroResumos += ' </td></tr>';
        _htmlQuadroResumos += '            </tbody></table></td>';
        _htmlQuadroResumos += '              </tr>';
        _htmlQuadroResumos += '              <tr>';
        _htmlQuadroResumos += '              <td height="10"></td></tr>';
        _htmlQuadroResumos += '            <tr>';
        _htmlQuadroResumos += '               <td height="1" bgcolor="#ececec">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              </tr></tbody></table></td>';
        _htmlQuadroResumos += '           <td width="1" bgcolor="#ececec"></td><td width="20"></td>';
        _htmlQuadroResumos += '           <td width="1" bgcolor="#ececec"></td><td><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="125" border-color="#EDEDED">';
        _htmlQuadroResumos += '              <tbody><tr>';
        _htmlQuadroResumos += '               <td height="1" bgcolor="#ececec">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td align="left" height="18" valign="bottom">';
        _htmlQuadroResumos += ' <font color="#999" size="1" face="Arial">&nbsp;&nbsp;';
        _htmlQuadroResumos += ' VISITAS';
        _htmlQuadroResumos += '</font></td>';
        _htmlQuadroResumos += '              </tr>';
        _htmlQuadroResumos += '              <tr>';
        _htmlQuadroResumos += '               <td height="10"><img name="divider" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/divider.jpg" width="125" height="3" border="0" id="divider" alt="Visitas" ></td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td height="6"></td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td align="left"><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="125" border-color="#EDEDED">';
        _htmlQuadroResumos += '              <tbody><tr>';
        _htmlQuadroResumos += '               <td width="10">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              <td align="left"><font color="#457588" size="5" face="Arial"><b>' + visitas + '</b></font></td><td width="10">';
        _htmlQuadroResumos += ' </td></tr>';
        _htmlQuadroResumos += '            </tbody></table></td>';
        _htmlQuadroResumos += '              </tr>';
        _htmlQuadroResumos += '              <tr>';
        _htmlQuadroResumos += '              <td height="10"></td></tr>';
        _htmlQuadroResumos += '            <tr>';
        _htmlQuadroResumos += '               <td height="1" bgcolor="#ececec">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              </tr></tbody></table></td>';
        _htmlQuadroResumos += '           <td width="1" bgcolor="#ececec"></td><td width="20"></td>';
        _htmlQuadroResumos += '           <td width="1" bgcolor="#ececec"></td><td><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="125" border-color="#EDEDED">';
        _htmlQuadroResumos += '              <tbody><tr>';
        _htmlQuadroResumos += '               <td height="1" bgcolor="#ececec">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td align="left" height="18" valign="bottom">';
        _htmlQuadroResumos += ' <font color="#999" size="1" face="Arial">&nbsp;&nbsp;';
        _htmlQuadroResumos += ' LEADS';
        _htmlQuadroResumos += '</font></td>';
        _htmlQuadroResumos += '              </tr>';
        _htmlQuadroResumos += '              <tr>';
        _htmlQuadroResumos += '               <td height="10"><img name="divider" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/divider.jpg" width="125" height="3" border="0" id="divider" alt="Leads"></td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td height="6"></td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td align="left"><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="125" border-color="#EDEDED">';
        _htmlQuadroResumos += '              <tbody><tr>';
        _htmlQuadroResumos += '               <td width="10">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              <td align="left"><font color="#457588" size="5" face="Arial"><b>' + leads + '</b></font></td><td width="10">';
        _htmlQuadroResumos += ' </td></tr>';
        _htmlQuadroResumos += '            </tbody></table></td>';
        _htmlQuadroResumos += '              </tr>';
        _htmlQuadroResumos += '              <tr>';
        _htmlQuadroResumos += '              <td height="10"></td></tr>';
        _htmlQuadroResumos += '            <tr>';
        _htmlQuadroResumos += '               <td height="1" bgcolor="#ececec">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              </tr></tbody></table></td>';
        _htmlQuadroResumos += '           <td width="1" bgcolor="#ececec"></td><td width="20"></td><td width="1" bgcolor="#ececec"></td><td><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="125" border-color="#EDEDED">';
        _htmlQuadroResumos += '              <tbody><tr>';
        _htmlQuadroResumos += '               <td height="1" bgcolor="#ececec">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td align="left" height="18" valign="bottom">';
        _htmlQuadroResumos += ' <font color="#999" size="1" face="Arial">&nbsp;&nbsp;';
        _htmlQuadroResumos += ' TAXA DE CONVERSÃO';
        _htmlQuadroResumos += '</font></td>';
        _htmlQuadroResumos += '              </tr>';
        _htmlQuadroResumos += '              <tr>';
        _htmlQuadroResumos += '               <td height="10"><img name="divider" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/divider.jpg" width="125" height="3" border="0" id="divider" alt="Taxa de conversão"></td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td height="6"></td>';
        _htmlQuadroResumos += '              </tr><tr>';
        _htmlQuadroResumos += '               <td align="left"><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="125" border-color="#EDEDED">';
        _htmlQuadroResumos += '              <tbody><tr>';
        _htmlQuadroResumos += '               <td width="10">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              <td align="left"><font color="#457588" size="5" face="Arial"><b>' + taxaDeConversao + ' %</b></font></td><td width="10">';
        _htmlQuadroResumos += ' </td></tr>';
        _htmlQuadroResumos += '            </tbody></table></td>';
        _htmlQuadroResumos += '              </tr>';
        _htmlQuadroResumos += '              <tr>';
        _htmlQuadroResumos += '              <td height="10"></td></tr>';
        _htmlQuadroResumos += '            <tr>';
        _htmlQuadroResumos += '               <td height="1" bgcolor="#ececec">';
        _htmlQuadroResumos += ' </td>';
        _htmlQuadroResumos += '              </tr></tbody></table></td>';
        _htmlQuadroResumos += '          <td width="1" bgcolor="#ececec"></td><td width="20"></td></tr>';
        _htmlQuadroResumos += '        </tbody></table></td>';
        _htmlQuadroResumos += '      </tr>';
        _htmlQuadroResumos += '      <tr>';
        _htmlQuadroResumos += '       <td height="30"></td>';
        _htmlQuadroResumos += '      </tr>';

        return _htmlQuadroResumos;
    };

    htmlCabecalhoTable = function() {
        var _htmlCabecalhoTable = '';

        _htmlCabecalhoTable += '      <tr>';
        _htmlCabecalhoTable += '       <td><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="560">';
        _htmlCabecalhoTable += '          <tbody><tr>';
        _htmlCabecalhoTable += '           <td>';
        _htmlCabecalhoTable += '                <table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="600">';
        _htmlCabecalhoTable += '                    <tbody>';
        _htmlCabecalhoTable += '                        <tr>';
        _htmlCabecalhoTable += '                            <td width="20"></td>';
        _htmlCabecalhoTable += '                            <td width="560">';
        _htmlCabecalhoTable += '                                <table style="display: inline-table; border: 1px solid #ececec;" align="left" border="0" cellpadding="0" cellspacing="0" width="560">';
        _htmlCabecalhoTable += '                                    <tbody>';

        return _htmlCabecalhoTable;
    };

    htmlTextoNovoLogin = function() {
        var _htmlTextoNovoLogin = "";

        _htmlTextoNovoLogin += '      <tr>';
        _htmlTextoNovoLogin += '       <tr height="30" valign="center" align="center">';
        _htmlTextoNovoLogin += '          <font color="#838F8F" size="3" face="Arial"><b>Olá, bem vindo!</b></font>';
        _htmlTextoNovoLogin += '       </tr>';
        _htmlTextoNovoLogin += '       <tr height="50" valign="center" align="center">';
        _htmlTextoNovoLogin += '          <font color="#838F8F" size="2" face="Arial">Seguem abaixo os dados de acesso para você acompanhar o desempenho da(s) campanha(s) contratada(s) através do dashboard do MaaS.</font>';
        _htmlTextoNovoLogin += '       </tr>';
        _htmlTextoNovoLogin += '       <tr height="30" />';
        _htmlTextoNovoLogin += '      </tr>';   

        return _htmlTextoNovoLogin;
    };

    htmlComentario = function(paramComentario) {
        var _htmlComentario = "";

        _htmlComentario += '      <tr>';
        _htmlComentario += '        <table style="display:inline-table" align="left" border="0" cellpadding="0" cellspacing="0" width="600">';
        _htmlComentario += '          <tbody>';
        _htmlComentario += '            <tr>';
        _htmlComentario += '              <td width="20">';
        _htmlComentario += '              </td>';
        _htmlComentario += '                  ';
        _htmlComentario += '              <td width="1" bgcolor="#ececec">';
        _htmlComentario += '              </td>';
        _htmlComentario += '                  ';
        _htmlComentario += '              <td>';
        _htmlComentario += '                 <table style="display:inline-table" align="left" border="0" cellpadding="0" cellspacing="0" width="560">';
        _htmlComentario += '                   <tbody>';
        _htmlComentario += '                     <tr>   ';            
        _htmlComentario += '                       <td height="1" bgcolor="#ececec"> ';
        _htmlComentario += '                       </td>              ';
        _htmlComentario += '                     </tr>';
        _htmlComentario += '                     <tr>   ';            
        _htmlComentario += '                       <td align="left" height="18" valign="bottom"> ';
        _htmlComentario += '                         <font color="#999" size="1" face="Arial">&nbsp;&nbsp; COMENTÁRIOS </font>';
        _htmlComentario += '                       </td>              ';
        _htmlComentario += '                     </tr>              ';
        _htmlComentario += '                     <tr>               ';
        _htmlComentario += '                       <td height="10">';
        _htmlComentario += '                         <img name="14de822b7d46e05f_divider" src="https://ci4.googleusercontent.com/proxy/oS_cAW5vvVMEgXPp7dUFS9YKDZwexBfUd1Mx3-PYPwJypj1onWBX_2JrgpVgZzYiWvpDa52L5txx1nwkVmcVZwTMD4vZcYTFpdYkkKbgwYTr1mc9aAhsunD4=s0-d-e1-ft#https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/divider.jpg" width="560" height="3" border="0" alt="Visitas" class="CToWUd">';
        _htmlComentario += '                       </td>              ';
        _htmlComentario += '                     </tr>';
        _htmlComentario += '                     <tr>               ';
        _htmlComentario += '                       <td height="6">';
        _htmlComentario += '                       </td>            ';  
        _htmlComentario += '                     </tr>';
        _htmlComentario += '                     <tr>               ';
        _htmlComentario += '                       <td align="left">';
        _htmlComentario += '                         <table style="display:inline-table" align="left" border="0" cellpadding="0" cellspacing="0" width="560">              ';
        _htmlComentario += '                           <tbody>';
        _htmlComentario += '                             <tr>   ';            
        _htmlComentario += '                               <td width="10">';
        _htmlComentario += '                               </td>              ';
        _htmlComentario += '                               <td align="left">';
        _htmlComentario += '                                 <tr >';
        _htmlComentario += '                                   <td width="10"> ';
        _htmlComentario += '                                   </td>';
        _htmlComentario += '                                   <td width="500"> ';
        _htmlComentario += '                                     <font color="#838F8F" size="2" face="Arial">' + paramComentario.replace(/\n/g, '<br />') + '</font>';
        _htmlComentario += '                                   </td>';
        _htmlComentario += '                                   <td width="10"> ';
        _htmlComentario += '                                   </td>';
        _htmlComentario += '                                 </tr>';
        _htmlComentario += '                               </td>';
        _htmlComentario += '                               <td width="10"> ';
        _htmlComentario += '                               </td>';
        _htmlComentario += '                             </tr>    ';        
        _htmlComentario += '                           </tbody>';
        _htmlComentario += '                         </table>';
        _htmlComentario += '                       </td>       ';       
        _htmlComentario += '                     </tr>           ';   
        _htmlComentario += '                     <tr>              ';
        _htmlComentario += '                       <td height="10">';
        _htmlComentario += '                         </td>';
        _htmlComentario += '                     </tr>            ';
        _htmlComentario += '                     <tr>               ';
        _htmlComentario += '                       <td height="1" bgcolor="#ececec"> ';
        _htmlComentario += '                       </td>              ';
        _htmlComentario += '                     </tr>';
        _htmlComentario += '                   </tbody>';
        _htmlComentario += '                 </table>';
        _htmlComentario += '              </td>';
        _htmlComentario += '              <td width="1" bgcolor="#ececec">';
        _htmlComentario += '              </td>';
        _htmlComentario += '                  ';
        _htmlComentario += '              <td width="20">';
        _htmlComentario += '              </td>';
        _htmlComentario += '            </tr>';
        _htmlComentario += '          </tbody>';
        _htmlComentario += '        </table>';
        _htmlComentario += '      </tr>';   

        return _htmlComentario;
    };

    htmlTableLead = function(titulo, valor) {
        var _htmlTableLead = "";

        _htmlTableLead += ' <tr align="left">';
        _htmlTableLead += '     <td width="10" height="25" bgcolor="#E5E5E5"></td>';
        _htmlTableLead += '     <td width="90" height="25" bgcolor="#E5E5E5" color="#A6ADAD" align="right">';
        _htmlTableLead += '       <font color="#838F8F" size="2" face="Arial">';
        _htmlTableLead += '         <b>';
        _htmlTableLead +=             titulo;
        _htmlTableLead += '         </b>';
        _htmlTableLead += '       </font>';
        _htmlTableLead += '     </td>';
        _htmlTableLead += '     <td width="10"  height="25" bgcolor="#E5E5E5"></td>';
        _htmlTableLead += '     <td width="10"  height="25" ></td>';
        _htmlTableLead += '     <td width="440" height="25" word-wrap="break-word">';
        _htmlTableLead += '         <font color="#838F8F" size="2" face="Arial">';
        _htmlTableLead +=               valor;
        _htmlTableLead += '         </font>';
        _htmlTableLead += '     </td>';
        _htmlTableLead += ' </tr>';

        return _htmlTableLead;
    };

    htmlFinalTable = function() {
        var _htmlFinalTable = '';
        
        _htmlFinalTable += '                                    </tbody>';
        _htmlFinalTable += '                                </table>';
        _htmlFinalTable += '                            </td>';
        _htmlFinalTable += '                            <td width="20"></td>';
        _htmlFinalTable += '                        </tr>   ';
        _htmlFinalTable += '                    </tbody>';
        _htmlFinalTable += '                </table>';
        _htmlFinalTable += '           </td>';
        _htmlFinalTable += '      </tr>';

        return _htmlFinalTable;
    };

    htmlListaLead = function(lead) {
        var _htmlLead = "";

        var _empresa = lead.empresa;

        if (_empresa.length > 27) {
            _empresa = _empresa.substring(0, 23) + "...";
        }

        _htmlLead += '                                        <tr>';
        _htmlLead += '                                            <td height="1"></td>';
        _htmlLead += '                                            <td bgcolor="#ececec" height="1"></td>';
        _htmlLead += '                                            <td bgcolor="#ececec" height="1"></td>';
        _htmlLead += '                                            <td bgcolor="#ececec" height="1"></td>';
        _htmlLead += '                                            <td height="1"></td>';
        _htmlLead += '                                        </tr>';
        _htmlLead += '                                        <tr align="left">';
        _htmlLead += '                                            <td width="10"></td>';
        _htmlLead += '                                            <td width="230" height="25"><font color="#838F8F" size="2" face="Arial">' + _empresa + '</font></td>';
        _htmlLead += '                                            <td width="230" height="25"><font color="#838F8F" size="2" face="Arial">' + lead.email + '</font></td>';
        _htmlLead += '                                            <td width="80" height="25"><font color="#838F8F" size="2" face="Arial">' + formarData(lead.data) + '</font></td>';
        _htmlLead += '                                            <td width="10"></td>';
        _htmlLead += '                                        </tr>';

        return _htmlLead;
    };

    htmlFinal = function(maasOuSiteina) {
        var _htmlFim = "";

        _htmlFim += '      <tr>';
        _htmlFim += '       <td height="30"></td>';
        _htmlFim += '      </tr>';
        _htmlFim += '      <tr>';
        _htmlFim += '       <td><table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="600">';
        _htmlFim += '          <tbody><tr>';
        _htmlFim += '           <td width="200"></td>';
        _htmlFim += '           <td>';
        _htmlFim += '                <table style="display: inline-table;" align="left" border="0" cellpadding="0" cellspacing="0" width="200">';
        _htmlFim += '                    <tbody>';
        _htmlFim += '                        <tr>';
        _htmlFim += '                            <td>';

        if (maasOuSiteina == 'C')
            _htmlFim += '                                <a href="http://app.siteina.com.br/" target="_blank" title="Acesse seu dashboard">';
        else 
            _htmlFim += '                                <a href="http://app.marketingasaservice.com.br/" target="_blank" title="Acesse seu dashboard">';

        _htmlFim += '                                    <img name="botao-dashboard-a" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/button-a.gif" width="200" height="13" border="0" alt="Acesse seu dashboard" style="display: block;">';
        _htmlFim += '                                </a>';
        _htmlFim += '                            </td>';
        _htmlFim += '                        </tr>';
        _htmlFim += '                        <tr>';
        _htmlFim += '                            <td>';

        if (maasOuSiteina == 'C')
            _htmlFim += '                                <a href="http://app.siteina.com.br/" target="_blank" title="Acesse seu dashboard">';
        else 
            _htmlFim += '                                <a href="http://app.marketingasaservice.com.br/" target="_blank" title="Acesse seu dashboard">';

        _htmlFim += '                                    <img name="botao-dashboard-b" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/button-b.gif" width="200" height="13" border="0" alt="Acesse seu dashboard" style="display: block;">';
        _htmlFim += '                                </a>';
        _htmlFim += '                            </td>';
        _htmlFim += '                        </tr>';
        _htmlFim += '                        <tr>';
        _htmlFim += '                            <td>';

        if (maasOuSiteina == 'C')
            _htmlFim += '                                <a href="http://app.siteina.com.br/" target="_blank" title="Acesse seu dashboard">';
        else 
            _htmlFim += '                                <a href="http://app.marketingasaservice.com.br/" target="_blank" title="Acesse seu dashboard">';

        _htmlFim += '                                    <img name="botao-dashboard-c" src="https://s3-ap-southeast-2.amazonaws.com/siteina/maas/mail/button-c.gif" width="200" height="13" border="0" alt="Acesse seu dashboard" style="display: block;">';
        _htmlFim += '                                </a>';
        _htmlFim += '                            </td>';
        _htmlFim += '                        </tr>';
        _htmlFim += '                    </tbody>';
        _htmlFim += '                </table>';
        _htmlFim += '            </td>';
        _htmlFim += '            <td></td>';
        _htmlFim += '          </tr>';
        _htmlFim += '        </tbody></table></td>';
        _htmlFim += '      </tr>';
        _htmlFim += '      <tr>';
        _htmlFim += '       <td height="40"></td>';
        _htmlFim += '      </tr>';
        _htmlFim += '      <tr>';
        _htmlFim += '       <td height="15" bgcolor="#E1E1E1"></td>';
        _htmlFim += '      </tr>';
        _htmlFim += '      <tr>';

        if (maasOuSiteina == 'C'){
            _htmlFim += '       <td height="15" bgcolor="#E1E1E1" align="center">';
            _htmlFim += '         <a href="http://www.siteina.com.br" target="_blank" style="text-decoration: none;">';
            _htmlFim += '           <font face="Arial" size="1" color="#999999">';
            _htmlFim += '             <b>www.siteina.com.br</b>';
            _htmlFim += '           </font>';
            _htmlFim += '         </a>';
            _htmlFim += '       </td>';
        }
        else {
            _htmlFim += '       <td height="15" bgcolor="#E1E1E1" align="center">';
            _htmlFim += '         <a href="http://www.marketingasaservice.com.br" target="_blank" style="text-decoration: none;">';
            _htmlFim += '           <font face="Arial" size="1" color="#999999">';
            _htmlFim += '             <b>www.marketingasaservice.com.br</b>';
            _htmlFim += '           </font>';
            _htmlFim += '         </a>';
            _htmlFim += '       </td>';
        }

        _htmlFim += '      </tr>';
        _htmlFim += '      <tr>';
        _htmlFim += '       <td height="15" bgcolor="#E1E1E1"></td>';
        _htmlFim += '      </tr>';
        _htmlFim += '    </tbody></table></td>';
        _htmlFim += '  </tr>';
        _htmlFim += '</tbody></table>';
        _htmlFim += '</td></tr></tbody></table></body>';

        return _htmlFim;
    };

    formarData = function(data) {
        var _data = new Date(data);

        var _formatar = 
            lpad(_data.getDate(), 2) + "/" +
            lpad(new Number(_data.getMonth() + 1), 2) + "/" +
            _data.getFullYear();

        return _formatar;
    };

    lpad = function(value, length) {
        return Array(Math.max(length - String(value).length + 1, 0)).join(0) + value;
    };

	return controller;
}