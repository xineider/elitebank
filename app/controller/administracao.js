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

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 7;

	licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){
		console.log('achei o documento? q');
		console.log(data_licenca);
		if(data_licenca != null){
			data.licenca_user = data_licenca;
		}else{
			data.licenca_user = {valor_credito:0,valor_licenca:0,status:1};
		}

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/administracao', data: data, usuario: req.session.usuario});
	});

});

module.exports = router;
