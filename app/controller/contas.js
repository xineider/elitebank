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

const entradasModel = require('../model/entradasModel.js');

const entradasTraderModel = require('../model/entradasTraderModel.js');

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

var usuarioSessaoDefinitivaModel = require('../model/usuarioSessaoDefinitivaModel.js');


var fechar_ordem_forexModel = require('../model/fechar_ordem_forexModel.js');

/* GET pagina de login. */

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 8;

	console.log('estou no contas!');
	console.log('req.session.usuario');
	console.log(req.session.usuario);
	console.log(req.session.usuario.nivel);


	if(req.session.usuario.nivel == 1 || req.session.usuario.nivel == 2){

		usuariosModel.aggregate([
		{
			$match:{nivel:3}
		},
		{
			$lookup:{
				from:'usuario_conta',
				localField:'_id',
				foreignField:'id_usuario',
				as:'conta'

			}
		},
		{
			$lookup:{
				from:'conexao_teste',
				localField:'_id',
				foreignField:'id_usuario',
				as:'conexao'

			}
		},
		{
			$lookup:{
				from:'usuario_mensagem',
				localField:'_id',
				foreignField:'id_usuario',
				as:'mensagem'

			}
		}






		]).exec(function(err,data_usuario){

			data[req.session.usuario.id + '_usuario_c'] = data_usuario;

			var contador_parados = 0;

			for(i=0;i<data_usuario.length;i++){
				if(data_usuario[i].conta.length > 0){
					var conta_length = data_usuario[i].conta.length - 1;
					if(data_usuario[i].conta[conta_length].email != 'allreisesouza@gmail.com'){
						if(data_usuario[i].conta[conta_length].email != 'mvzdeveloper@gmail.com'){
							if(data_usuario[i].conta[conta_length].acao == 'parar'){
								contador_parados++;
							}
						}
					}
				}
			}

			data[req.session.usuario.id + '_contador_parados'] = contador_parados;


			console.log('----------------- contas data ------------------');
			console.log(data);
			console.log('------------------------------------------------');




			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'contas/contas', data: data, usuario: req.session.usuario});
		});

	}




});












router.get('/adicionar-conta', function(req, res, next) {

	console.log('estou no adicionar conta!');


	usuariosModel.aggregate([
	{
		$match:{nivel:3}
	},
	{
		$lookup:{
			from:'usuario_conta',
			localField:'_id',
			foreignField:'id_usuario',
			as:'conta'

		}
	},
	{
		$lookup:{
			from:'conexao_teste',
			localField:'_id',
			foreignField:'id_usuario',
			as:'conexao'

		}
	}




	]).exec(function(err,data_usuario){

		var ultimo_livre_id;

		for(i=0;i<data_usuario.length; i++){
			if(data_usuario[i].conta.length == 0 && data_usuario[i].conexao.length == 0){
				ultimo_livre_id = data_usuario[i]._id;
			}
		}



		data[req.session.usuario.id + '_ultimo_id_livre'] = ultimo_livre_id;

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'contas/adicionar-conta', data: data, usuario: req.session.usuario});


	});

});


router.get('/conectar-todas-contas', function(req, res, next) {

	console.log('estou no conectar-todas-contas!');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'contas/conectar-todas-contas', data: data, usuario: req.session.usuario});

});



router.get('/mensagens-usuario/:id_usuario', function(req, res, next) {

	console.log('estou no mensagens-usuario!');
	var id_u = req.params.id_usuario

	console.log('id_u');
	console.log(id_u);


	mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(id_u),'deletado':0},function(err,data_mensagem){

		console.log('------------------------------ data mensagem -------------');
		console.log(data_mensagem);
		console.log('----------------------------------------------------------');

		data[req.session.usuario.id + '_mensagem_user'] = data_mensagem;

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

		data[req.session.usuario.id + '_mensagem_data'] = arrayMensagemData;

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'contas/mensagem-usuario', data: data, usuario: req.session.usuario});


	});

});







router.post('/iniciar-operacao', function(req, res, next) {
	POST = req.body;

	data[req.session.usuario.id + '_i_valor_entrada'] = parseInt(POST.valor_entrada);
	data[req.session.usuario.id + '_i_valor_limite_perda'] = parseInt(POST.limite_perda);
	data[req.session.usuario.id + '_i_valor_stop_gain'] = parseInt(POST.stop_gain);

	console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLL INICIAR OPERACAO CONTAS LLLLLLLLLLL');
	console.log(POST);
	console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');


	configuracoes_sistema.find({},function(err,data_configuracoes){

		if(data_configuracoes != null){
			data.config_sistema = data_configuracoes;
		}else{
			data.config_sistema = {possui_creditos:true};
		}

		if(data[req.session.usuario.id + '_i_valor_entrada'] != undefined){
			if(data[req.session.usuario.id + '_i_valor_limite_perda'] != undefined){
				if(data[req.session.usuario.id + '_i_valor_stop_gain'] != undefined){

					console.log('1');
					console.log('_i_valor_entrada');
					console.log(parseInt(data[req.session.usuario.id + '_i_valor_entrada']));

					if(parseInt(data[req.session.usuario.id + '_i_valor_entrada']) >= 2){
						if(parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) > 0){
							if(parseInt(data[req.session.usuario.id + '_i_valor_entrada']) % 1 === 0){
								if(parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) % 1 ===0){
									if(parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) > parseInt(data[req.session.usuario.id + '_i_valor_entrada'])){

										console.log('2');
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




										var creditos_restantes;

										if(req.session.usuario.creditos == undefined){
											creditos_restantes = 0;
										}else{
											creditos_restantes = req.session.usuario.creditos;
										}


										if((creditos_restantes > 0) || data_configuracoes[0].possui_creditos == false){

											if(POST.tipo_banca != 1 || (POST.tipo_banca == 1 && (parseInt(data[req.session.usuario.id + '_i_valor_entrada']) > 0 && parseInt(data[req.session.usuario.id + '_i_valor_entrada']) <= 100))){
												if(POST.tipo_banca != 1 || (POST.tipo_banca == 1 && (parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) > 0 && parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) <= 100))){

													tipo_cliente = 'cliente';



													tipo_banca = 'numero';

													if(POST.tipo_banca == 1){
														tipo_banca = 'percentual';
													};




													const teste_conexao = new teste_conexaoUser({ 
														id_usuario:mongoose.Types.ObjectId(POST.id_usuario),
														email:POST.email,
														senha:POST.senha,
														status:'conectado',
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







															contaUser.updateMany({'id_usuario':POST.id_usuario},{'$set':{'acao':'parar'}},function(err2){

																if (err2) {
																	return handleError(err2);
																}else{
																	const new_conta_user = new contaUser({ 
																		id_usuario:mongoose.Types.ObjectId(POST.id_usuario),
																		tipo:tipo_cliente,
																		email: POST.email, 
																		senha:POST.senha,
																		conta_real:tipo_conta_n,
																		tipo_banca:tipo_banca,
																		valor_entrada:parseInt(data[req.session.usuario.id + '_i_valor_entrada']),
																		limite_perda:parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']),
																		acao:'iniciar',
																		status:'standby',
																		stop_gain:parseInt(data[req.session.usuario.id + '_i_valor_stop_gain']),
																		deletado:0,
																		data_cadastro: new Date()
																	});

																	console.log('entrei aqui no cadastrar conta');
																	console.log(new_conta_user);
																	console.log('------------------------------');


																	new_conta_user.save(function (err) {
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
													res.json({error:'perc_limite_perda_100',element:'input[name="limite_perda"]',texto:'*No percentual não é permitido ter mais que 100% do Stop Loss!'});
												}

											}else{
												res.json({error:'perc_valor_entrada_100',element:'input[name="valor_entrada"]',texto:'*No percentual não é permitido ter mais que 100% do valor de entrada!'});
											}

										}else{
											res.json({error:'sem_creditos',element:'#error_mensagem_conexao',texto:'Você está sem créditos, por-favor recarregue os créditos!'});
										}


									}else{
										res.json({error:'limite_perda_num',element:'input[name="limite_perda"]',texto:'*Stop Loss não pode ser menor ou igual que o Valor da Entrada.'});
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
				}else{
					res.json({error:'valor_stop_gain_invalido',element:'#error_mensagem_conexao',texto:'*Problema no versão do seu navegador. Você deve utilizar outro navegador! Recomendamos utilizar a última versão do Google Chrome ou do Opera.'});
				}
			}else{
				res.json({error:'valor_limite_invalido',element:'#error_mensagem_conexao',texto:'*Problema no versão do seu navegador. Você deve utilizar outro navegador! Recomendamos utilizar a última versão do Google Chrome ou do Opera.'});
			}
		}else{
			res.json({error:'valor_entrada_invalido',element:'#error_mensagem_conexao',texto:'*Problema no versão do seu navegador. Você deve utilizar outro navegador! Recomendamos utilizar a última versão do Google Chrome ou do Opera.'});
		}

	});

});



router.post('/parar-operacao', function(req, res, next) {
	POST = req.body;

	console.log('NNNNNNNNNNNNNNNNNN ESTOU NO PARAR OPERACAO NNNNNNNNNNNNNNN');
	console.log(POST);
	console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');

	var data_fim = new Date();

	contaUser.findOneAndUpdate({'id_usuario':mongoose.Types.ObjectId(POST.id_usuario)},{'$set':{'acao':'parar','data_fim':data_fim}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	}).sort({'data_cadastro':-1});


});


router.post('/conectar-todas-contas-popup', function(req, res, next) {
	POST = req.body;

	console.log('NNNNNNNNNNNNNNNNNN ESTOU NO conectar-todas-contas-popup NNNNNNNNNNNNNNN');
	console.log(POST);
	console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');

	usuariosModel.aggregate([
	{
		$match:{nivel:3}
	},
	{
		$lookup:{
			from:'usuario_conta',
			localField:'_id',
			foreignField:'id_usuario',
			as:'conta'

		}
	},
	]).exec(function(err,data_usuario){



		console.log('data_usuario.length: ' + data_usuario.length);



		console.log('----------------- contas data ------------------');
		console.log(data);
		console.log('------------------------------------------------');

		var final = 0;


		for(i=0;i<data_usuario.length;i++){
			if(data_usuario[i].conta.length > 0){
				var conta_length = data_usuario[i].conta.length - 1;

				if(data_usuario[i].conta[conta_length].email != 'allreisesouza@gmail.com'){
					if(data_usuario[i].conta[conta_length].email != 'mvzdeveloper@gmail.com'){

						if(data_usuario[i].conta[conta_length].acao == 'parar'){
							console.log(data_usuario[i].conta[conta_length]);
							console.log(data_usuario[i].conta[conta_length]._id);


							contaUser.findOneAndUpdate({'_id':data_usuario[i].conta[conta_length]._id},{'$set':{'acao':'iniciar',status:'standby'}},function(err){

							});


						}
					}
				}
			}
			var j = i+1;

			if(j == data_usuario.length){
				final = 1;
			}


		}


		if(final == 1){
			res.json(data);
		}

		
	});




});





module.exports = router;