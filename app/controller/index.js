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



/* GET pagina de login. */

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 1;


	if(req.session.usuario.nivel == 3){

		licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){
			console.log('achei o documento? q');
			console.log(data_licenca);

			if(data_licenca != null){
				data.licenca_user = data_licenca;
				/*Calcular quantos dias faltam para a licença expirar*/
				hoje = new Date();
				data_fim = data_licenca.data_fim; 
				diferencaData = data_fim - hoje;
				dias_faltantes = Math.floor(diferencaData / (1000 * 60 * 60 * 24));
				data.licenca_user_dias = dias_faltantes;
				req.session.usuario.creditos = data_licenca.creditos;
				req.session.usuario.licenca_data = data_fim;
			}else{
				data.licenca_user = {creditos:0,licenca_user_dias:0,status:1};
				data.licenca_user_dias = 0;
			}

			contaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
				console.log('data_conta');
				console.log(data_conta);

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
						console.log('data_mensagem');
						console.log(data_mensagem);
						data.mensagem = data_mensagem;
						data.acertividade = {entradas:0,porcentagem:100};

						ts = Math.round(new Date().getTime() / 1000);
						tsYesterday = ts - (24 * 3600);

						entradasUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0,timestamp:{$gte:tsYesterday}},function(err,data_acertividade){
							console.log('data_acertividade');
							console.log(data_acertividade);
							console.log(data_acertividade.length);
							var acertos = 0;

							/* calcular acertividade contando os acertos */
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

							console.log('ddddddddddd data ddddddddddddddddddddddd');
							console.log(data);
							console.log('ddddddddddddddddddddddd');


							res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index', data: data, usuario: req.session.usuario});
						});
					});
				}).sort({'data_cadastro':-1});
			}).sort({'data_cadastro':-1});
		});
	}else{

		contaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
			console.log('data_conta');
			console.log(data_conta);

			if(data_conta !=null){
				data.conta_user = data_conta;
			}else{
				data.conta_user = {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:50,acao:'parar',status:'desconectado'};
			}

			teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){
				console.log('data_conexao');
				console.log(data_conexao);
				if(data_conexao != null){
					data.conexao = data_conexao;
				}else{
					data.conexao = {email:'',senha:''};
				}
				mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0},function(err,data_mensagem){
					console.log('data_mensagem');
					console.log(data_mensagem);
					data.mensagem = data_mensagem;

					console.log('yyyyyyyyyyy data yyyyyyyyyyy');
					console.log(data);
					console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyy');


					res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/indexTrader', data: data, usuario: req.session.usuario});

				});
			}).sort({'data_cadastro':-1});
		}).sort({'data_cadastro':-1});

	}


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

router.post('/cadastrar-conta-user', function(req, res, next) {
	POST = req.body;

	console.log('CCCCCCCCCCCCCCCCCCCCCCCCC CADASTRAR CONTA USER CCCCCCCCCCCCCCCCCCCCCCC');
	console.log(POST);
	console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');

	let hoje = new Date();
	let hoje2 = new Date(hoje.valueOf() - hoje.getTimezoneOffset() * 60000);
	var data_cadastro_br = hoje2.toISOString().replace(/\.\d{3}Z$/, '');

	tipo_cliente = 'cliente';
	
	if(req.session.usuario.nivel == 3){
		tipo_cliente = 'cliente';
	}else{
		tipo_cliente = 'trader';
	}

	const new_conta_user = new contaUser({ 
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		tipo:tipo_cliente,
		email: POST.email, 
		senha:POST.senha,
		tipo_conta:POST.tipo_conta,
		tipo_banca:0,
		entrada_num:POST.entrada_num,
		entrada_perc:0,
		limite_perda_num:POST.limite_perda_num,
		limite_perda_perc:0,
		status_conexao:0,
		deletado:0,
		data_cadastro: data_cadastro_br
	});
	
	new_conta_user.save(function (err) {
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
			res.json({error:'qtd_valor_negativo',element:'#senha_grupo_usuario',texto:'*Valor não pode ser Vazio!'});
		}
	}else{
		res.json({error:'qtd_valor_negativo',element:'#email_grupo_usuario',texto:'*Valor não pode ser Vazio!'});
	}
});



router.post('/iniciar-operacao', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR OPERACAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');


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

					tipo_cliente = 'cliente';

					if(req.session.usuario.nivel == 3){
						tipo_cliente = 'cliente';
					}else{
						tipo_cliente = 'trader';
					}

					tipo_banca = 'numero';

					if(POST.tipo_banca == 1){
						tipo_banca = 'percentual';
					};

					const new_conta_user = new contaUser({ 
						id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
						tipo:tipo_cliente,
						data_fim_licenca:req.session.usuario.licenca_data,
						creditos_licenca:req.session.usuario.creditos,		
						email: POST.email, 
						senha:POST.senha,
						conta_real:tipo_conta_n,
						tipo_banca:tipo_banca,
						valor_entrada:POST.valor_entrada,
						limite_perda:POST.limite_perda,
						acao:'iniciar',
						status:'',
						deletado:0,
						process:12,
						data_cadastro: new Date()
					});

					new_conta_user.save(function (err) {
						if (err) {
							return handleError(err);
						}else{
							res.json(data);
						}
					});
				}else{
					res.json({error:'qtd_valor_negativo',element:'input[name="limite_perda"]',texto:'*Somente valores inteiros. Ex: 100'});
				}
			}else{
				res.json({error:'qtd_valor_negativo',element:'input[name="valor_entrada"]',texto:'*Somente valores inteiros. Ex: 100'});
			}
		}else{
			res.json({error:'qtd_valor_negativo',element:'input[name="limite_perda"]',texto:'*Valor não pode ser 0 ou Negativo!'});
		}
	}else{
		res.json({error:'qtd_valor_negativo',element:'input[name="valor_entrada"]',texto:'*Valor minimo é de 2!'});
	}
});





router.post('/iniciar-operacao-trader', function(req, res, next) {
	POST = req.body;

	console.log('______________________ ESTOU NO INICIAR OPERACAO DO TRADER ______________________');
	console.log(POST);
	console.log('_________________________________________________________________________________');



	valor_entrada = 15;
	limite_perda = 15;

	tipo_conta_n = false;


	tipo_banca = 'numero';

	if(POST.tipo_banca == 1){
		tipo_banca = 'percentual';
	};

	const new_conta_user = new contaUser({ 
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		tipo:'trader',
		data_fim_licenca:new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
		creditos_licenca:100,		
		email: POST.email, 
		senha:POST.senha,
		conta_real:tipo_conta_n,
		tipo_banca:tipo_banca,
		valor_entrada:valor_entrada,
		limite_perda:limite_perda,
		acao:'iniciar',
		status:'',
		deletado:0,
		process:12,
		data_cadastro: new Date()
	});

	new_conta_user.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
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