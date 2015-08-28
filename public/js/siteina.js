var _u = "http://app.siteina.com.br",
    _g = "GET",
    _ct = "application/json; charset=utf-8",
    _dt = "jsonp";
    
ld = function(e, t) {
    $.ajax({
        url: _u + "/formulario",
        type: _g,
        dataType: _dt,
        data: {
            objectIdLogin: e,
            nome: t.n,
            empresa: t.e,
            email: t.em,
            cargo: t.c,
            telefone: t.t,
            interesse: t.nt,
            source: t.s,
            medium: t.m
        },
        contentType: _ct
    })
};
