$(document).ready(function () {
	console.log('estou no ready do login');

	$(document).on('submit', '#recupera-senha', function(e) {
		e.preventDefault();
		var form = $(this);
		var post = form.serializeArray();

		$.ajax({
			method: 'POST',
			async: true,
			data: post,
			url: '/recuperar/senha',
			beforeSend: function(request){
				adicionarLoader();
			},
			success: function(data) {
				console.log('****************** data ***********************');
				console.log(data);
				console.log('***********************************************');

				if(data == "email_nao_cadastrado"){
					console.log('cai aqui no email não cadastrado :D');
					$('.error_container_resend').removeClass('hide');
					$('.error_container_resend').find('.error_resend_mensagem').html('Não existe ninguém cadastrado com este e-mail!');
				}else{
					console.log("estou dentro sucesso !!!!!!");
					$('#modal_forgot_password').modal('hide');
					$('.message').html('<div class="text-center alert alert-success">Senha Alterada com Sucesso, Verifique o seu e-mail!</div>')
				}
				removerLoader();
			},
			error: function(xhr) { 
				alert("Error, contate o administrador ou reinicie a pagina.");
				removerLoader();
			}
		});
	});


	var materialInputs = $('input.input-material');

	console.log('materialInputs.val()');
	console.log(materialInputs.val());

	if(materialInputs.val() != ''){
		materialInputs.siblings('.label-material').addClass('active')
	}

    // activate labels for prefilled values
    materialInputs.filter(function() { return $(this).val() !== ""; }).siblings('.label-material').addClass('active');

    // move label on focus
    materialInputs.on('focus', function () {
    	$(this).siblings('.label-material').addClass('active');
    });

    // remove/keep label on blur
    materialInputs.on('blur', function () {
    	$(this).siblings('.label-material').removeClass('active');

    	if ($(this).val() !== '') {
    		$(this).siblings('.label-material').addClass('active');
    	} else {
    		$(this).siblings('.label-material').removeClass('active');
    	}
    });

});


function adicionarLoader() {
	// $('body').css('overflow', 'hidden');
	$('#padrao-loader').removeClass('none');
	$('#padrao-loader').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoader()');
}


function removerLoader() {
	console.log('estou sendo chamado, a função de removerLoader');

	$('body').css('overflow', 'auto');
	$('.loader').addClass('none');
	$('.loader').fadeOut('fast');
}