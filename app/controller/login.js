// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();



app.use(require('express-is-ajax-request'));

const mongoose = require('mongoose');


/* Conexão Mongo Db*/

const uri = 'mongodb+srv://admin_87:GaluCuDt6WGUTR2w@cluster0.z4jia.azure.mongodb.net/e98m41?retryWrites=true&w=majority';

async function start(){
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});
}


const usuarioModel = require('../model/usuariosModel.js');



/* GET pagina de login. */
router.get('/', function(req, res, next) {
	if (typeof req.session.id_usuario != 'undefined' && req.session.id_usuario != 0) {
		res.redirect('/sistema');
	} else {
		res.render('login/index', {});
	}
});


/* POST enviando o login para verificação. */
router.post('/', function(req, res, next) {
	// Recebendo o valor do post
	POST = req.body;
	POST.senha = control.Encrypt(POST.senha);
	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();
	console.log('NNNNNNNNNNNNNN POST LOGIN NNNNNNN');
	console.log(POST);
	console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');

	start();

	usuarioModel.findOne({'email':POST.email,'senha':POST.senha},function(err,data){
		if(data != null){
			req.session.usuario = {};
			req.session.usuario.id = data['_id'];
			req.session.usuario.nivel = data['nivel'];
			req.session.usuario.nome = data['nome'];
			console.log('req.session.usuario');
			console.log(req.session.usuario);
			res.redirect('/sistema');
		}else{
			console.log('estou caindo aqui no erro do login ou senha incorreto');
			res.render('login/index', { erro: 'Login ou senha incorreto(s).', tipo_erro: 'login' });
		}

	});


	// model.Login(POST).then(data => {
	// 	if (data.length > 0) {
	// 		req.session.usuario = {};
	// 		req.session.usuario.id = data[0].id;
	// 		req.session.usuario.hash_login = data[0].hash_login;
	// 		req.session.usuario.nivel = data[0].nivel;
	// 		req.session.usuario.nome = data[0].nome;
	// 		res.redirect('/sistema');
	// 	} else {
	// 		res.render('login/index', { erro: 'Login ou senha incorreto(s).', tipo_erro: 'login' });
	// 	}
	// });
});

/* GET pagina de login. */
router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		console.log(err);
	});
	res.render('login/index', {});
});



router.post('/recuperar/senha', function(req, res, next) {

	POST = req.body;

	console.log('RECUPERAR SENHA @@@@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
	start();

	usuarioModel.findOne({'email':POST.email},function(err,data){
		console.log('usuario find model');
		if(data != null){
			nova_senha = Math.random().toString(36).substring(5);

			var novaSenhaCriptografa = control.Encrypt(nova_senha);

			console.log('nova_senha: '+nova_senha);
			console.log('novaSenhaCriptografa: ' +novaSenhaCriptografa);

			usuarioModel.findOneAndUpdate({'email':POST.email},{'$set':{'senha':novaSenhaCriptografa}},function(err){
				if (err) {
					return handleError(err);
				}else{

					var html = "<div style='background:965da4;background: linear-gradient(135deg, #59a7ab 0%,#965da4 98%);width:100%;'>\
					<div style='margin:0px auto; max-width:600px;padding: 40px 0px;'>\
					<div style='background:#ffffff;width:100%;height:140px; padding:20px; text-align:center;color:#ffffff;width:100%;'>\
					<img style='max-width:280px;' src='http://copyelitebank.com.br/public/images/logo_elite.png'>\
					</div>\
					<div style='background: #f3f2ee;color:#8a8d93;width:100%;padding:20px;'>"+
					"Olá, você está recebendo este e-mail pois pediu para recuperar sua senha."+
					"<br>Sua nova senha no Elite Bank é: "+nova_senha+
					"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram."+
					'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
					'</div>'+
					'<div style="width:100%;height:20px; padding:10px 20px;color:#8a8d93;width:100%;font-size:14px;background:#f3f2ee">\
					* Não responda esta mensagem, ela é enviada automaticamente.'+
					'</div>\
					</div>\
					</div>';
					var text = "Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
					"<br>Sua nova senha no Elite Bank é: "+nova_senha+
					"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram"+
					'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
					'<br>* Não responda esta mensagem, ela é enviada automaticamente.';

					control.SendMail(POST.email, 'Recuperação de Senha - Elite Bank',text,html);				
					res.json(data);
				}
			});

		}else{
			res.json(['email_nao_cadastrado']);
		}

	});
});


module.exports = router;