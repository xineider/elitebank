// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

//var io = require("socket.io-client");

const mongoose = require('mongoose');

/*Liçenca do Usuário*/
var licencaUser = require('../model/licencaModel.js');



/*Usuário Conexão*/

const teste_conexaoUser = require('../model/conexaoTesteModel.js');

/*Conta do Usuário*/

const contaUser = require('../model/contaModel.js');

/*Mensagem*/

const mensagemUser = require('../model/mensagemModel.js');

/*entradas usuario*/

const entradasUser = require('../model/entradasModel.js');

/*LOG*/

const log = require('../model/logModel.js');

/*Limite Usuários*/
const sessaoStatusModel= require('../model/sessaoModel.js');

/*Trader Limite*/
const traderLimiteModel = require('../model/traderLimiteModel.js');

/*Configurações do Sistema*/
var configuracoes_sistema = require('../model/configuracoes_sistemaModel.js');

/*Sessão dos Usuário*/
var sessao_usuarioModel = require('../model/usuarioSessao.js');

/*Sessão dos Usuário*/
var usuariosModel = require('../model/usuariosModel.js');

/*Sessão dos Usuário*/
var sessaoTotalModel = require('../model/sessaoTotalModel.js');

/* GET pagina de login. */

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 1;


	if(req.session.usuario.nivel == 3){

		configuracoes_sistema.find({},function(err,data_configuracoes){

			if(data_configuracoes != null){
				data.config_sistema = data_configuracoes;
			}else{
				data.config_sistema = {possui_creditos:true};
			}

			licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){

				if(data_licenca != null){
					data.licenca_user = data_licenca;					
					hoje = new Date();
					data_fim = data_licenca.data_fim;
					data_fim.setDate(data_fim.getDate() + 1);
					diferencaData = data_fim - hoje;
					dias_faltantes = Math.floor(diferencaData / (1000 * 60 * 60 * 24)) + 1;
					data.licenca_user_dias = dias_faltantes;
					req.session.usuario.creditos = data_licenca.creditos;
					req.session.usuario.licenca_data = data_fim;
					req.session.usuario.licenca_dias = dias_faltantes;
				}else{
					data.licenca_user = {creditos:0,licenca_user_dias:-1,status:1};
					data.licenca_user_dias = -1;
				}

				contaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
					if(data_conta !=null){
						data.conta_user = data_conta;
					}else{
						data.conta_user = {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:50,acao:'parar',status:'desconectado',primeira_vez:true};
					}

					teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){



						if(data_conexao != null){
							data.conexao = data_conexao;
						}else{
							data.conexao = {email:'',senha:'',status:'primeira_vez'};
						}

						mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0},function(err,data_mensagem){
							data.mensagem = data_mensagem;

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


							data.mensagem_horario = arrayMensagemData;

							data.acertividade = {entradas:0,porcentagem:100};

							ts = Math.round(new Date().getTime() / 1000);
							tsYesterday = ts - (24 * 3600);

							entradasUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0,timestamp:{$gte:tsYesterday}},function(err,data_acertividade){
								var acertos = 0;


								for(i=0;i<data_acertividade.length;i++){
									if(data_acertividade[i].vitoria == true){
										acertos++;
									}
								}

								if(data_acertividade.length > 0){
									var porcentagem_a = (acertos * 100) / data_acertividade.length;
									var porcentagem_round = Math.round(porcentagem_a);
								}else{
									porcentagem_round = 100;
								}

								data.acertividade = {entradas:data_acertividade.length,porcentagem:porcentagem_round};

								console.log('00000000000000 data 000000000000000000000');
								console.log(data);
								console.log('00000000000000000000000000000000000000000');

								res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index', data: data, usuario: req.session.usuario});
							});
						}).sort({'data_registro':-1}).limit(20);
					}).sort({'data_cadastro':-1});
				}).sort({'data_cadastro':-1});
			});
});
}else{

	sessaoStatusModel.find({},function(err,data_sessao_status){

		if(data_sessao_status !=null){
			data.sessao_status = data_sessao_status;
		}else{
			data.sessao_status = {quantidade_usuarios:0};
		}

		sessao_usuarioModel.find({},function(err,data_usuarios_sessao){
			usuariosSessao = 0;

			console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
			console.log('data_usuarios_sessao');
			console.log(data_usuarios_sessao);
			console.log('data_usuarios_sessao.length');
			console.log(data_usuarios_sessao.length);


			if(data_usuarios_sessao != null){
				usuariosSessao = data_usuarios_sessao.length;
			}

			data.qtd_usuario_sessao = usuariosSessao;

			sessaoTotalModel.find({},function(err,data_sessao_total){

				if(data_sessao_total != null){
					data.sessao_total = data_sessao_total;
				}else{
					data.sessao_total = {total_participantes_sessao:0,total_usuarios_conectados:0};
				}


				usuariosModel.find({nivel:3},function(err,data_clientes_trader){

					usuarios_clientes = 0;

					if(data_clientes_trader != null){
						usuarios_clientes = data_clientes_trader.length;
					}

					data.qtd_clientes_trader = usuarios_clientes;


					traderLimiteModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_trader_limite){

						if(data_trader_limite !=null){
							data.trader_limite = data_trader_limite;
						}else{
							data.trader_limite = {limite_usuarios:200,limite_liquidez:50};
						}

						contaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
							if(data_conta !=null){
								data.conta_user = data_conta;
							}else{
								data.conta_user = {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:50,acao:'parar',status:'desconectado'};
							}

							teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

								if(data_conexao != null){
									data.conexao = data_conexao;
								}else{
									data.conexao = {email:'',senha:''};
								}
								mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0},function(err,data_mensagem){

									data.mensagem = data_mensagem;

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


									data.mensagem_horario = arrayMensagemData;

									console.log(data);


									res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/indexTrader', data: data, usuario: req.session.usuario});

								});
							}).sort({'data_cadastro':-1});
						}).sort({'data_cadastro':-1});
					}).sort({'data_cadastro':-1});
				});
			});
		});
	});
}


});



router.post('/popup-confirmacao-alterar-testar-conexao', function(req, res, next) {

	POST = req.body;

	teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao_p){
		data.dados_c = data_conexao_p;
		console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
		console.log('estou dentro do load-container-testar-conexao');
		console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')

		console.log(data_conexao_p);
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/confirmar_alterar_conta_conexao', data: data, usuario: req.session.usuario});

	}).sort({'data_cadastro':-1});

});



router.get('/load-container-testar-conexao', function(req, res, next) {

	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
	console.log('estou dentro do load-container-testar-conexao');
	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/testar_conexao_form', data: data, usuario: req.session.usuario});
});



router.post('/log', function(req, res, next) {
	POST = req.body;

	const new_log = new log({ 
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		ip: POST[0], 
		method:POST[1],
		rota:POST[2],
		user_agent:POST[3],
		deletado:0,
		data_cadastro: new Date()
	});

	new_log.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});

});

router.post('/testar-conexao', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO TESTAR CONEXAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();

	if(POST.email != ''){
		console.log('cai aqui dentro do POST.email dif vazio!!');

		if(POST.senha != ''){
			const teste_conexao = new teste_conexaoUser({ 
				id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
				email:POST.email,
				senha:POST.senha,
				status:'',
				deletado:0,
				data_cadastro:new Date()
			});

			console.log('tttttttttttttttt teste_conexao ttttttttttttttttt');
			console.log(teste_conexao);
			console.log('tttttttttttttttttttttttttttttttttttttttttttttttt');

			teste_conexao.save(function (err) {
				if (err) {
					return handleError(err);
				}else{
					res.json(data);
				}
			});
		}else{
			res.json({error:'senha_vazia',element:'input[name="senha"]',texto:'*Senha não pode ser Vazia!'});
		}
	}else{
		res.json({error:'email_vazio',element:'input[name="email"]',texto:'*Email não pode ser Vazio!'});
	}
});


router.post('/popup-confirmacao-iniciar-operacao', function(req, res, next) {
	POST = req.body;

	console.log('qqqqqqqqqqqqqq ESTOU NO POPUP DE CONFIRMAÇÃO DE SENHA qqqqqqqqqqq');
	console.log(POST);
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

	configuracoes_sistema.find({},function(err,data_configuracoes){

		if(data_configuracoes != null){
			data.config_sistema = data_configuracoes;
		}else{
			data.config_sistema = {possui_creditos:true};
		}

		if(POST.valor_entrada >= 2){
			if(POST.limite_perda > 0){
				if(POST.valor_entrada % 1 === 0){
					if(POST.limite_perda % 1 ===0){
						tipo_conta_n = true;
						if(POST.tipo_conta == 0){
							tipo_conta_n = false;
						}else{
							tipo_conta_n = true;
						}

						var dias_faltantes_licenca;

						if(req.session.usuario.licenca_dias == undefined){
							dias_faltantes_licenca = -1;
						}else{
							dias_faltantes_licenca = req.session.usuario.licenca_dias;
						}


						if(dias_faltantes_licenca >= 0){

							var creditos_restantes;

							if(req.session.usuario.creditos == undefined){
								creditos_restantes = 0;
							}else{
								creditos_restantes = req.session.usuario.creditos;
							}


							if((creditos_restantes > 0) || data_configuracoes[0].possui_creditos == false){

								teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

									data.dados = POST;
									data.email = data.conexao.email;

									console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDD Data DDDDDDDDDDDDDDDDDDDDDDDDDDD');
									console.log(data);
									console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');

									res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/confirmar_inicio_operacao', data: data, usuario: req.session.usuario});

								}).sort({'data_cadastro':-1});

							}else{
								res.json({error:'sem_creditos',element:'#error_mensagem_conexao',texto:'Você está sem créditos, por-favor recarregue os créditos!'});
							}
						}else{
							res.json({error:'acabou_licenca',element:'#error_mensagem_conexao',texto:'Sua licença expirou, por-favor recarregar a licença para poder continuar usando o sistema!'});
						}
					}else{
						res.json({error:'limite_perda_num',element:'input[name="limite_perda"]',texto:'*Somente valores inteiros. Ex: 100'});
					}
				}else{
					res.json({error:'qtd_valor_negativo',element:'input[name="valor_entrada"]',texto:'*Somente valores inteiros. Ex: 100'});
				}
			}else{
				res.json({error:'qtd_valor_negativo',element:'input[name="limite_perda"]',texto:'*Valor não pode ser 0 ou Negativo!'});
			}
		}else{
			res.json({error:'valor_maior_que_2',element:'input[name="valor_entrada"]',texto:'*Valor minimo é de 2!'});
		}

	});
});

router.post('/popup-confirmacao-parar-operacao', function(req, res, next) {
	POST = req.body;
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/confirmar_parar_operacao', data: data, usuario: req.session.usuario});
});



router.post('/iniciar-operacao', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR OPERACAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');


	configuracoes_sistema.find({},function(err,data_configuracoes){

		if(data_configuracoes != null){
			data.config_sistema = data_configuracoes;
		}else{
			data.config_sistema = {possui_creditos:true};
		}


		if(POST.valor_entrada >= 2){
			if(POST.limite_perda > 0){
				if(POST.valor_entrada % 1 === 0){
					if(POST.limite_perda % 1 ===0){
						tipo_conta_n = true;
						if(POST.tipo_conta == 0){
							tipo_conta_n = false;
						}else{
							tipo_conta_n = true;
						}

						var dias_faltantes_licenca;

						if(req.session.usuario.licenca_dias == undefined){
							dias_faltantes_licenca = -1;
						}else{
							dias_faltantes_licenca = req.session.usuario.licenca_dias;
						}


						if(dias_faltantes_licenca >= 0){

							var creditos_restantes;

							if(req.session.usuario.creditos == undefined){
								creditos_restantes = 0;
							}else{
								creditos_restantes = req.session.usuario.creditos;
							}


							if((creditos_restantes > 0) || data_configuracoes[0].possui_creditos == false){

								tipo_cliente = 'cliente';

								tipo_banca = 'numero';

								if(POST.tipo_banca == 1){
									tipo_banca = 'percentual';
								};


								teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

									const new_conta_user = new contaUser({ 
										id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
										tipo:tipo_cliente,
										email: data_conexao.email, 
										senha:data_conexao.senha,
										conta_real:tipo_conta_n,
										tipo_banca:tipo_banca,
										valor_entrada:POST.valor_entrada,
										limite_perda:POST.limite_perda,
										acao:'iniciar',
										status:'standby',
										deletado:0,
										data_cadastro: new Date()
									});

									new_conta_user.save(function (err) {
										if (err) {
											return handleError(err);
										}else{
											res.json(data);
										}
									});


								}).sort({'data_cadastro':-1});

								


							}else{
								res.json({error:'sem_creditos',element:'#error_mensagem_conexao',texto:'Você está sem créditos, por-favor recarregue os créditos!'});
							}
						}else{
							res.json({error:'acabou_licenca',element:'#error_mensagem_conexao',texto:'Sua licença expirou, por-favor recarregar a licença para poder continuar usando o sistema!'});
						}
					}else{
						res.json({error:'limite_perda_num',element:'input[name="limite_perda"]',texto:'*Somente valores inteiros. Ex: 100'});
					}
				}else{
					res.json({error:'qtd_valor_negativo',element:'input[name="valor_entrada"]',texto:'*Somente valores inteiros. Ex: 100'});
				}
			}else{
				res.json({error:'qtd_valor_negativo',element:'input[name="limite_perda"]',texto:'*Valor não pode ser 0 ou Negativo!'});
			}
		}else{
			res.json({error:'valor_maior_que_2',element:'input[name="valor_entrada"]',texto:'*Valor minimo é de 2!'});
		}
	});

});


router.post('/parar-operacao', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR OPERACAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	contaUser.findOneAndUpdate({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'acao':'parar'}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	}).sort({'data_cadastro':-1});;

});





router.post('/iniciar-operacao-trader', function(req, res, next) {
	POST = req.body;

	console.log('______________________ ESTOU NO INICIAR OPERACAO DO TRADER ______________________');
	console.log(POST);
	console.log('_________________________________________________________________________________');

	if(POST.limite_usuarios > 0){
		if(POST.limite_usuarios % 1 ===0){
			if(POST.limite_liquidez % 1 ===0){
				if(POST.limite_usuarios < 201){

					valor_entrada = 15;
					limite_perda = 15;

					tipo_conta_n = false;


					tipo_banca = 'numero';

					if(POST.tipo_banca == 1){
						tipo_banca = 'percentual';
					};

					teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

						const new_conta_user = new contaUser({ 
							id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
							tipo:'trader',		
							email: data_conexao.email, 
							senha:data_conexao.senha,
							conta_real:tipo_conta_n,
							tipo_banca:tipo_banca,
							valor_entrada:valor_entrada,
							limite_perda:limite_perda,
							acao:'iniciar',
							status:'',
							deletado:0,
							data_cadastro: new Date()
						});

						new_conta_user.save(function (err) {
							if (err) {
								return handleError(err);
							}else{
								traderLimiteModel.findOneAndUpdate({'deletado':0},{'$set':{'limite_liquidez':POST.limite_liquidez,'limite_usuarios':POST.limite_usuarios}},function(err){
									if (err) {
										return handleError(err);
									}else{
										res.json(data);
									}
								}).sort({'data_cadastro':-1});;
							}
						});

					}).sort({'data_cadastro':-1});

				}else{
					res.json({error:'muitos_usuarios',element:'input[name="limite_usuarios"]',texto:'*Não é possivel ter mais de 200 usuários ativos!'});
				}
			}else{
				res.json({error:'limite_liquidez_n_inteiros',element:'input[name="limite_liquidez"]',texto:'*Somente valores inteiros. Ex: 100'});
			}
		}else{
			res.json({error:'limite_usuarios_n_inteiros',element:'input[name="limite_usuarios"]',texto:'*Somente valores inteiros. Ex: 100'});
		}
	}else{
		res.json({error:'poucos_usuarios',element:'input[name="limite_usuarios"]',texto:'*Valor não pode ser 0 ou Negativo'});
	}


});


router.post('/salvar-limites-trader', function(req, res, next) {
	POST = req.body;

	console.log('TTTTTTTTTTTTTTTTTTTT ESTOU NO SALVAR LIMITES TRADER TTTTTTTTTTTTTTTTTTTTTTT');
	console.log(POST);
	console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');

	if(POST.limite_liquidez % 1 === 0){

		traderLimiteModel.findOneAndUpdate({'deletado':0},{'$set':{'limite_liquidez':POST.limite_liquidez}},function(err){
			if (err) {
				return handleError(err);
			}else{
				res.json(data);
			}
		}).sort({'data_cadastro':-1});;

	}else{
		res.json({error:'limite_liquidez_n_inteiros',element:'input[name="limite_liquidez"]',texto:'*Somente valores inteiros. Ex: 100'});
	}

});








router.post('/limpar-mensagens', function(req, res, next) {
	POST = req.body;

	console.log('HHHHHHHHHHHHHHH ESTOU NO LIMPAR MENSAGENS HHHHHHHHHHHHHHHHHHHH');
	console.log(POST);
	console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
	
	mensagemUser.updateMany({'id_usuario':req.session.usuario.id,'deletado':0},{'$set':{'deletado':1}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}		
	});
});


router.post('/limpar-mensagem/:id', function(req, res, next) {
	POST = req.body;

	id = req.params.id;

	console.log('@@@@@@@@@@@@@@ estou no limpar mensagem @@@@@@@');
	console.log(id);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


	mensagemUser.findOneAndUpdate({'_id':id},{'$set':{'deletado':1}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});
	
});


module.exports = router;