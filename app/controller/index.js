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

/* GET pagina de login. */

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 1;

	console.log('req.session.usuario');
	console.log(req.session.usuario);
	console.log(req.session.usuario.nivel);
	if(req.session.usuario.nivel == 3 || req.session.usuario.nivel == 4 || req.session.usuario.nivel == 5){
		console.log('cai aqui no primeiro if');
		configuracoes_sistema.find({},function(err,data_configuracoes){

			if(data_configuracoes != null){
				data.config_sistema = data_configuracoes;
			}else{
				data.config_sistema = {possui_creditos:true};
			}

			licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){

				if(data_licenca != null){	
					data[req.session.usuario.id + '_licenca_user'] = data_licenca;				
					hoje = new Date();
					data_fim = data_licenca.data_fim;
					data_fim.setDate(data_fim.getDate() + 1);
					diferencaData = data_fim - hoje;
					dias_faltantes = Math.floor(diferencaData / (1000 * 60 * 60 * 24)) + 1;
					data[req.session.usuario.id + '_licenca_user_dias'] = dias_faltantes;
					req.session.usuario.creditos = data_licenca.creditos;
					req.session.usuario.licenca_data = data_fim;
					req.session.usuario.licenca_dias = dias_faltantes;
				}else{
					data[req.session.usuario.id + '_licenca_user'] = {creditos:0,licenca_user_dias:-1,status:1};
					data[req.session.usuario.id + '_licenca_user_dias'] = -1;
				}

				contaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
					if(data_conta !=null){
						data[req.session.usuario.id+'_conta_user']= data_conta;
					}else{
						data_conta = {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:200,acao:'parar',status:'desconectado',primeira_vez:true,stop_gain:5};
						data[req.session.usuario.id+'_conta_user']= {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:200,acao:'parar',status:'desconectado',primeira_vez:true,stop_gain:5};
					}

					teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

						if(data_conexao != null){
							
						}else{
							data_conexao = {email:'',senha:'',status:'primeira_vez'};
						}

						mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0},function(err,data_mensagem){
							
							data[req.session.usuario.id + '_mensagem'] = data_mensagem;

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


							ts = Math.round(new Date().getTime() / 1000);
							tsYesterday = ts - (24 * 3600);
							console.log('tsYesterday:' + tsYesterday);

							entradasModel.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0,'executada':true,timestamp:{$gte:tsYesterday}},function(err,data_acertividade){
								var acertos = 0;

								console.log('-------------- data_acertividade ----------');
								console.log(data_acertividade);
								console.log('-------------------------------------------');


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


								data[req.session.usuario.id+'_acertividade']= {entradas:data_acertividade.length,porcentagem:porcentagem_round};

								console.log('00000000000000 data 000000000000000000000');
								console.log(data);
								console.log('00000000000000000000000000000000000000000');

								res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index', data: data, usuario: req.session.usuario,data_conexao_b:data_conexao,data_mensagem_b:arrayMensagemData,data_conta_b:data_conta});
							});
						}).sort({'data_registro':-1}).limit(20);
					}).sort({'data_cadastro':-1});
				}).sort({'data_cadastro':-1});
			});
});
}else if(req.session.usuario.nivel == 1 || req.session.usuario.nivel == 2){

	sessaoStatusModel.find({},function(err,data_sessao_status){

		if(data_sessao_status !=null){
			data[req.session.usuario.id+'_sessao_status'] = data_sessao_status;
		}else{
			data[req.session.usuario.id+'_sessao_status'] = {quantidade_usuarios:0};
		}

		sessaoTotalModel.find({},function(err,data_sessao_total){

			if(data_sessao_total != null){
				data[req.session.usuario.id+'_sessao_total'] = data_sessao_total;
			}else{
				data[req.session.usuario.id+'_sessao_total'] = {total_participantes_sessao:0,total_usuarios_conectados:0};
			}


			usuariosModel.find({nivel:3},function(err,data_clientes_trader){

				usuarios_clientes = 0;

				if(data_clientes_trader != null){
					usuarios_clientes = data_clientes_trader.length;
				}

				data[req.session.usuario.id+'_usuarios_clientes'] = usuarios_clientes;


				traderLimiteModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_trader_limite){

					if(data_trader_limite !=null){
						data[req.session.usuario.id+'_trader_limite'] = data_trader_limite;
					}else{
						data[req.session.usuario.id+'_trader_limite'] = {limite_usuarios:200,limite_liquidez:50};
					}

					contaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
						if(data_conta != null){

						}else{
							data.conta_user = {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:200,acao:'parar',status:'desconectado'};
							data_conta = {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:200,acao:'parar',status:'desconectado'};
						}

						teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

							if(data_conexao != null){

							}else{									
								data_conexao = {email:'',senha:''};
							}
							mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0},function(err,data_mensagem){

								data[req.session.usuario.id + '_mensagem'] = data_mensagem;

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


								console.log('TTTTTTTTTTTTTTTTTTTTTTTTT TRADER TTTTTTTTTTTTTTTTTTTTTTTTTTTT');
								console.log(data);
								console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');


								res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/indexTrader', data: data, usuario: req.session.usuario,data_conexao_b:data_conexao,data_mensagem_b:arrayMensagemData,data_conta_b:data_conta});

							});
						}).sort({'data_cadastro':-1});
					}).sort({'data_cadastro':-1});
				}).sort({'data_cadastro':-1});
			});
		});
	});

}else{

	//mongoose.pluralize(null);



	// const Usuario = mongoose.model('usuarios',usuarioSchema,'usuarios');
	// const Conta = mongoose.model('usuario_conta',contaSchema,'usuario_conta');



	// Conta.
	// find({}).
	// populate('id_usuario').
	// exec(function (err, banaan) {
	// 	if (err){
	// 		console.log('kkkkkkkkkkkkkkkkkkkkkk erro kkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
	// 		console.log(err);
	// 		console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
	// 	}else{
	// 		console.log('88888888888888888888888888888888888888888888888');
	// 		console.log(banaan);
	// 		console.log('88888888888888888888888888888888888888888888888');
	// 	}
	// });


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
			from:'usuario_sessao_definitiva',
			localField:'_id',
			foreignField:'id_usuario',
			as:'sessao'
		}
	}
	// ,
	//  {"$unwind":"$sessao"},
	//  {$lookup:{
	//  	from:'usuario_sessao_definitiva',
	//  	let:{
	//  		ids:'$sessao.id_usuario'
	//  	},
	//  	pipeline:[
	//  	{
	//  		$match:{
	//  			$expr:{
	//  				$in:['$_id','$$ids']
	//  			}
	//  		}
	//  	}],
	//  	as:'sessao.teste'
	//  }}
	// {
	// 	$lookup:{
	// 		from:'usuario_sessao_definitiva',
	// 		let:{id:'$id_usuario',servidor:'$servidor'},
	// 		pipeline:[
	// 		{
	// 			$match:{
	// 				$expr: {
	// 					$and: [
	// 					{
	// 						'$$servidor':{$gte:1}
	// 					},
	// 					{ $eq: ['$id_usuario', '$$id_usuario'] }

	// 					]

	// 				}
	// 			}



	// 		}
	// 		]
	// 	},

	// }


	// {

	// 	// $lookup:{
	// 	// 	from:'usuario_sessao_definitiva',
	// 	// 	localField:'_id',
	// 	// 	foreignField:'id_usuario',
	// 	// 	as:'sessao'
	// 	// },

	// 	// $lookup:{
	// 	// 	from:'usuario_sessao_definitiva',
	// 	// 	let:{''},
	// 	// 	pipeline:[
	// 	// 	{$match:{
	// 	// 		'servidor':5
	// 	// 	}}
	// 	// 	]
	// 	// }


	// }


	]).exec(function(err,data_usuario){

		// usuarioSessaoDefinitivaModel.aggregate({
		// 	$lookup:{
		// 		from:'usuarios',
		// 		let:{'id':'$id_usuario'},
		// 		pipeline:[
  //          		{$project: {_id: 1, bid: {"$toObjectId": "$$id"}}},
		// 		{$match: {$expr: {$eq: ["$_id", "$bid"]}}}
		// 		],
		// 		as: "j"
		// 	}

		// }).exec(function(err,data_j){
		// 	console.log('aaaaaaaaaaaaaaaa');
		// 	console.log(data_j);
		// 	console.log('aaaaaaaaaaaaaaaa');
		// });


		console.log('----------------------------');
		console.log(data_usuario);
		console.log('----------------------------');

		// console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
		// console.log(data_usuario[0].conta);
		// console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

		// console.log('data_usuario[0].conta.length: ' + usuario[0].conta.length);



		data[req.session.usuario.id + '_usuarios_suporte'] = data_usuario;

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/indexSuporte', data: data, usuario: req.session.usuario});




	});




	// usuariosModel.
	// find({}).
	// populate('conta').
	// exec(function (err, usuario) {
	// 	if (err){
	// 		console.log('çççççççççççççççççççççç erro ççççççççççççççççççççççççççççççççççç');
	// 		console.log(err);
	// 		console.log('ççççççççççççççççççççççççççççççççççççççççççççççççççççççççççççççç');
	// 	}else{
	// 		console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
	// 		console.log(usuario);
	// 		console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
	// 	}
	// });









	// usuariosModel.find({}).populate('conta').exec(function (err, story) {
	// 	console.log('conta usuario');
	// 	console.log(story);
	// 	console.log('batat');
	// });









	//+++++++++++++++++++++++++++++++++++++++++++++ ultima versao trader não funcionando ++++++++++++++++++++++++++++++++++++

	// contaUser.find({tipo:'trader',data_fim:{'$exists':true}},function(err,data_conta_trader){
	// 	console.log('aaaaaaa');
	// 	console.log(data_conta_trader);
	// 	console.log('aaaaaa');

	// 	console.log('data_conta_trader.length:'+ data_conta_trader.length);

	// 	var c =0;
	// 	var arrayLenght = [];
	// 	var array_sessao_valida = [];

	// 	for(i=0;i<data_conta_trader.length;i++){
	// 		var data_inicio_sessao = data_conta_trader[i].data_cadastro;
	// 		var data_fim_sessao = data_conta_trader[i].data_fim;

	// 		entradasModel.find({data_captura:{'$gt':data_inicio_sessao,'$lt':data_fim_sessao}},function(err2,data_entradas_u){
	// 				// console.log('eeeeeeeeeeentradas');
	// 				// console.log(data_entradas_u);
	// 				// console.log('eeeeeeeeeeeeeeeeee');

	// 				console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
	// 				console.log('data_entradas_u.length: ' + data_entradas_u.length);
	// 				console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');

	// 				arrayLenght.push(data_entradas_u.length);

	// 				if(data_entradas_u.length > 0){
	// 					console.log('estou aqui no > 0');
	// 					array_sessao_valida.push(data_conta_trader[i]);




	// 				}



	// 			});


	// 		// usuarioSessaoDefinitivaModel.find({data_registro:{'$gt':data_inicio_sessao,'$lt':data_fim_sessao}},function(err2,data_usuarios_definitivos_sessao){
	// 		// 	// console.log('uuuuuuuuuuuuuuuuuuuuuuu');
	// 		// 	// console.log(data_usuarios_definitivos_sessao.length);
	// 		// 	// console.log('uuuuuuuuuuuuuuuuuuuuuuu');




	// 		// });


	// 	}

	// 	console.log('llllllllllllllllll');
	// 	console.log(arrayLenght);
	// 	console.log('llllllllllllllllll');

	// 	console.log('array_sessao_valida');
	// 	console.log(array_sessao_valida);

	// 	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/indexSuporte', data: data, usuario: req.session.usuario});

	// }).sort({'_id':-1}).limit(3);


	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// var data_inicio = new Date(2021,0,9);
	// var data_fim = new Date(2021,0,10);

	// console.log('data_inicio: ' + data_inicio);
	// console.log('data_fim: '+ data_fim);

	// contaUser.find({tipo:'trader','data_cadastro':{'$gt':data_inicio,'$lt':data_fim}},function(err,data_conta_trader){

	// 	console.log('conta_trader');
	// 	console.log(data_conta_trader);
	// 	console.log('--------------------------------------');

	// 	var data_inicio_sessao;
	// 	var data_fim_sessao;

	// 	for(i=0; i< data_conta_trader.length; i++){
	// 		data_inicio_sessao = data_conta_trader[i].data_cadastro;
	// 		data_fim_sessao = new Date(2021,0,10);

	// 		console.log('data_conta_trader.length:' + data_conta_trader.length);
	// 		console.log('data_inicio_sessao:' + data_inicio_sessao);

	// 		usuarioSessaoDefinitivaModel.find({'data_registro':{'$gt':data_inicio_sessao,'$lt':data_fim_sessao}},function(err2,data_usuario_definitivo){
	// 			console.log('========================');
	// 			console.log(data_usuario_definitivo.length);
	// 			console.log('=========================');

	// 			for(j=0;j<data_usuario_definitivo.length;j++){

	// 				console.log('data_usuario_definitivo[j]');
	// 				console.log(data_usuario_definitivo[j]);
	// 				console.log('data_usuario_definitivo[j].id_usuario: ' + data_usuario_definitivo[j].id_usuario);

	// 				console.log('data_inicio_sessao: '+data_inicio_sessao);
	// 				console.log('data_fim_sessao: ' + data_fim_sessao);

	// 				entradasModel.find({'id_usuario':mongoose.Types.ObjectId(data_usuario_definitivo[j].id_usuario),'data_captura':{'$lt':data_fim_sessao}},function(err3,data_entradas_usuario){



	// 					total_entradas = 0;
	// 					total_executadas = 0;
	// 					total_vitorias = 0;

	// 					arrayEntradas = [];
	// 					arrayExecutadas = [];
	// 					arrayVitorias = [];


	// 					// console.log(data_entradas_usuario);
	// 					// console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');


	// 					for(k=0;k<data_entradas_usuario.length;k++){
	// 						total_entradas = total_entradas + 1;
	// 						if(data_entradas_usuario[k].executada == true){
	// 							total_executadas = total_executadas + 1;
	// 							if(data_entradas_usuario[k].vitoria == true){
	// 								total_vitorias = total_vitorias + 1;
	// 								arrayVitorias.push(total_vitorias);
	// 							}
	// 						}

	// 					}

	// 					console.log('arrayVitorias:' + arrayVitorias);

	// 					// console.log('total_entradas: ' + total_entradas);
	// 					// console.log('total_executadas: ' + total_executadas);
	// 					// console.log('total_vitorias: ' + total_vitorias);



	// 				});


	// 			}

	// 		});;
	// 	};


	// 	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/indexSuporte', data: data, usuario: req.session.usuario});
	// });


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



router.get('/load-trader-opcoes-binarias', function(req, res, next) {

	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
	console.log('load-trader-opcoes-binarias');
	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/select_opcoes_binaria', data: data, usuario: req.session.usuario});
});


router.get('/load-trader-opcoes-digital', function(req, res, next) {

	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
	console.log('load-trader-opcoes-digital');
	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/select_opcoes_digital', data: data, usuario: req.session.usuario});
});


router.get('/get-mensagens-usuario/:id_usuario', function(req, res, next) {

	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	console.log('estou no getMensagensUsuario');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(id_usuario)},function(err,data_mensagem_a){

		if(data_mensagem_a.length > 0){

			for(i=0;i<data_mensagem_a.length;i++){
				var horario = new Date(data_mensagem_a[i].data_registro);
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

				data_mensagem_a[i].data_formatada = data_concatenada;

			}

		}

		data[req.session.usuario.id + '_mensagem_usuario'] = data_mensagem_a;	


		console.log('ddddddddddddddddddddd data dddddddddddddddddddddd');
		console.log(data);
		console.log('ddddddddddddddddddddddddddddddddddddddddddddddddd');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/suporte_mensagens_usuarios', data: data, usuario: req.session.usuario});
	}).sort({'_id':-1});
});




router.get('/get-conexao-usuario/:id_usuario', function(req, res, next) {

	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	console.log('estou no getConexaoUsuario');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	teste_conexaoUser.find({'id_usuario':mongoose.Types.ObjectId(id_usuario),'status':'erro de conexao'},function(err,data_conexao_a){

		data[req.session.usuario.id + '_conexao_usuario'] = data_conexao_a;	


		console.log('ddddddddddddddddddddd data dddddddddddddddddddddd');
		console.log(data);
		console.log('ddddddddddddddddddddddddddddddddddddddddddddddddd');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/suporte_conexao_usuarios', data: data, usuario: req.session.usuario});
	}).sort({'_id':-1});
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

	console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
	console.log('req.session.usuario.id');
	console.log(req.session.usuario.id);

	console.log(req.session.usuario);
	console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

	data[req.session.usuario.id + '_p_valor_entrada'] = parseInt(POST.valor_entrada);
	data[req.session.usuario.id + '_p_valor_limite_perda'] = parseInt(POST.limite_perda);
	data[req.session.usuario.id + '_p_valor_stop_gain'] = parseInt(POST.stop_gain);

	console.log('weee');
	console.log(data);


	configuracoes_sistema.find({},function(err,data_configuracoes){

		if(data_configuracoes != null){
			data.config_sistema = data_configuracoes;
		}else{
			data.config_sistema = {possui_creditos:true};
		}

		if(data[req.session.usuario.id + '_p_valor_entrada'] != undefined){
			if(data[req.session.usuario.id + '_p_valor_limite_perda'] != undefined){
				if(data[req.session.usuario.id + '_p_valor_stop_gain'] != undefined){

					if(parseInt(data[req.session.usuario.id + '_p_valor_entrada'])  >= 2){
						if(parseInt(data[req.session.usuario.id + '_p_valor_limite_perda']) > 0){
							if(parseInt(data[req.session.usuario.id + '_p_valor_entrada']) % 1 === 0){
								if(parseInt(data[req.session.usuario.id + '_p_valor_limite_perda']) % 1 ===0){
									if(parseInt(data[req.session.usuario.id + '_p_valor_limite_perda']) > parseInt(data[req.session.usuario.id + '_p_valor_entrada'])){


										if(parseInt(data[req.session.usuario.id + '_p_valor_limite_perda']) % parseInt(data[req.session.usuario.id + '_p_valor_entrada']) === 0){

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

													if(POST.tipo_banca != 1 || (POST.tipo_banca == 1 && (parseInt(data[req.session.usuario.id + '_p_valor_entrada']) > 0 && parseInt(data[req.session.usuario.id + '_p_valor_entrada']) <= 100))){
														if(POST.tipo_banca != 1 || (POST.tipo_banca == 1 && (parseInt(data[req.session.usuario.id + '_p_valor_limite_perda']) > 0 && parseInt(data[req.session.usuario.id + '_p_valor_limite_perda']) <= 100))){

															teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){


																data[req.session.usuario.id + '_dados_iniciar_operacao'] = POST;

																data[req.session.usuario.id + '_email_iniciar_operacao'] = data_conexao.email;


																console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDD Data DDDDDDDDDDDDDDDDDDDDDDDDDDD');
																console.log(data);
																console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');

																res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/confirmar_inicio_operacao', data: data, usuario: req.session.usuario});

															}).sort({'data_cadastro':-1});

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
												res.json({error:'acabou_licenca',element:'#error_mensagem_conexao',texto:'Sua licença expirou, por-favor recarregar a licença para poder continuar usando o sistema!'});
											}

										}else{
											res.json({error:'limite_perda_num',element:'input[name="limite_perda"]',texto:'*Stop Loss deve ser divisível pelo valor de entrada: Exemplo: ' + (parseInt(data[req.session.usuario.id + '_p_valor_entrada']) * 3) + ' ou ' + (parseInt(data[req.session.usuario.id + '_p_valor_entrada']) * 4) + ' ou ' + (parseInt(data[req.session.usuario.id + '_p_valor_entrada']) * 5) + ' ou qualquer outro múltiplo do valor que você selecionou como entrada.'  });
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

router.post('/popup-confirmacao-parar-operacao', function(req, res, next) {
	POST = req.body;
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/confirmar_parar_operacao', data: data, usuario: req.session.usuario});
});



router.post('/iniciar-operacao', function(req, res, next) {
	POST = req.body;

	data[req.session.usuario.id + '_i_valor_entrada'] = parseInt(POST.valor_entrada);
	data[req.session.usuario.id + '_i_valor_limite_perda'] = parseInt(POST.limite_perda);
	data[req.session.usuario.id + '_i_valor_stop_gain'] = parseInt(POST.stop_gain);

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR OPERACAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');


	configuracoes_sistema.find({},function(err,data_configuracoes){

		if(data_configuracoes != null){
			data.config_sistema = data_configuracoes;
		}else{
			data.config_sistema = {possui_creditos:true};
		}

		if(data[req.session.usuario.id + '_i_valor_entrada'] != undefined){
			if(data[req.session.usuario.id + '_i_valor_limite_perda'] != undefined){
				if(data[req.session.usuario.id + '_i_valor_stop_gain'] != undefined){

					if(parseInt(data[req.session.usuario.id + '_i_valor_entrada']) >= 2){
						if(parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) > 0){
							if(parseInt(data[req.session.usuario.id + '_i_valor_entrada']) % 1 === 0){
								if(parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) % 1 ===0){
									if(parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) > parseInt(data[req.session.usuario.id + '_i_valor_entrada'])){

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

												if(POST.tipo_banca != 1 || (POST.tipo_banca == 1 && (parseInt(data[req.session.usuario.id + '_i_valor_entrada']) > 0 && parseInt(data[req.session.usuario.id + '_i_valor_entrada']) <= 100))){
													if(POST.tipo_banca != 1 || (POST.tipo_banca == 1 && (parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) > 0 && parseInt(data[req.session.usuario.id + '_i_valor_limite_perda']) <= 100))){

														tipo_cliente = 'cliente';

														if(req.session.usuario.nivel == 4){
															tipo_cliente = 'fantasma';
														}

														if(req.session.usuario.nivel == 5){
															tipo_cliente = 'master';
														}

														tipo_banca = 'numero';

														if(POST.tipo_banca == 1){
															tipo_banca = 'percentual';
														};


														teste_conexaoUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

															contaUser.updateMany({'id_usuario':req.session.usuario.id},{'$set':{'acao':'parar'}},function(err2){

																if (err2) {
																	return handleError(err2);
																}else{
																	const new_conta_user = new contaUser({ 
																		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
																		tipo:tipo_cliente,
																		email: data_conexao.email, 
																		senha:data_conexao.senha,
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

																	new_conta_user.save(function (err) {
																		if (err) {
																			return handleError(err);
																		}else{
																			res.json(data);
																		}
																	});

																}
															});


														}).sort({'data_cadastro':-1});

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
											res.json({error:'acabou_licenca',element:'#error_mensagem_conexao',texto:'Sua licença expirou, por-favor recarregar a licença para poder continuar usando o sistema!'});
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

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR OPERACAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	var data_fim = new Date();

	contaUser.findOneAndUpdate({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'acao':'parar','data_fim':data_fim}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	}).sort({'data_cadastro':-1});


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

						console.log('iniciar operacao trader');
						console.log(POST);
						console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');

						sessaoStatusModel.findOneAndUpdate({'deletado':0},{'$set':{'tipo_sessao':POST.tipo_sessao}},function(err3){
							if (err) {
								return handleError(err3);
							}else{
								new_conta_user.save(function (err1) {
									if (err) {
										return handleError(err1);
									}else{
										traderLimiteModel.findOneAndUpdate({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'limite_liquidez':POST.limite_liquidez,'limite_usuarios':POST.limite_usuarios}},function(err2){
											if (err) {
												return handleError(err2);
											}else{
												res.json(data);
											}
										}).sort({'data_cadastro':-1});
									}
								});							
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
		}).sort({'data_cadastro':-1});

	}else{
		res.json({error:'limite_liquidez_n_inteiros',element:'input[name="limite_liquidez"]',texto:'*Somente valores inteiros. Ex: 100'});
	}

});



router.post('/entrada-trader-call', function(req, res, next) {
	POST = req.body;

	console.log('CCCCCCCCCCCCCCCCCCCCCCCCC CALL CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
	console.log(POST);
	console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
	
	var ts = Math.round(new Date().getTime() / 1000);

	var limitar_entrada = true;

	if(POST.limite_liquidez == 0){
		limitar_entrada = false;
	}

	var tipo_opcao = 'turbo';

	if(POST.tipo == 'Digital'){
		tipo_opcao = 'digital';
	}

	const new_entrada_trader = new entradasTraderModel({
		par:POST.par,
		direcao:'call',
		tipo:tipo_opcao,
		expiracao:parseInt(POST.expiracao),
		timestamp:ts,
		limitar_entrada:limitar_entrada,
		valor_maximo:POST.limite_liquidez

	});

	console.log('new_entrada_trader');
	console.log(new_entrada_trader);
	console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnn');

	new_entrada_trader.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});

});


router.post('/entrada-trader-put', function(req, res, next) {
	POST = req.body;

	console.log('CCCCCCCCCCCCCCCCCCCCCCCCC CALL CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
	console.log(POST);
	console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
	
	var ts = Math.round(new Date().getTime() / 1000);

	var limitar_entrada = true;

	if(POST.limite_liquidez == 0){
		limitar_entrada = false;
	}

	var tipo_opcao = 'turbo';

	if(POST.tipo == 'Digital'){
		tipo_opcao = 'digital';
	}

	const new_entrada_trader = new entradasTraderModel({
		par:POST.par,
		direcao:'put',
		tipo: tipo_opcao,
		expiracao:parseInt(POST.expiracao),
		timestamp:ts,
		limitar_entrada:limitar_entrada,
		valor_maximo:POST.limite_liquidez

	});

	console.log('new_entrada_trader');
	console.log(new_entrada_trader);
	console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnn');

	new_entrada_trader.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});

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