var _u = "http://app.marketingasaservice.com.br",
    _g = "GET",
    _ct = "application/json; charset=utf-8",
    _dt = "jsonp";

maasm = function(e, t) {
    $.ajax({
        url: _u + "/lead/email",
        type: _g,
        dataType: _dt,
        data: {
            id: e,
            nome: t.n,
            empresa: t.e,
            email: t.em,
            telefone: t.t,
            cargo: t.c,
            interesse: t.nt
        },
        contentType: _ct
    })
}, 

maasl = function(e, t) {
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
            pagina: t.i,
            source: t.s,
            medium: t.m,
            term: t.tm,
            content: t.co,
            campaign: t.ca,
            mql_sql: t.mqlsql,
            lat: t.la,
            lng: t.ln
        },
        contentType: _ct
    })
},

removerAcentos = function(t) {
    var _t = "";
    var _ca = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
    var _sa = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";

    for (var i = 0; i < t.length; i++) {
        if (_ca.indexOf(t.charAt(i)) != -1) 
            _t += _sa.substr(_ca.search(t.substr(i, 1)), 1);
        else
            _t += t.substr(i, 1);
    }

    return _t;
},

removerEspacos = function(t) {
    var _t = t.trim();

    while (_t.indexOf(" ") != -1) {
        _t = _t.replace(" ", "-");
    }

    return _t;
},

textoMinusculo = function(t) {
    return t.toLowerCase();
},

_uGC = function (l,n,s) {
    if (!l || l=="" || !n || n=="" || !s || s=="") 
        return "-";

    var i,i2,i3,c="-";
    i=l.indexOf(n);
    i3=n.indexOf("=")+1;
    
    if (i > -1) {
        i2=l.indexOf(s,i); if (i2 < 0) { i2=l.length; }
        c=l.substring((i+i3),i2);
    }

    return c;
},

trckng = function() { 
    var z = _uGC(document.cookie, '__utmz=', ';'); 
    var source  = _uGC(z, 'utmcsr=', '|'); 
    var medium  = _uGC(z, 'utmcmd=', '|'); 
    var term    = _uGC(z, 'utmctr=', '|'); 
    var content = _uGC(z, 'utmcct=', '|'); 
    var campaign = _uGC(z, 'utmccn=', '|'); 
    var gclid   = _uGC(z, 'utmgclid=', '|'); 

    if (gclid !="-") { 
          source = 'google'; 
          medium = 'cpc'; 
    } 

    var csegment = _uGC(document.cookie, '__utmv=', ';'); 

    if (csegment != '-') { 
          var csegmentex = /[1-9]*?\.(.*)/;
          csegment    = csegment.match(csegmentex); 
          csegment    = csegment[1]; 
    } else { 
          csegment = '(not set)'; 
    }

    var a = _uGC(document.cookie, '__utma=', ';');
    var aParts = a.split(".");
    var nVisits = aParts[5];

    return {
        s: source,
        m: medium,
        t: term,
        co: content,
        ca: campaign
    }ei
},

ll = function(){
    $.ajax({
        url: '//freegeoip.net/json/',
        type: 'POST',
        dataType: 'jsonp',
        success: function(location) {
            return {
                la: location.latitude,
                ln: location.longitude
            }
        }
    });
};