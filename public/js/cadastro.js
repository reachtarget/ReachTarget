$(function(){

     $('#next-form').click(function(e) {
        e.preventDefault();
        if(validadeFields()){
            
        if(ValidateEmail($("[name='your-email']").val())){
        
        $('#loader').removeClass('hide');        
                
            var name = $("[name='your-name']").val();
            var email = $("[name='your-email']").val(); 
            var password = $("[name='your-password']").val();  
            var ddd = $("[name='your-ddd']").val();  
            var phone = $("[name='your-phone']").val(); 
            var source = $('#input_7').val();
            var medium = $('#input_8').val();
            var term = $('#input_9').val();
            var content = $('#input_10').val();
            var campaign = $('#input_11').val();
            var segment = $('#input_12').val();
            var url = window.location.href;

                $.ajax({
                    type: "POST",
                    url: window.location.origin + "/process.php",
                    data : {
                        'your-name' : name,
                        'your-email' : email,
                        'your-password': password,
                        'your-ddd' : ddd,
                        'your-phone' : phone,
                        'source': source,
                        'medium': medium,
                        'term': term,
                        'content': content,
                        'campaign': campaign,
                        'segment': segment
                    }, crossDomain: true,
                    statusCode: {
                        302: function(e) {
                            console.log(e);
                        },  

                        200: function(){

                            var url = window.location.href,
                                append = "/obrigado";
                            //Cadastro efetuado com sucesso!
                            // $('.cadastro .feedback').append('<div class="success"><h3>Cadastro concluído!</h3>Verifique seu e-mail e siga as instruções para começar a usar o Astrea agora mesmo!</div>');
                            $('#loader').addClass('hide');
                            window.location = url + append;

                            console.log(url);
			
			   _gaq.push(['_trackEvent','Astrea', 'Cadastro concluído']);

                            $.ajax({
                                type: "POST",
                                url: window.location.origin + "/wp-content/themes/astrea/store-address.php", // proper url to your "store-address.php" file
                                data : {
                                  'your-name' : name,
                                  'your-email' : email,
                                  'your-password': password,
                                  'your-ddd' : ddd,
                                  'your-phone' : phone,
                                  'source': source,
                                  'medium': medium,
                                  'term': term,
                                  'content': content,
                                  'campaign': campaign,
                                  'segment': segment
                                }
                            });   

                        },
                        300: function(){

                            console.log('300');
                            //Email e escritório já existentes.
                            $('.cadastro .feedback').append('<div class="item erro"><p>Email e escritório já existentes.</p></div>');
                            $('#loader').addClass('hide'); 

			_gaq.push(['_trackEvent','Astrea', 'Email e empresa já existentes']);
                        },
                        400: function(){
                            console.log('400');
                            //Escritório já existente.
                            $('.cadastro .feedback').append('<div class="item erro"><p>Escritório já existente.</p></div>');
                            $('#loader').addClass('hide'); 

			_gaq.push(['_trackEvent', 'Astrea', 'Empresa já existente']);

                        },
                        500: function(){
                            console.log('500');
                            //Email já existente.
                            $('.cadastro .feedback').append('<div class="item erro"><p>Email já existente.</p></div>');
                            $('#loader').addClass('hide');  

			_gaq.push(['_trackEvent', 'Astrea', 'Email já existente']);

                        },
                        503: function(){
                            console.log('503');
                            //Erro de conexão.
                            $('.cadastro .feedback').append('<div class="item erro"><p>Serviço indisponível, tente mais tarde.</p></div>');
                            $('#loader').addClass('hide');  

			_gaq.push(['_trackEvent', 'Astrea', 'Nome de empresa inválido']);
                        }
                    }
                })

                } else {
                 //Email inválido
                    $('.cadastro .feedback').append('<div class="item erro"><p>Email inválido.</p></div>');
                    $("[name='your-email']").parent().addClass("error"); 

		   _gaq.push(['_trackEvent', 'Astrea', 'Email inválido']);	
                }
        }
        else{
            //Prencha os campos obrigatorios
            $('.cadastro .feedback').delay(800).append('<div class="item erro"><p>Por favor, preencha todos os campos.</p></div>');
		
	    _gaq.push(['_trackEvent', 'Astrea', 'Campos obrigatórios não preenchidos']);

        }


    });

});

function ValidadeTenant(tenant){
    if(/^([-0-9a-zA-Z_]+)$/.test(tenant)){
        return true;
    }
    return false;
}

function validadeFields(){

	var status = true;

	$('.cadastro .feedback').empty();
	$(".cadastro .field").removeClass("error");

    var name = $("[name='your-name']").val();

    if(name==''){
        status = false;
        $("[name='your-name']").parent().addClass("error");
    }

    var email = $("[name='your-email']").val();

    if(email==''){
        status = false;
        $("[name='your-email']").parent().addClass("error"); 
    }   

    var password = $("[name='your-password']").val();

    if(password==''){
        status = false;
        $("[name='your-password']").parent().addClass("error");
    }

    return status;
}

function ValidateEmail(mail) {  
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
    {  
        return (true)  
    }  
        return (false)  
}
