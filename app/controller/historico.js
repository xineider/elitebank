// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

const mongoose = require('mongoose');

const entradasUser = require('../model/entradasModel.js');

const contaUser = require('../model/contaModel.js');

/* GET pagina de login. */

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 3;


	contaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){

		if(data_conta !=null){
			data.conta_user = data_conta;
		}else{
			data.conta_user = {conta_real:true,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:50,acao:'parar',status:'desconectado'};
		}

		entradasUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_entradas){
			var acertos = 0;
			var dia;

			console.log('--------------------- data_entradas ----------------');
			console.log(data_entradas);
			console.log('----------------------------------------------------');


			var dias = [];
			var vitorias = [];


			if(data_entradas !=null){
				if(data_entradas.length>0){

					for(i=0;i<data_entradas.length;i++){

						data_t =  new Date(data_entradas[i].timestamp * 1000);
						dia = data_t.getDate();
						mes = data_t.getMonth() + 1;

						dia_mes = dia + '/' + mes;
						dias.push(dia_mes);
						vitorias.push(data_entradas[i].vitoria);

						if(data_entradas[i].vitoria == true){
							acertos++;
						}
					}

					console.log('dias: '+dias);
					console.log('vitorias:' + vitorias);


					var current = null;
					var cnt = 0;
					var acertos_grafico = 0;

					var data_grafico = {
						dias:[],
						operacoes:[],
						acertos:[]
					};


					for(var i=0 ; i< dias.length; i++){
						if(dias[i] != current){
							if(cnt>0){
								data_grafico.dias.push(current);
								data_grafico.operacoes.push(cnt);
								data_grafico.acertos.push(acertos_grafico);

							}
							current = dias[i];
							cnt = 1;
							if(vitorias[i]==true){
								acertos_grafico = 1;
							}else{
								acertos_grafico = 0;
							}

						} else {
							cnt++;
							if(vitorias[i]==true){
								acertos_grafico++;
							}
						}

					}

					if(cnt>0){
						data_grafico.dias.push(current);
						data_grafico.operacoes.push(cnt);
						data_grafico.acertos.push(acertos_grafico);
					}

					maior_valor = 0;
					console.log('estou aqui no maior_valor');


					for(i=0;i < data_grafico.operacoes.length;i++){
						if(data_grafico.operacoes[i] > maior_valor){
							maior_valor = data_grafico.operacoes[i];
						}
					}

					console.log('maior_valor: ' + maior_valor);

					if(maior_valor % 2 == 0){
						maior_valor = maior_valor + 4;
					}else{
						maior_valor = maior_valor + 5;
					}

					data.maior_valor = maior_valor;

					data.grafico = data_grafico;
					data.acertividade = {total_operacoes:data_entradas.length,total_acertos:acertos};
				}else{
					data.grafico = {dias:[0],operacoes:[0],acertos:[0]}
					data.acertividade = {total_operacoes:0,total_acertos:acertos};
					data.maior_valor = 0;
				}
			}else{
				data.grafico = {dias:[0],operacoes:[0],acertos:[0]}
				data.acertividade = {total_operacoes:0,total_acertos:acertos};
				data.maior_valor = 0;
			}


			console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHH Histórico HHHHHHHHHHHHHHHHHHHHHHHH');
			console.log(data);
			console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'historico/historico_tudo', data: data, usuario: req.session.usuario});
		}).sort({'timestamp':1});
	}).sort({'data_cadastro':-1});
});




router.get('/ultimos-30dias', function(req, res, next) {
	var mes_atras = new Date();
	mes_atras.setMonth(mes_atras.getMonth() - 1);
	mes_atras_timestamp = Math.floor(mes_atras/1000);


	console.log('mes_atras: ' + mes_atras);
	console.log('timestamp mes_atras: ' + mes_atras_timestamp);


	entradasUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),timestamp:{$gte:mes_atras_timestamp}},function(err,data_entradas){
		var acertos = 0;
		var dia;

		console.log('--------------------- data_entradas ----------------');
		console.log(data_entradas);
		console.log('----------------------------------------------------');


		var dias = [];
		var vitorias = [];


		if(data_entradas.length>0){

			for(i=0;i<data_entradas.length;i++){

				data_t =  new Date(data_entradas[i].timestamp * 1000);

				dia = data_t.getDate();
				mes = data_t.getMonth() + 1;

				dia_mes = dia + '/' + mes;
				dias.push(dia_mes);
				vitorias.push(data_entradas[i].vitoria);

				if(data_entradas[i].vitoria == true){
					acertos++;
				}
			}

			var current = null;
			var cnt = 0;
			var acertos_grafico = 0;

			var data_grafico = {
				dias:[],
				operacoes:[],
				acertos:[]
			};


			for(var i=0 ; i< dias.length; i++){
				if(dias[i] != current){
					if(cnt>0){
						data_grafico.dias.push(current);
						data_grafico.operacoes.push(cnt);
						data_grafico.acertos.push(acertos_grafico);

					}
					current = dias[i];
					cnt = 1;
					if(vitorias[i]==true){
						acertos_grafico = 1;
					}else{
						acertos_grafico = 0;
					}

				} else {
					cnt++;
					if(vitorias[i]==true){
						acertos_grafico++;
					}
				}

			}

			if(cnt>0){
				data_grafico.dias.push(current);
				data_grafico.operacoes.push(cnt);
				data_grafico.acertos.push(acertos_grafico);
			}

			maior_valor = 0;
			console.log('estou aqui no maior_valor');


			for(i=0;i < data_grafico.operacoes.length;i++){
				if(data_grafico.operacoes[i] > maior_valor){
					maior_valor = data_grafico.operacoes[i];
				}
				console.log('estou dentro das operaçoes');
				console.log('i:'+i);
			}

			console.log('maior_valor: ' + maior_valor);

			if(maior_valor % 2 == 0){
				maior_valor = maior_valor + 4;
			}else{
				maior_valor = maior_valor + 5;
			}

			data.maior_valor = maior_valor;

			data.grafico = data_grafico;
			data.acertividade = {total_operacoes:data_entradas.length,total_acertos:acertos};
		}else{
			data.grafico = {dias:[0],operacoes:[0],acertos:[0]}
			data.acertividade = {total_operacoes:0,total_acertos:acertos};
			data.maior_valor = 0;
		}


		console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHH Histórico HHHHHHHHHHHHHHHHHHHHHHHH');
		console.log(data);
		console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');


		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'historico/grafico', data: data, usuario: req.session.usuario});
	}).sort({'timestamp':1});
});



router.get('/ultimos-7dias', function(req, res, next) {

	var dias_7_atras = new Date();
	dias_7_atras.setDate(dias_7_atras.getDate() - 7);
	dias_7_atras_timestamp = Math.floor(dias_7_atras/1000);


	console.log('mes_atras: ' + dias_7_atras);
	console.log('timestamp mes_atras: ' + dias_7_atras_timestamp);


	entradasUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),timestamp:{$gte:dias_7_atras_timestamp}},function(err,data_entradas){
		var acertos = 0;
		var dia;

		console.log('--------------------- data_entradas ----------------');
		console.log(data_entradas);
		console.log('----------------------------------------------------');


		var dias = [];
		var vitorias = [];


		if(data_entradas.length>0){

			for(i=0;i<data_entradas.length;i++){

				data_t =  new Date(data_entradas[i].timestamp * 1000);

				dia = data_t.getDate();
				mes = data_t.getMonth() + 1;

				dia_mes = dia + '/' + mes;
				dias.push(dia_mes);
				vitorias.push(data_entradas[i].vitoria);

				if(data_entradas[i].vitoria == true){
					acertos++;
				}
			}

			var current = null;
			var cnt = 0;
			var acertos_grafico = 0;

			var data_grafico = {
				dias:[],
				operacoes:[],
				acertos:[]
			};


			for(var i=0 ; i< dias.length; i++){
				if(dias[i] != current){
					if(cnt>0){
						data_grafico.dias.push(current);
						data_grafico.operacoes.push(cnt);
						data_grafico.acertos.push(acertos_grafico);

					}
					current = dias[i];
					cnt = 1;
					if(vitorias[i]==true){
						acertos_grafico = 1;
					}else{
						acertos_grafico = 0;
					}

				} else {
					cnt++;
					if(vitorias[i]==true){
						acertos_grafico++;
					}
				}

			}

			if(cnt>0){
				data_grafico.dias.push(current);
				data_grafico.operacoes.push(cnt);
				data_grafico.acertos.push(acertos_grafico);
			}

			maior_valor = 0;
			console.log('estou aqui no maior_valor');

			for(i=0;i < data_grafico.operacoes.length;i++){
				if(data_grafico.operacoes[i] > maior_valor){
					maior_valor = data_grafico.operacoes[i];
				}
				console.log('estou dentro das operaçoes');
				console.log('i:'+i);
			}

			if(maior_valor % 2 == 0){
				maior_valor = maior_valor + 4;
			}else{
				maior_valor = maior_valor + 5;
			}

			data.maior_valor = maior_valor;
			data.grafico = data_grafico;
			data.acertividade = {total_operacoes:data_entradas.length,total_acertos:acertos};
		}else{
			data.grafico = {dias:[0],operacoes:[0],acertos:[0]}
			data.acertividade = {total_operacoes:0,total_acertos:acertos};
			data.maior_valor = 0;
		}


		console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHH Histórico HHHHHHHHHHHHHHHHHHHHHHHH');
		console.log(data);
		console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');


		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'historico/grafico', data: data, usuario: req.session.usuario});
	}).sort({'timestamp':1});
});


router.post('/filtrar-data', function(req, res, next) {

	POST = req.body;

	console.log('FFFFFFFFFFFFF FILTRAR DATA FFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
	console.log(POST);
	console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');


	if(POST.data_inicial != ''){

		if(POST.data_final != ''){


			var hoje = new Date().toISOString().slice(0,10);
			console.log('hoje');
			console.log(hoje);

			if(hoje >= POST.data_inicial){

				if(hoje >= POST.data_final){

					if(POST.data_final >= POST.data_inicial){

						var dia_inicial = new Date(POST.data_inicial);
						var dia_final = new Date(POST.data_final);



						console.log('dia_inicial: '+dia_inicial);
						console.log('dia_final: ' + dia_final);


						console.log('dia_inicial.getDate: '+dia_inicial.getDate());

						dia_inicial_timestamp = Math.floor(dia_inicial.getTime()/1000);
						dia_final.setDate(dia_final.getDate() + 1);
						dia_final_timestamp = Math.floor(dia_final.getTime()/1000);

						console.log('dia_inicial_timestamp:' + dia_inicial_timestamp);
						console.log('dia_final_timestamp:' + dia_final_timestamp);




						entradasUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),timestamp:{$gte:dia_inicial_timestamp,$lt:dia_final_timestamp}},function(err,data_entradas){
							var acertos = 0;
							var dia;

							console.log('--------------------- data_entradas ----------------');
							console.log(data_entradas);
							console.log('----------------------------------------------------');


							var dias = [];
							var vitorias = [];


							if(data_entradas.length>0){

								for(i=0;i<data_entradas.length;i++){

									data_t =  new Date(data_entradas[i].timestamp * 1000);

									dia = data_t.getDate();
									mes = data_t.getMonth() + 1;

									dia_mes = dia + '/' + mes;
									dias.push(dia_mes);
									vitorias.push(data_entradas[i].vitoria);

									if(data_entradas[i].vitoria == true){
										acertos++;
									}
								}

								var current = null;
								var cnt = 0;
								var acertos_grafico = 0;

								var data_grafico = {
									dias:[],
									operacoes:[],
									acertos:[]
								};


								for(var i=0 ; i< dias.length; i++){
									if(dias[i] != current){
										if(cnt>0){
											data_grafico.dias.push(current);
											data_grafico.operacoes.push(cnt);
											data_grafico.acertos.push(acertos_grafico);

										}
										current = dias[i];
										cnt = 1;
										if(vitorias[i]==true){
											acertos_grafico = 1;
										}else{
											acertos_grafico = 0;
										}

									} else {
										cnt++;
										if(vitorias[i]==true){
											acertos_grafico++;
										}
									}

								}

								if(cnt>0){
									data_grafico.dias.push(current);
									data_grafico.operacoes.push(cnt);
									data_grafico.acertos.push(acertos_grafico);
								}

								maior_valor = 0;
								console.log('estou aqui no maior_valor');

								for(i=0;i < data_grafico.operacoes.length;i++){
									if(data_grafico.operacoes[i] > maior_valor){
										maior_valor = data_grafico.operacoes[i];
									}
									console.log('estou dentro das operaçoes');
									console.log('i:'+i);
								}

								console.log('maior_valor:' + maior_valor);

								if(maior_valor % 2 == 0){
									maior_valor = maior_valor + 4;
								}else{
									maior_valor = maior_valor + 5;
								}

								data.maior_valor = maior_valor;
								data.grafico = data_grafico;
								data.acertividade = {total_operacoes:data_entradas.length,total_acertos:acertos};
							}else{
								data.grafico = {dias:[0],operacoes:[0],acertos:[0]}
								data.acertividade = {total_operacoes:0,total_acertos:acertos};
								data.maior_valor = 0;
							}


							console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHH Histórico HHHHHHHHHHHHHHHHHHHHHHHH');
							console.log(data);
							console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');


							res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'historico/grafico', data: data, usuario: req.session.usuario});
						}).sort({'timestamp':1});

					}else{
						res.json({error:'data_final_menor',element:'input[name="data_final"]',texto:'*Data Final não pode ser menor que a Data Inicial!'});
					}

				}else{
					res.json({error:'data_final_maior_hoje',element:'input[name="data_final"]',texto:'*Data Final não poder ser maior que hoje!'});
				}

			}else{
				res.json({error:'data_inicial_maior_hoje',element:'input[name="data_inicial"]',texto:'*Data Inicial não poder ser maior que hoje!'});
			}

		}else{
			res.json({error:'data_final_vazia',element:'input[name="data_final"]',texto:'*Data Final não pode ser vazia'});
		}

	}else{
		res.json({error:'data_inicial_vazia',element:'input[name="data_inicial"]',texto:'*Data Inicial não pode ser vazia'});
	}


});



module.exports = router;