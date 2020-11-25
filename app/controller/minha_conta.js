// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
// var MeusDadosModel = require('../model/minhaContaModel.js');
// var model = new MeusDadosModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));



const mongoose = require('mongoose');

const usuarioModel = require('../model/usuariosModel.js');

var licencaUser = require('../model/licencaModel.js');

var pagamentoModel = require('../model/pagamentoModel.js');

var produtoModel = require('../model/produtoModel.js');

var configuracoes_sistema = require('../model/configuracoes_sistemaModel.js');

const mensagemUser = require('../model/mensagemModel.js');

router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data.numero_menu = 2;
	
	configuracoes_sistema.find({},function(err,data_configuracoes){

		if(data_configuracoes != null){
			data.config_sistema = data_configuracoes;
		}else{
			data.config_sistema = {possui_creditos:true};
		}
		licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){

			mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),"tipo_mensagem":3},function(err,data_mensagem){
				data.mensagem = data_mensagem;

				console.log('------------------------------- data mensagem ----------------------');
				console.log(data_mensagem);
				console.log('--------------------------------------------------------------------');

				arrayMensagemData = [];

				if(data_mensagem.length > 0){

					for(i=0;i<data_mensagem.length;i++){
						var horario = new Date(data_mensagem[i].data_registro);
						horario.setHours(horario.getHours() - 3);
						dia_mensagem = horario.getDate();

						if(dia_mensagem > 0 && dia_mensagem < 10){
							dia_mensagem = "0" + dia_mensagem;
						}

						mes_mensagem = horario.getMonth() + 1;
						if(mes_mensagem > 0 && mes_mensagem < 10){
							mes_mensagem = "0" + mes_mensagem;
						}

						ano_mensagem = horario.getFullYear();

						hora_mensagem = horario.getHours();

						if(hora_mensagem >= 0 && hora_mensagem < 10){
							hora_mensagem = "0" + hora_mensagem;
						}

						minuto_mensagem = horario.getMinutes();

						if(minuto_mensagem >= 0 && minuto_mensagem < 10){
							minuto_mensagem = "0" + minuto_mensagem;
						}

						segundo_mensagem = horario.getSeconds();

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



				if(data_licenca != null){
					data.licenca_user = data_licenca;
					/*Calcular quantos dias faltam para a licença expirar*/
					hoje = new Date();
					data_fim = data_licenca.data_fim;
					data_fim.setDate(data_fim.getDate() + 1);
					diferencaData = data_fim - hoje;
					dias_faltantes = Math.floor(diferencaData / (1000 * 60 * 60 * 24)) + 1;
					data.licenca_user_dias = dias_faltantes;
				}else{
					data.licenca_user = {creditos:0,licenca_user_dias:0,status:1};
					data.licenca_user_dias = 0;
				}

				res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'minha_conta/minha_conta', data: data, usuario: req.session.usuario});
			}).sort({'data_registro':-1}).limit(30);
		});
	});
});


router.post('/alterar-senha', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR alterar-senha JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	if(POST.senha_atual != ''){
		if(POST.nova_senha != ''){
			if(POST.repetir_nova_senha != ''){



				var verificarSenhaAtual =  control.Encrypt(POST.senha_atual);

				console.log('------------------------- verificarSenhaAtual ---------');
				console.log(verificarSenhaAtual);
				console.log('--------------------------------------------------------');

				usuarioModel.findOne({'_id':mongoose.Types.ObjectId(req.session.usuario.id),'senha':verificarSenhaAtual},function(err,data_usuario){
					
					if(data_usuario != null){

						if(POST.nova_senha == POST.repetir_nova_senha){

							if(POST.nova_senha.length >= 8){

								var novaSenhaCriptografa = control.Encrypt(POST.nova_senha);

								usuarioModel.findOneAndUpdate({'_id':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'senha':novaSenhaCriptografa}},function(err){
									if (err) {
										return handleError(err);
									}else{
										res.json(data);
									}
								});
							}else{
								res.json({error:'nova_senha',element:'#error_alterar_senha',texto:'*A nova senha deve ter mais que 8 caracteres!'});
							}

						}else{
							res.json({error:'repetir_nova_senha',element:'#error_alterar_senha',texto:'*Por-favor repetir corretamente a nova senha!'});
						}
					}else{
						res.json({error:'senha_atual_errada',element:'#error_alterar_senha',texto:'*Senha atual não confere!'});
					}

				});
			}else{
				res.json({error:'repetir_senha_vazia',element:'#error_alterar_senha',texto:'*Por-favor repetir a nova senha!'});
			}	
		}else{
			res.json({error:'nova_senha_vazia',element:'#error_alterar_senha',texto:'*Nova senha não pode ser vazia!'});
		}

	}else{
		res.json({error:'senha_atual_vazia',element:'#error_alterar_senha',texto:'*Senha atual não pode ser vazia!'});
	}


});



router.post('/ativar-codigo-transacao', function(req, res, next) {
	POST = req.body;

	console.log('LLLLLLLLLLLLLLLLLL ATIVAR CODIGO LICENCA e RECARGA LLLLLLLLLLLLLLLLLLLLLL');
	console.log(POST);
	console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');

	//vejo se não é vazio
	if(POST.codigo_transacao !=''){
		pagamentoModel.findOne({'codigo':POST.codigo_transacao},function(err,data_pagamento){

			//vejo se existe
			if(data_pagamento != null){
				console.log('ppppppppppppppppppp data_pagamento ppppppppppppppppppppppppp');
				console.log(data_pagamento);
				console.log('pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp');

				console.log(data_pagamento.processado);
				console.log(data_pagamento.cancelado);

				//vejo se não foi cancelado ou já foi utilizado
				if(data_pagamento.cancelado == false){
					if(data_pagamento.processado == false){

						produtoModel.findOne({'codigo':data_pagamento.codigo_produto},function(err,data_produto){

							//vejo se o produto existe com o código do produto
							if(data_produto != null){
								console.log('oooooooooooooooooooooooo data_produto oooooooooooooooooooooo');
								console.log(data_produto);
								console.log('oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');

								// identifico se é credito ou licença
								if(data_produto.tipo == 'creditos'){

									licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){
										//verifico se o usuário possuí a licença

										if(data_licenca != null){
											//se ele tiver a licença eu adiciono a quantidade de créditos com o que ele já possui
											nova_quantidade_creditos = data_licenca.creditos + data_produto.quantidade;

											console.log('nova_quantidade_creditos:' + nova_quantidade_creditos);

											//dou update com os novos créditos
											licencaUser.findOneAndUpdate({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'creditos':nova_quantidade_creditos}},function(err,data_new_licenca){
												if (err) {
													return handleError(err);
												}else{
													//atualizo o procesado em true para indicar que não pode ser reutilizado o código
													pagamentoModel.findOneAndUpdate({'codigo':POST.codigo_transacao},{'$set':{'processado':true}},function(err,data_new_pagamento){
														if (err) {
															return handleError(err);
														}else{
															res.json(data);
														}
													});
												}
											});

										}else{

											//se o usuário não possui licença eu adiciono a licença com os créditos comprados, e com 
											//a data para ontem, indicando que ele possui a licença expirada, mas possuindo créditos
											var ontem = new Date();
											ontem.setDate(ontem.getDate() - 1);

											const nova_licenca = new licencaUser({ 
												id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
												creditos:data_produto.quantidade,
												data_fim: ontem,
												deletado:0,
												ativa:true
											});

											console.log('tttttttttttttttt teste_conexao ttttttttttttttttt');
											console.log(nova_licenca);
											console.log('tttttttttttttttttttttttttttttttttttttttttttttttt');

											nova_licenca.save(function (err) {
												if (err) {
													return handleError(err);
												}else{
													//atualizo o procesado em true para indicar que não pode ser reutilizado o código
													pagamentoModel.findOneAndUpdate({'codigo':POST.codigo_transacao},{'$set':{'processado':true}},function(err,data_new_pagamento){
														if (err) {
															return handleError(err);
														}else{
															res.json(data);
														}
													});
												}
											});
										}
									});

									//se for licença	
								}else if(data_produto.tipo == 'licenca'){
									licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){
										//verifico se existe a licença
										if(data_licenca != null){
											console.log(data_licenca);
											//se existir a licença adiciono a quantidade dias na licença
											var nova_data = data_licenca.data_fim;
											console.log('nova_data:' + nova_data);
											var hoje = new Date();

											console.log('hoje:' + hoje);
											if(nova_data < hoje){
												console.log('é bem menor do que hoje');
												hoje.setDate(hoje.getDate() - 1);
												nova_data.setTime(hoje);
											}
											console.log('nova_data.getDate(): ' + nova_data.getDate());
											console.log('data_produto.quantidade:' + data_produto.quantidade);
											nova_data.setDate(nova_data.getDate() + data_produto.quantidade);
											console.log('nova_data:' + nova_data);

											//dou update com os novos créditos
											licencaUser.findOneAndUpdate({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'data_fim':nova_data}},function(err,data_new_licenca){
												if (err) {
													return handleError(err);
												}else{
													//atualizo o procesado em true para indicar que não pode ser reutilizado o código
													pagamentoModel.findOneAndUpdate({'codigo':POST.codigo_transacao},{'$set':{'processado':true}},function(err,data_new_pagamento){
														if (err) {
															return handleError(err);
														}else{
															res.json(data);
														}
													});
												}
											});

										}else{

											var nova_data_fim = new Date();
											nova_data_fim.setDate((nova_data_fim.getDate() - 1 ) + data_produto.quantidade);


											const nova_licenca = new licencaUser({ 
												id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
												creditos:0,
												data_fim: nova_data_fim,
												deletado:0,
												ativa:true
											});

											console.log('xxxxxxxxxxxxx nova licenca xxxxxxxxxxxxx');
											console.log(nova_licenca);
											console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

											nova_licenca.save(function (err) {
												if (err) {
													return handleError(err);
												}else{
													//atualizo o procesado em true para indicar que não pode ser reutilizado o código
													pagamentoModel.findOneAndUpdate({'codigo':POST.codigo_transacao},{'$set':{'processado':true}},function(err,data_new_pagamento){
														if (err) {
															return handleError(err);
														}else{
															res.json(data);
														}
													});
												}
											});


										}
									});

								}else{
									res.json({error:'tipo_inexistente',element:'input[name="codigo_transacao"]',texto:'*Erro, entre em contato com o suporte!'});
								}
							}else{
								res.json({error:'produto_removido',element:'input[name="codigo_transacao"]',texto:'*Este produto foi removido!'});
							}
						});
						//se já foi utilizada
					}else{
						res.json({error:'codigo_transacao_utilizada',element:'input[name="codigo_transacao"]',texto:'*Este código já foi utilizado!'});
					}
				}else{
					res.json({error:'codigo_transacao_cancelada',element:'input[name="codigo_transacao"]',texto:'*Código da transação foi cancelada!'});
				}
			}else{
				res.json({error:'codigo_transacao_inexistente',element:'input[name="codigo_transacao"]',texto:'*Código não existente!'});
			}
		});
}else{
	res.json({error:'codigo_transacao_vazia',element:'input[name="codigo_transacao"]',texto:'*Código não pode ser vazio!'});
}

});





module.exports = router;
