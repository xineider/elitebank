// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

/* GET pagina de login. */

const mongoose = require('mongoose');

var licencaUser = require('../model/licencaModel.js');

var pagamentoModel = require('../model/pagamentoModel.js');

var produtoModel = require('../model/produtoModel.js');

var userModel = require('../model/usuariosModel.js');

const mensagemModel = require('../model/mensagemModel.js');

const entradasModel = require('../model/entradasModel.js');

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 7;

	licencaUser.find({},function(err,data_licenca){
		if(data_licenca != null){
			data.licenca = data_licenca;
		}else{
			data.licenca = {valor_credito:0,valor_licenca:0,status:1};
		}

		produtoModel.find({},function(err,data_produto){
			data.produto = data_produto;

			userModel.find({},function(err,data_usuarios){
				data.usuarios = data_usuarios;
				pagamentoModel.find({},function(err,data_pagamento){

					entradasModel.find({},function(err,data_entradas){
						data.entradas = data_entradas;

						if(data_pagamento != null){
							data.pagamento = data_pagamento;

							var novaData;
							var dia_array = [];
							var precos_aprovado = [];
							var precos_andamento = [];
							var produtos = [];

							for(i=0;i<data_pagamento.length;i++){
								novaData = new Date(data_pagamento[i].data_atualizacao);
								dia = novaData.getDate();
								mes = ("0" + (novaData.getMonth() + 1)).slice(-2)
								ano = novaData.getFullYear();
								dia_array.push(dia + '/' + mes + '/' +  ano);

								if(data_pagamento[i].status == 'aprovado' || data_pagamento[i].status == 'APROVADO'){
									precos_aprovado.push(data_pagamento[i].valor);
								}else if (data_pagamento[i].status == 'andamento' || data_pagamento.status == 'ANDAMENTO'){
									precos_andamento.push(data_pagamento[i].valor);
								}

								for(j=0; j<data_produto.length; j++){
									if(data_pagamento[i].codigo_produto == data_produto[j].codigo){
										produtos.push(data_produto[j].tipo);
									}
								}


							}

							console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
							console.log(precos_aprovado);
							console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');

							valor_total_aprovado = 0;
							valor_total_andamento = 0;

							if(precos_aprovado.length > 0){
								for(i=0;i<precos_aprovado.length;i++){
									valor_total_aprovado = valor_total_aprovado + precos_aprovado[i];
								}
							}

							if(data.pagamento.length > 0){
								for(i=0;i<data.pagamento.length;i++){
									if(data.pagamento[i].status == '')
										valor_total_andamento = valor_total_andamento + precos_andamento[i];
								}
							}


							valor_total_aprovado = Math.round(valor_total_aprovado * 100) / 100;
							valor_total_andamento = Math.round(valor_total_andamento * 100) / 100;

							data.valor_total_aprovado = valor_total_aprovado;
							data.valor_total_andamento = valor_total_andamento;
							data.dias = dia_array;
							data.produtos = produtos;


							var nomes_usuarios_licenca = [];
							var emails_usuarios_licenca = [];
							var dias_licenca_faltantes = [];
							var qtd_operacoes = [];
							var qtd_operacoes_vitoriosas = [];
							var qtd_operacoes_usuarios = [];
							var qtd_operacoes_vitorias_usuarios = [];
							var porcentagem_acertividade = [];

							hoje = new Date();

							for(i=0;i<data_usuarios.length;i++){
								for(j=0;j<data_licenca.length;j++){
									if(data_usuarios[i]._id.equals(data_licenca[j].id_usuario)){									
										nomes_usuarios_licenca.push(data_usuarios[i].nome);
										emails_usuarios_licenca.push(data_usuarios[i].email);
									}
								}
							}

							for(i=0;i<data_licenca.length;i++){
								data_fim = data_licenca[i].data_fim;
								console.log('data_fim: ' + data_fim);
								data_fim.setDate(data_fim.getDate() + 1);
								diferencaData = data_fim - hoje;
								console.log('diferencaData: ' + diferencaData);
								dias_faltantes = Math.floor(diferencaData / (1000 * 60 * 60 * 24)) + 1;
								console.log('dias_faltantes: ' + dias_faltantes);
								dias_licenca_faltantes.push(dias_faltantes);
							}



							for(i=0;i<data_usuarios.length;i++){
								for(j=0;j<data_entradas.length;j++){
									if(data_usuarios[i]._id.equals(data_entradas[j].id_usuario)){
										if(data_entradas[j].vitoria == true){
											qtd_operacoes_vitoriosas.push(data_entradas[j].vitoria);
										}
										qtd_operacoes.push(data_entradas[j].executada);
									}
								}

								qtd_operacoes_usuarios.push(qtd_operacoes.length);
								qtd_operacoes = [];
								qtd_operacoes_vitorias_usuarios.push(qtd_operacoes_vitoriosas.length);
								qtd_operacoes_vitoriosas = [];
							}

							for(i=0;i<qtd_operacoes_usuarios.length;i++){
								console.log('qtd_operacoes_vitorias_usuarios[i]:' + qtd_operacoes_vitorias_usuarios[i]);
								console.log('qtd_operacoes_usuarios[i]:' + qtd_operacoes_usuarios[i]);
								if(qtd_operacoes_usuarios[i] > 0){
									porcentagem = Math.round((qtd_operacoes_vitorias_usuarios[i] * 100) / qtd_operacoes_usuarios[i]);
									porcentagem_acertividade.push(porcentagem);
								}else{
									porcentagem_acertividade.push(100);
								}
							}


							data.nomes_usuarios_licenca = nomes_usuarios_licenca;
							data.emails_usuarios_licenca = emails_usuarios_licenca;
							data.dias_licenca_faltantes = dias_licenca_faltantes;
							data.qtd_operacoes_licenca = qtd_operacoes_usuarios;
							data.qtd_operacoes_vit_licenca = qtd_operacoes_vitorias_usuarios;
							data.acertividade_licenca = porcentagem_acertividade;


							console.log('========================== data =========================');
							console.log(data);
							console.log('=========================================================');

						}else{
							data.pagamento = {vazio:0};
						}
						res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/administracao', data: data, usuario: req.session.usuario});
					});
					//
				});
				//
			});
			//
		});
		//
	});
});



router.get('/get-mensagens-usuario/:id_usuario', function(req, res, next) {

	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	console.log('estou no getMensagensUsuario');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	mensagemModel.find({'id_usuario':mongoose.Types.ObjectId(id_usuario)},function(err,data_mensagem_a){


		arrayMensagemData = [];

		if(data_mensagem_a.length > 0){

			for(i=0;i<data_mensagem_a.length;i++){
				console.log('data_mensagem[i].data_registro: ' + data_mensagem_a[i].data_registro);
				console.log('data_mensagem[i].data_registro.getDate(): ' + data_mensagem_a[i].data_registro.getDate());
				console.log('data_mensagem[i].data_registro.getMonth(): ' + data_mensagem_a[i].data_registro.getMonth() + 1);
				console.log('data_mensagem[i].data_registro.getYear(): ' + data_mensagem_a[i].data_registro.getYear());



				dia_mensagem = data_mensagem_a[i].data_registro.getDate();

				if(dia_mensagem > 0 && dia_mensagem < 10){
					dia_mensagem = "0" + dia_mensagem;
				}

				mes_mensagem = data_mensagem_a[i].data_registro.getMonth() + 1;
				if(mes_mensagem > 0 && mes_mensagem < 10){
					mes_mensagem = "0" + mes_mensagem;
				}

				ano_mensagem = data_mensagem_a[i].data_registro.getFullYear();

				hora_mensagem = data_mensagem_a[i].data_registro.getHours();

				if(hora_mensagem >= 0 && hora_mensagem < 10){
					hora_mensagem = "0" + hora_mensagem;
				}

				minuto_mensagem = data_mensagem_a[i].data_registro.getMinutes();

				if(minuto_mensagem >= 0 && minuto_mensagem < 10){
					minuto_mensagem = "0" + minuto_mensagem;
				}

				segundo_mensagem = data_mensagem_a[i].data_registro.getSeconds();

				if(segundo_mensagem >= 0 && segundo_mensagem < 10){
					segundo_mensagem = "0" + segundo_mensagem;
				}


				data_concatenada = dia_mensagem + '/' + mes_mensagem + '/' + ano_mensagem + ' ' + hora_mensagem + ':' + minuto_mensagem + ':' + segundo_mensagem + ' - ';

				arrayMensagemData.push(data_concatenada);
			}

		}

		console.log('arrayMensagemData');
		console.log(arrayMensagemData);

		data.mensagem_horario = arrayMensagemData;


		console.log(data_mensagem_a);
		data.mensagem_a = data_mensagem_a;

		// console.log('ddddddddddddddddddddd data dddddddddddddddddddddd');
		// console.log(data);
		// console.log('ddddddddddddddddddddddddddddddddddddddddddddddddd');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/mensagem_usuarios', data: data, usuario: req.session.usuario});
	});
});


router.get('/alterar-senha-usuario/:id_usuario', function(req, res, next) {

	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	console.log('estou no alterar-senha');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	console.log(id_usuario);


	userModel.findOne({'_id':id_usuario},function(err,data_usuario){
		data.usuario_a = data_usuario;
		console.log('data_usuario');
		console.log(data_usuario);

		// console.log('ddddddddddddddddddddd data dddddddddddddddddddddd');
		// console.log(data);
		// console.log('ddddddddddddddddddddddddddddddddddddddddddddddddd');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/alterar_senha', data: data, usuario: req.session.usuario});
	});
});



router.post('/alterar-senha', function(req, res, next) {

	POST = req.body;

	console.log('RECUPERAR SENHA @@@@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


	console.log('usuario find model');
	nova_senha = Math.random().toString(36).substring(7);

	var novaSenhaCriptografa = control.Encrypt(nova_senha);

	console.log('nova_senha: '+nova_senha);
	console.log('novaSenhaCriptografa: ' +novaSenhaCriptografa);

	userModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){

		userModel.findOneAndUpdate({'_id':POST.id_usuario},{'$set':{'senha':novaSenhaCriptografa}},function(err){
			if (err) {
				return handleError(err);
			}else{

				var html = "<div style='background: linear-gradient(135deg, #59a7ab 0%,#965da4 98%);width:100%;'>\
				<div style='margin:0px auto; max-width:600px;padding: 40px 0px;'>\
				<div style='background:#ffffff;width:100%;height:140px; padding:20px; text-align:center;color:#ffffff;width:100%;'>\
				<img style='max-width:280px;' src='http://copyelitebank.com.br/public/images/logo_elite.png'>\
				</div>\
				<div style='background: #f3f2ee;color:#8a8d93;width:100%;padding:20px;'>"+
				"Olá, você está recebendo este e-mail pois a administração resetou a sua senha."+
				"<br>Sua nova senha no Elite Bank é: "+nova_senha+
				"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram."+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'</div>'+
				'<div style="width:100%;height:20px; padding:10px 20px;color:#8a8d93;width:100%;font-size:14px;background:#f3f2ee">\
				* Não responda esta mensagem, ela é enviada automaticamente.'+
				'</div>\
				</div>\
				</div>';
				var text = "Olá, você está recebendo este e-mail pois a administração resetou a sua senha."+
				"<br>Sua nova senha no Elite Bank é: "+nova_senha+
				"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram"+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'<br>* Não responda esta mensagem, ela é enviada automaticamente.';




				control.SendMail(data_usuario.email, 'Recuperação de Senha - Elite Bank',text,html);				
				res.json(data);
			}
		});

	});

});





module.exports = router;
