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
	console.log(req.session.usuario);
	mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_mensagem){
		data.mensagem = data_mensagem;
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'logTrader/logTrader', data: data, usuario: req.session.usuario});
	});
});


module.exports = router;
