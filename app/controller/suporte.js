// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

const mongoose = require('mongoose');

const usuarioModel = require('../model/usuariosModel.js');


router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 4;
	console.log('MMmmMMMmMMMmMMMMMM Meus Dados MMMMMmmMMmMMMMM');
	console.log(data);
	console.log('MMmmMMMmMMMmMMMMMMmmmmmmmmmMMMMMmmMmMmMMMMmMM');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'suporte/suporte', data: data, usuario: req.session.usuario});
});



router.post('/alterar-senha', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR alterar-senha JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	if(POST.senha_atual != ''){
		if(POST.nova_senha != ''){
			if(POST.repetir_nova_senha != ''){

				var verificarSenhaAtual =  control.Encrypt(POST.senha_atual);

				console.log('------------------------- verificarSenhaAtual ---------');
				console.log(verificarSenhaAtual);
				console.log('--------------------------------------------------------');

				usuarioModel.findOne({'_id':mongoose.Types.ObjectId(req.session.usuario.id),'senha':verificarSenhaAtual},function(err,data_usuario){
					
					if(data_usuario != null){

						if(POST.nova_senha == POST.repetir_nova_senha){

							var novaSenhaCriptografa = control.Encrypt(POST.nova_senha);

							usuarioModel.findOneAndUpdate({'_id':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'senha':novaSenhaCriptografa}},function(err){
								if (err) {
									return handleError(err);
								}else{
									res.json(data);
								}
							});


						}else{
							res.json({error:'repetir_nova_senha',element:'input[name="repetir_nova_senha"]',texto:'*Por-favor repetir corretamente a nova senha!'});
						}
					}else{
						res.json({error:'senha_atual_errada',element:'input[name="senha_atual"]',texto:'*Senha atual não confere!'});
					}

				});
			}else{
				res.json({error:'repetir_senha_vazia',element:'input[name="repetir_nova_senha"]',texto:'*Por-favor repetir a nova senha!'});
			}	
		}else{
			res.json({error:'nova_senha_vazia',element:'input[name="nova_senha"]',texto:'*Nova senha não pode ser vazia!'});
		}

	}else{
		res.json({error:'senha_atual_vazia',element:'input[name="senha_atual"]',texto:'*Senha atual não pode ser vazia!'});
	}


});


module.exports = router;
