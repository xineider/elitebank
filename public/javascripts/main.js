// Eventos DOM
var parar_timer = false;
var intervalo = '';


$(document).ready(function () {

	console.log('estou aqui no ready do começo');
	FormatInputs();
	LogSistema('GET','/sistema');
	
	$(document).ajaxError(function () {
		AddErrorAjax();
	});
	$(document).ajaxSuccess(function () {
		$('.error_ajax').fadeOut();
	});

	$(document).ajaxComplete(function () {
		validarDataTable($('#tabela_administracao'));
		validarDataTable($('#tabela_licenca_creditos'));
	});


	$(document).on('click', '.modal-remover-mount', function (e) {
		e.preventDefault();
		var modal = $(this).data('modal');
		var texto = $(this).data('texto');
		var id = $(this).data('id');
		var to = $(this).data('to');
		var back = $(this).data('back');
		var mensagem_sucesso = $(this).data('mensagem-sucesso');
		console.log('mensagem_sucesso:' + mensagem_sucesso);

		$(modal).modal();
		$(modal).find('#texto').text(texto);
		$(modal).find('#id').val(id);
		$(modal).find('.delete_button').data('href', to).data('action', back).data('mensagem-sucesso',mensagem_sucesso);
	});

	$(document).on('click', '.modal-mount', function (e) {
		e.preventDefault();
		var modal = $(this).data('modal');
		var link = $(this).data('link');

		console.log('cliquei no modal-mount');
		console.log('modal');
		console.log(modal);
		console.log('link');
		console.log(link);


		MountModal(modal, link);
	});

	$(document).on('click', '.ajax-load', function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		console.log(link);
		GoTo(link, true);
	});


	$(document).on('click','.close-alerts-button',function(e){
		e.preventDefault();
		$('.alert').alert('close');
	});



	$(document).on('click', '.ajax-load-to', function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		var to = $(this).data('to');
		console.log(to);
		console.log(link);
		LoadTo(link, to);
		$('.ajax-load-to').removeClass('active');
		$('#grafico_botao_tudo').removeClass('active');
		$(this).addClass('active');
	});

	$(document).on('click', '.ajax-add-to', function(e) {
		e.preventDefault();
		var link = $(this).data('href');
		var to = $(this).data('to');
		AddTo(link, to);
	});

	$(document).on('click', '.remove', function (e) {
		e.preventDefault();
		$(this).closest('.pai').remove();
	});

	$(document).on('click', '.ajax-submit', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		if (VerificarForm(form) == true) {
			SubmitAjax(post, link, back);
		}
	});

	$(document).on('click', '.ajax-submit-scroll-top', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		if (VerificarForm(form) == true) {
			SubmitAjaxScrollTop(post, link, back);
		}
	});



	


	$(document).on('click', '.ajax-submit-timer', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		var conect_teste = $(this).data('conect_teste');
		if (VerificarForm(form) == true) {
			console.log('o que está indo de fato para o submit ajax de cor')
			SubmitAjaxTimer(post, link, back,conect_teste,15000);
		}
	});

	$(document).on('click', '.ajax-submit-load-to', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var to = $(this).data('to');
		var link = $(this).data('href');
		if (VerificarForm(form) == true) {
			SubmitAjaxLoadTo(post, link, to);
		}
		$('.ajax-load-to').removeClass('active');
		$('#grafico_botao_tudo').removeClass('active');
		$(this).addClass('active');
	});


	var menu_fechado = false;


	$('.sidebar-toggle').on('click', function () {
		$(this).toggleClass('active');

		$('#sidebar').toggleClass('shrinked');
		$('.page-content').toggleClass('active');
		$(document).trigger('sidebarChanged');

		if ($('.sidebar-toggle').hasClass('active')) {
			$('.navbar-brand .brand-sm').addClass('visible');
			$('.navbar-brand .brand-big').removeClass('visible');
			$(this).find('i').attr('class', 'fas fa-long-arrow-alt-right');
		} else {
			$('.navbar-brand .brand-sm').removeClass('visible');
			$('.navbar-brand .brand-big').addClass('visible');
			$(this).find('i').attr('class', 'fas fa-long-arrow-alt-left');
		}
	});


	$(document).on('click', '.ajax-submit-timer-5', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		var conect_teste = $(this).data('conect_teste');
		if (VerificarForm(form) == true) {
			console.log('o que está indo de fato para o submit ajax de cor')
			SubmitAjaxTimer(post, link, back,conect_teste,5000);
		}
	});

	$(document).on('click', '.ajax-submit-sucess-message', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		var sucesso = $(this).data('sucesso-id');
		if (VerificarForm(form) == true) {
			SubmitAjaxSucessMessage(post, link, back,sucesso);
		}
	});

	$(document).on('click','.alterar-conta-teste-conexao',function(e){
		$('#testar_conexao').prop('disabled',false);
		$('#testar_conexao').removeClass('disabled').addClass('btn-primary');
		$('#botao_iniciar_sistema').prop('disabled',true);
		$('#botao_iniciar_sistema').addClass('disabled').removeClass('btn-success');
		$('#caixa_alert_conectado').addClass('hide').removeClass('show');

		$('#form_operacional_entrada').prop('disabled',true);
		$('#form_operacional_limite_perda').prop('disabled',true);
		$('.form_operacional_tipo_conta').prop('disabled',true);
		$('#alterar_operacional_porcentagem').prop('disabled',true);

		$('#form_trader_qtd_usuarios').prop('disabled',true);
		$('#form_trader_liquidez').prop('disabled',true);
		
		$('.js-input-change-color').addClass('color-disabled');

		zerarIntervalo();

		
	});



	$(document).on('change paste keyup','.input-text-email-senha',function(e){
		$('#testar_conexao').prop('disabled',false);
		$('#testar_conexao').removeClass('disabled').addClass('btn-primary');
		$('#botao_iniciar_sistema').prop('disabled',true);
		$('#botao_iniciar_sistema').addClass('disabled').removeClass('btn-success');
		$('#caixa_alert_conectado').addClass('hide').removeClass('show');

		$('#form_operacional_entrada').prop('disabled',true);
		$('#form_operacional_limite_perda').prop('disabled',true);
		$('.form_operacional_tipo_conta').prop('disabled',true);
		$('#alterar_operacional_porcentagem').prop('disabled',true);

		$('#form_trader_qtd_usuarios').prop('disabled',true);
		$('#form_trader_liquidez').prop('disabled',true);
		
		$('.js-input-change-color').addClass('color-disabled');

		zerarIntervalo();


	});


	$(document).on('click', '.ajax-submit-close', function(e) {
		e.preventDefault();
		var data = {_id:''};
		console.log('data do ajax-submit-close');
		console.log(data);
		console.log('jjjjjjjjjjjjjjjjjjjjjjjjj');
		var link = $(this).data('href');
		var back = $(this).data('action');
		SubmitAjaxClean(data, link, back);
	});


	$(document).on('change', '.exibir_senha', function(e) {
		e.preventDefault();
		console.log('-------------- this ----------------');
		console.log($(this));
		var senha_input = $(this).parents('form').find('.contas-senha');
		console.log('senha_input');
		console.log(senha_input);

		console.log('senha_input.get(0).type');
		console.log(senha_input.get(0).type);

		if(senha_input.get(0).type == 'text'){
			senha_input.attr('type','password');
		}else{
			senha_input.attr('type','text');
		}



	});



	$(document).on('click', '.ajax-submit-open-modal', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var modal = $(this).data('modal');

		if (VerificarForm(form) == true) {
			console.log('ajax-submit-open-modal');
			SubmitAjaxOpenModal(post, link, modal);
		}
	});


	$(document).on('change','#par_trader_escolha',function(){

		console.log('estou alterando o par trader escolha');

		console.log('tipo_trader_escolha');
		console.log($('#tipo_trader_escolha').val());
		console.log($('#tipo_trader_escolha').val() == 'Forex');
		console.log()


		if($(this).val() != 0){

			if(($('#tempo_expiracao_trader_escolha').val() > 0 || $('#multiplicador_trader_forex').val() != '') && $('#tipo_trader_escolha').val() != null){
				$('.btn-trader-operation').removeClass('disabled');
				$('.btn-trader-operation').prop('disabled',false);

				$('#operacao_box_mensagem_escolha').removeClass('none');
				$('#operacao_par_escolha_label').text($("#par_trader_escolha option:selected").text());


				if($('#tipo_trader_escolha').val() == 'Binária'){
					$('#operacao_opcao_escolha_label').text('no tempo de expiração de');
					$('#operacao_tempo_expiracao_escolha_label').text('+' + $('#tempo_expiracao_trader_escolha').val());

					$('#operacao_call_escolha_label').text('CALL');
					$('#operacao_put_escolha_label').text('PUT');
				}else if($('#tipo_trader_escolha').val() == 'Digital'){
					$('#operacao_opcao_escolha_label').text('no tempo de expiração de');
					$('#operacao_tempo_expiracao_escolha_label').text($('#tempo_expiracao_trader_escolha').val() + 'M');

					$('#operacao_call_escolha_label').text('CALL');
					$('#operacao_put_escolha_label').text('PUT');
					

				}else if($('#tipo_trader_escolha').val() == 'Forex'){
					console.log('cai aqui no forex');

					$('#operacao_opcao_escolha_label').text(' com multiplicador de ');
					$('#operacao_tempo_expiracao_escolha_label').text($('#multiplicador_trader_forex').val());

					$('#operacao_call_escolha_label').text('BUY');
					$('#operacao_put_escolha_label').text('SELL');
				}

				$('#operacao_tipo_escolha_label').text($('#tipo_trader_escolha').val());
				


			}
		}
	});

	$(document).on('change','#tipo_trader_escolha',function(){
		if($(this).val() != 0){
			$('#tempo_expiracao_trader_escolha').prop('disabled',false);
			if($(this).val() == 'Binária'){
				LoadTo('/sistema/load-trader-opcoes-binarias', 'opcao_change_trader');
				LoadTo('/sistema/load-trader-pares-binario-digital','par_trader_escolha');

				$('.btn-call-text').text('CALL');
				$('.btn-put-text').text('PUT');
			}else if($(this).val() == 'Digital'){
				LoadTo('/sistema/load-trader-opcoes-digital', 'opcao_change_trader');
				LoadTo('/sistema/load-trader-pares-binario-digital','par_trader_escolha');
				$('.btn-call-text').text('CALL');
				$('.btn-put-text').text('PUT');
			}else if($(this).val() == 'Forex'){
				LoadTo('/sistema/load-trader-opcoes-forex', 'opcao_change_trader');
				LoadTo('/sistema/load-trader-pares-forex','par_trader_escolha');
				$('.btn-call-text').text('BUY');
				$('.btn-put-text').text('SELL');


			}

		}
	});


	$(document).on('input','#multiplicador_trader_forex',function(){
		console.log('estou alterando o valodr do multiplicador');
		console.log('val: ' + $(this).val());

		if($('#par_trader_escolha').val() != null && $('#tipo_trader_escolha').val() != null ){
			$('.btn-trader-operation').removeClass('disabled');
			$('.btn-trader-operation').prop('disabled',false);

			$('#operacao_box_mensagem_escolha').removeClass('none');
			//par
			$('#operacao_par_escolha_label').text($("#par_trader_escolha option:selected").text());
			//tipo multipiplicador ou tempo espiracão
			$('#operacao_opcao_escolha_label').text(' com multiplicador de ');
			//valor
			$('#operacao_tempo_expiracao_escolha_label').text($(this).val());

			//opção forex,binária ou digital
			$('#operacao_tipo_escolha_label').text($('#tipo_trader_escolha').val());

			$('#operacao_call_escolha_label').text('BUY');
			$('#operacao_put_escolha_label').text('SELL');



		}


	});

	$(document).on('change','#tempo_expiracao_trader_escolha',function(){
		if($(this).val() != 0){
			if($('#par_trader_escolha').val() != null && $('#tipo_trader_escolha').val() != null){
				$('.btn-trader-operation').removeClass('disabled');
				$('.btn-trader-operation').prop('disabled',false);

				$('#operacao_box_mensagem_escolha').removeClass('none');
				$('#operacao_par_escolha_label').text($("#par_trader_escolha option:selected").text());
				$('#operacao_opcao_escolha_label').text('no tempo de expiração de');

				if($('#tipo_trader_escolha').val() == 'Binária'){
					$('#operacao_tempo_expiracao_escolha_label').text('+' + $('#tempo_expiracao_trader_escolha').val());
				}else{
					$('#operacao_tempo_expiracao_escolha_label').text($('#tempo_expiracao_trader_escolha').val() + 'M');
				}
				$('#operacao_tipo_escolha_label').text($('#tipo_trader_escolha').val());
				$('#operacao_call_escolha_label').text('CALL');
				$('#operacao_put_escolha_label').text('PUT');

			}
		}
	});







	$(document).on('change', 'input[type="file"]', function () {
		if($(this).val() != '') {
			UploadFile($(this));
		}
	});

	$(document).on('change','#alterar_operacional_porcentagem',function(){
		if($('#alterar_operacional_porcentagem').is(':checked')){
			console.log('está checkado');
			$('.label_percentual_real').text('%');
			// $('#form_operacional_entrada').addClass('porcentagem');
			// $('#form_operacional_entrada').attr('name','entrada_perc');
		}else{
			console.log('não está checkado');
			$('.label_percentual_real').text('R$');
			// $('#form_operacional_entrada').removeClass('porcentagem');
			// $('#form_operacional_entrada').attr('name','entrada_num');
		}
	});


	$(document).on('click','#botao_parar_sistema',function(e){
		e.preventDefault();
		parar_timer = true;
	});


	$('.navbar-toggler').on('click', function (e) {
		e.preventDefault();
		console.log('estou clicando no navbar-toggler')

		$('#sidebar').addClass('active');

		$('.overlay_menu').addClass('active');

	});

	$('#dismiss_sidebar, .overlay_menu').on('click', function () {
		fecharMenu();
	});




	$(document).on('submit', 'form', function(e) {
		e.preventDefault();
	});

	$(document).on('change', '.cep', function () {
		GetEndereco($(this).val(), $(this).closest('.row'));
	});



	window.onpopstate = function() {
		GoTo(location.pathname, false);
	};


});


// Eventos Após DOM

$(window).on('load', function() {
	console.log('removi o loader');
	removerLoader();
	FormatInputs();
});



// Funções
function adicionarLoader() {
	// $('body').css('overflow', 'hidden');
	$('#padrao-loader').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoader()');
}

function adicionarLoaderConectando() {
	// $('body').css('overflow', 'hidden');
	$('#conectando-loader').removeClass('none').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoaderConectando()');
}

function adicionarLoaderTestando() {
	// $('body').css('overflow', 'hidden');
	$('#testando-loader').removeClass('none').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoaderTestando()');
}

function adicionarLoaderDesconectando(){
	$('#desconectando-loader').removeClass('none').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoaderDesconectando()');
}

function removerLoader() {
	console.log('estou sendo chamado, a função de removerLoader');

	$('body').css('overflow', 'auto');
	$('#conectando-loader').addClass('none');
	$('#testando-loader').addClass('none');
	$('.loader').fadeOut('fast');
}

function GoTo(link, state) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			console.log('setando');
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
			console.log('requestHeader');
			console.log(request);
			console.log('D:D:D:D:D:D:')
		},
		success: function(data) {
			zerarIntervalo();
			$('main').html(data);
			LogSistema('GET',link);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	console.log('estou no complete do GoTo');
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    	fecharMenu();
    }
});
	if (state == true) {
		window.history.pushState('Sistema Quorp', 'Sistema Quorp', link);
	}
}

function GoToNoLog(link, state) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			console.log('setando');
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
			console.log('requestHeader');
			console.log(request);
			console.log('D:D:D:D:D:D:')
		},
		success: function(data) {
			zerarIntervalo();
			$('main').html(data);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	console.log('estou no complete do GoTo');
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    	fecharMenu();
    }
});
	if (state == true) {
		window.history.pushState('Sistema Quorp', 'Sistema Quorp', link);
	}
}


function GoToSuccess(link, state,sucesso) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			console.log('setando');
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
			console.log('requestHeader');
			console.log(request);
			console.log('D:D:D:D:D:D:')
		},
		success: function(data) {
			$('main').html(data);
			$(sucesso).removeClass('none');
			LogSistema('GET',link);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	console.log('estou no complete do GoTo');
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    	fecharMenu();
    }
});
	if (state == true) {
		window.history.pushState('Sistema Quorp', 'Sistema Quorp', link);
	}
}




function LoadTo(link, to) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			$('.'+to).empty();
			$('.'+to).append(data);
			LogSistema('GET',link);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    }
});
}

function AddTo(link, to) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			$('.'+to).append(data);
		},
    error: function(xhr) { // if error occured
    	removerLoader();
    },
    complete: function() {
    	removerLoader();
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	// $('.modal').modal('close');
    	FormatInputs();
    }
});
}



function FormatInputs(focus) {
	$('.cnpj').mask('00.000.000/0000-00', {reverse: true});
	$('.cpf').mask('000.000.000-00', {reverse: true});
	$('.rg').mask('AAAAAAAAAAAAA', {reverse: true});
	$('.porcentagem').mask('##0,00%', {reverse: true});
	$('.cep').mask('00000-000');
	$('.tel').mask('(00) Z0000-0000', {
		translation: {
			'Z': {
				pattern: /[0-9]/, optional: true
			}
		}
	});
	$('.money').mask('000000000000000,00', {reverse: true});
	$('.data-sem-hora').mask('00/00/0000');
	$('.data-com-hora').mask('00/00/0000 00:00:00');
	$('.valicao_data').mask('99/99/9999 99:99:99');
	$('.hora').mask('00:00:00');
	validarDataTable($('.tabela_filtrada'));
	$('[data-toggle="tooltip"]').tooltip();
	$('.datepicker').datepicker({
		format:'dd/mm/yyyy',
		language:'pt-BR',
		autoclose:true
	});
}
function GetEndereco(cep, pai) {
	var link = 'https://viacep.com.br/ws/'+cep+'/json/ ';
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			adicionarLoader();
		},
		success: function(data) {
			console.log(data);
			if (data['erro'] == true) {
				alert('CEP não encontrado');
				$(pai).find('.uf').focus();
			} else {
				$(pai).find('.cidade').val(data['localidade']).focus();
				$(pai).find('.rua').val(data['logradouro']).focus();
				$(pai).find('.uf').val(data['uf']).focus();
				$(pai).find('.numero').focus();
			}
		},
    error: function(xhr) { // if error occured
    	alert("CEP não encontrado, utilize somente números");
    	$(pai).find('.uf').focus();
    },
    complete: function() {
    	removerLoader();
    }
});
}


function SubmitAjax(post, link, back) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				if(back != ''){
					GoTo(back, true);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}

function SubmitAjaxScrollTop(post, link, back) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				if(back != ''){
					GoTo(back, true);
					$("html, body").animate({ scrollTop: 0 }, "slow");
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}


function SubmitAjaxSucessMessage(post, link, back,sucesso) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				if(back != ''){
					GoToSuccess(back, true,sucesso);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}





function SubmitAjaxTimer(post, link, back,conect_teste,timer) {

	var invalido = false;

	console.log('conect_teste:' + conect_teste);

	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());

			if(conect_teste == 'teste'){
				adicionarLoaderTestando();
			}else if(conect_teste == 'conectar'){
				adicionarLoaderConectando();
			}else if(conect_teste == 'desconectar'){
				adicionarLoaderDesconectando();
			}else{
				adicionarLoader();
			}
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);
				invalido = true;	
			}else if(data != undefined){
				console.log('estou sendo chamado por que deu certo !!!!');
				console.log('back:'+ back);
				if(back != ''){
					console.log('estou no back do sucess222');

					if(conect_teste == 'conectar'){
						$('#header_status_text').text('Conectando');
						$('#header_status_icon').removeClass('fa-times red-text');
						$('#header_status_icon').addClass('fa-sync fa-spin yellow-text darken-1');
					}
					$("html, body").animate({ scrollTop: 0 }, "slow");

					setTimeout(function(){
						GoTo(back, true);
					},timer);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			console.log('estou no complete');
			if(invalido == false){
				$("html, body").animate({ scrollTop: 0 }, "slow");
				setTimeout(function(){
					removerLoader();
				},timer);
			}else{
				removerLoader();
			}

		}
	});
}


function SubmitAjaxLoadTo(post, link, to) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAXLOADTO ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				$('.'+to).empty();
				$('.'+to).append(data);
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}

function SubmitAjaxClean(post, link, back) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				if(back != ''){
					GoTo(back, true);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {

		}
	});
}


function SubmitAjaxOpenModal(post, link,modal) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				console.log('estou sendo chamado por que deu certo !!!!');
				$(modal).find('.modal-content').html(data);
				$(modal).modal('show');
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}



function Reestruturar(str) {
	var i = 1;
	$('.'+ str +' > div').each(function () {
		$(this).data('num', ''+i+'');
		i += 1;
	});
	return i;
}
function ActiveMaterializeInput(focus) {
	if (focus != undefined && focus != 'undefined') {
		console.log(focus);
		focus.first().focus();
		return true;
	}
	$('main textarea:not(disabled)').each(function () {
		if ($(this).val() != '') {
			$(this).focus();
		}
	});
	$('main input:not(disabled)').each(function () {
		if ($(this).val() != '') {
			$(this).focus();
			$('main input:not([disabled]):not([type="hidden"])').first().focus();
		}
	});
}
function MountModal(modal, link) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			// adicionarLoader();
			console.log('estou no mountModal');
			console.log('link');
			console.log(link);
		},
		success: function(data) {
			console.log(link);
			$(modal).find('.modal-content').html(data);
			$(modal).modal('show');
		},
    error: function(xhr) { // if error occured
    	// removerLoader();
    },
    complete: function() {
    	// removerLoader();
    	// FormatInputs();
    }
});
}

function VerificarForm(form) {
	$('.error').remove();
	var qtdErros = 0;
	
	form.find('input:enabled:not([type="hidden"])[required="true"]').each(function(){
		console.log('tem + de um input');
		if(VerificaItem($(this)) == true) {
			console.log('cai aqui no 1° erro')
			qtdErros++;
		};
	});

	if($('#alterar_senha').val() != $('#confirmar_alterar_senha').val())
	{
		console.log('cai no segundo erro');
		console.log('qtdErros:'+qtdErros);
		AddErrorTexto($('#confirmar_alterar_senha'),'Senhas são diferentes');
		qtdErros++;
	}

	form.find('input:enabled:not([type="hidden"])[required="true"][type="email"]').each(function(){
		if($(this).val()!= ''){
			if(!validateEmail($(this).val())){
				console.log('cai no terteiro erro');
				qtdErros++;
				AddErrorTexto($(this),'Email Incorreto!!');
			}
		}
	});
	
	form.find('textarea:enabled[required="true"]').each(function(){
		if(VerificaItem($(this)) == true) {
			console.log('cai no quarto erro');
			qtdErros++;
		};
	});
	
	form.find('select:enabled[required="true"]').each(function(){
		if(VerificaItem($(this)) == true) {
			console.log('cai no quinto erro');
			qtdErros++;
		};
	});
	
	if(qtdErros > 0){
		return false;
	}else if(qtdErros <= 0){
		return true;
	}
}


function VerificaItem(isso) {
	if (isso.val() == '') {
		AddError(isso);
		return true;
	}
}
function AddError(isso) {
	console.log(isso);
	isso.focus().addClass('observe-post').parent().append('<div class="error">Complete corretamente</div>');
}
function AddErrorAjax() {
	$('.error_ajax').fadeIn();
	location.reload();
}

function AddErrorTexto(isso,texto) {
	isso.focus().addClass('observe-post').parent().append('<div class="error text-center">'+texto+'</div>');
}

function UploadFile(isso) {
	var link = isso.data('href');
	var formData = new FormData();
	formData.append('arquivo', isso[0].files[0]);

	$.ajax({
		url: link,
		type: 'POST',
		data: formData,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function (data) {
			$('.file-path').val('');
			isso.closest('.row').append('\
				<div class="col s12 m6 center-align relative pai">\
				<div class="card-panel grey lighten-4">\
				<input type="hidden" name="tarefa_arquivo[arquivo][]" value="'+data+'">\
				<button class="btn-floating btn waves-effect waves-light red close-button remove"><i class="fa fa-times" aria-hidden="true"></i></button>\
				<b>Arquivo: '+data+' <br>\
				</div>\
				</div>\
				');
			console.debug(data);
		},
		error: function (xhr, e, t) {
			console.debug((xhr.responseText));
		},
		complete: function() {
			removerLoader();
		}
	});
}

function validarDataTable(elemento){
	if($(elemento).length>0){
		/*Já existe a tabela então não há necessidade de criá-la(senão dá problema)*/
		if($.fn.dataTable.isDataTable(elemento)){
		}else{
			filtrarTabelaDataTablePt(elemento);	
		}
	}
}

function validarDataTableNoSort(elemento){
	if($(elemento).length>0){
		/*Já existe a tabela então não há necessidade de criá-la(senão dá problema)*/
		if($.fn.dataTable.isDataTable(elemento)){
		}else{
			filtrarTabelaDataTablePtNoSort(elemento);	
		}
	}
}

function validateEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function LogSistema(metodo,rota){
	var ip;
	var arrayValores = [];

	$.getJSON("https://api.ipify.org/?format=json", function(e) {
		ip = e.ip;
		arrayValores = [ip,metodo,rota,navigator.userAgent,$('input[name="id_usuario_sessao"]').val()];

		// $.ajax({
		// 	url:'/sistema/log',
		// 	type:'POST',
		// 	data:JSON.stringify(arrayValores),
		// 	contentType: 'application/json', 
		// 	beforeSend: function(request) {
		// 	}
		// });
	});
}

function filtrarTabelaDataTablePt(tabela){
	$(tabela).DataTable({			
		"paging":   false,
		"order": [],
		language:{
			"decimal":        ",",
			"emptyTable":     "Nenhum registro encontrado",
			"info":           "Mostrando de _START_ até _END_ de _TOTAL_ registros",
			"infoEmpty":      "Mostrando de 0 até 0 de 0 registros",
			"infoFiltered":   "(Filtrados de _MAX_ registros)",
			"infoPostFix":    "",
			"thousands":      ".",
			"lengthMenu":     "_MENU_ resultados por página",
			"loadingRecords": "Carregando...",
			"processing":     "Processando...",
			"search":         "Pesquisar: <i class='fa fa-search text-primary'></i> ",
			"searchPlaceholder":"Pesquisar",
			"zeroRecords":    "Nenhum registro encontrado",
			"paginate": {
				"first":      "Primeiro",
				"last":       "Último",
				"next":       "Próximo",
				"previous":   "Anterior"
			},
			"aria": {
				"sortAscending":  ": Ordenar colunas de forma ascendente",
				"sortDescending": ": Ordenar colunas de forma descendente"
			}
		}	
	});
}

function filtrarTabelaDataTablePtNoSort(tabela){
	$(tabela).DataTable({			
		"paging":   false,
		"aaSorting": [],
		"order": [],
		language:{
			"decimal":        ",",
			"emptyTable":     "Nenhum registro encontrado",
			"info":           "Mostrando de _START_ até _END_ de _TOTAL_ registros",
			"infoEmpty":      "Mostrando de 0 até 0 de 0 registros",
			"infoFiltered":   "(Filtrados de _MAX_ registros)",
			"infoPostFix":    "",
			"thousands":      ".",
			"lengthMenu":     "_MENU_ resultados por página",
			"loadingRecords": "Carregando...",
			"processing":     "Processando...",
			"search":         "Pesquisar: <i class='fa fa-search text-primary'></i> ",
			"searchPlaceholder":"Pesquisar",
			"zeroRecords":    "Nenhum registro encontrado",
			"paginate": {
				"first":      "Primeiro",
				"last":       "Último",
				"next":       "Próximo",
				"previous":   "Anterior"
			},
			"aria": {
				"sortAscending":  ": Ordenar colunas de forma ascendente",
				"sortDescending": ": Ordenar colunas de forma descendente"
			}
		}
	});

}





function timer60sec(){
	var timing = 59;
	timing_n = parseInt(timing);
	$('.timer_header').text(timing);

	intervalo = setInterval(function(){
		if(parar_timer == false){
			timing_n = timing_n - 1;

			if(timing_n > 0){
				$('.timer_header').text(timing_n);
			}

			if(timing_n == 0){
				clearInterval(intervalo);
				GoToNoLog('/sistema', true);
			}

		}

	},1000);
}

function timer120sec(link){
	var timing = 120;
	timing_n = parseInt(timing);

	intervalo = setInterval(function(){
		if(parar_timer == false){
			timing_n = timing_n - 1;

			if(timing_n > 0){
				$('.timer_header').text(timing_n);
			}

			if(timing_n == 0){
				clearInterval(intervalo);
				GoToNoLog(link, true);
			}

		}

	},1000);
}


function setarPararTimer(){
	parar_timer = false;
}

function zerarIntervalo(){
	clearInterval(intervalo);
}


function fecharMenu(){
	$('#sidebar').removeClass('active');
	$('.overlay_menu').removeClass('active');
}