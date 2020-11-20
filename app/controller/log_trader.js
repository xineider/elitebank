// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));
const mongoose = require('mongoose');

/*Mensagem*/

const mensagemUser = require('../model/mensagemModel.js')

/* GET pagina de login. */

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 6;
	console.log('log trader');
	console.log('req.session.usuario');
	console.log(req.session.usuario);
	mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_mensagem){
		data.mensagem = data_mensagem;

		arrayMensagemData = [];

		if(data_mensagem.length > 0){

			for(i=0;i<data_mensagem.length;i++){
				console.log('data_mensagem[i].data_registro: ' + data_mensagem[i].data_registro);
				console.log('data_mensagem[i].data_registro.getDate(): ' + data_mensagem[i].data_registro.getDate());
				console.log('data_mensagem[i].data_registro.getMonth(): ' + data_mensagem[i].data_registro.getMonth() + 1);
				console.log('data_mensagem[i].data_registro.getYear(): ' + data_mensagem[i].data_registro.getYear());



				dia_mensagem = data_mensagem[i].data_registro.getDate();

				if(dia_mensagem > 0 && dia_mensagem < 10){
					dia_mensagem = "0" + dia_mensagem;
				}

				mes_mensagem = data_mensagem[i].data_registro.getMonth() + 1;
				if(mes_mensagem > 0 && mes_mensagem < 10){
					mes_mensagem = "0" + mes_mensagem;
				}

				ano_mensagem = data_mensagem[i].data_registro.getFullYear();

				hora_mensagem = data_mensagem[i].data_registro.getHours();

				if(hora_mensagem >= 0 && hora_mensagem < 10){
					hora_mensagem = "0" + hora_mensagem;
				}

				minuto_mensagem = data_mensagem[i].data_registro.getMinutes();

				if(minuto_mensagem >= 0 && minuto_mensagem < 10){
					minuto_mensagem = "0" + minuto_mensagem;
				}

				segundo_mensagem = data_mensagem[i].data_registro.getSeconds();

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
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'logTrader/logTrader', data: data, usuario: req.session.usuario});
	});
});


module.exports = router;
