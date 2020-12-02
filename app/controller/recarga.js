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
var configuracoes_sistema = require('../model/configuracoes_sistemaModel.js');



router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 5;

	licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){
		console.log('achei o documento? q');
		console.log(data_licenca);

		configuracoes_sistema.find({},function(err,data_configuracoes){

			if(data_configuracoes != null){
				data.config_sistema = data_configuracoes;
			}else{
				data.config_sistema = {possui_creditos:true};
			}

			if(data_licenca != null){
				data[req.session.usuario.id + '_licenca_user'] = data_licenca;
				/*Calcular quantos dias faltam para a licença expirar*/
				hoje = new Date();
				data_fim = data_licenca.data_fim;
				console.log('data_fim: '+data_fim);
				console.log('hoje: '+hoje);
				data_fim.setDate(data_fim.getDate() + 1);
				console.log('data_fim: '+data_fim);
				diferencaData = data_fim - hoje;
				console.log('diferencaData: ' + diferencaData);
				dias_faltantes = Math.floor(diferencaData / (1000 * 60 * 60 * 24)) + 1;

				data[req.session.usuario.id + '_licenca_user_dias'] = dias_faltantes;	
			}else{
				data[req.session.usuario.id + '_licenca_user'] = {creditos:0,licenca_user_dias:-1,status:1};
				data[req.session.usuario.id + '_licenca_user_dias'] = -1;
			}

			console.log('ddddddddddddddddddddddddddddddddd');
			console.log(data);
			console.log('ddddddddddddddddddddddddddddddddd');


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'recarga/recarga', data: data, usuario: req.session.usuario});
		});
	});

});

module.exports = router;
