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
		}



		]).exec(function(err,data_usuario){

			data[req.session.usuario.id + '_usuario_c'] = data_usuario;


			console.log('----------------- contas data ------------------');
			console.log(data);
			console.log('------------------------------------------------');




			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'contas/contas', data: data, usuario: req.session.usuario});
		});

	}




});


module.exports = router;