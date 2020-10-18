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


// async function start(){
// 	await mongoose.connect("mongodb://robocopy-db.mongo.cosmos.azure.com:10255/aw3e4w?ssl=true&replicaSet=globaldb", {
// 		auth: {
// 			user: 'robocopy-db',
// 			password: 'BLGNrJPVgg3YPyARjOhxvE2wktjdMDZkoX4BfjbNC8RaTl5w2AbuwkdPDVDfnAuNkVZzIdaro3qnFXRNHztu1Q=='
// 		},
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		retryWrites: false
// 	});
// }

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
			nova_senha = Math.random().toString(36).substring(7);

			var novaSenhaCriptografa = control.Encrypt(nova_senha);

			console.log('nova_senha: '+nova_senha);
			console.log('novaSenhaCriptografa: ' +novaSenhaCriptografa);

			usuarioModel.findOneAndUpdate({'email':POST.email},{'$set':{'senha':novaSenhaCriptografa}},function(err){
				if (err) {
					return handleError(err);
				}else{

					var html = "Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
					"<br>Sua nova senha no RoboCopy é: "+nova_senha+
					"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram"+
					'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
					'<br>Não responda esta mensagem, ela é enviada automaticamente.';
					var text = "Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
					"<br>Sua nova senha no RoboCopy é: "+nova_senha+
					"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram"+
					'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
					'<br>Não responda esta mensagem, ela é enviada automaticamente.';

					control.SendMail(POST.email, 'Recuperação de Senha - RoboCopy',text,html);				
					res.json(data);
				}
			});

		}else{
			res.json(['email_nao_cadastrado']);
		}

	});
});

	// model.PesquisarEmail(POST.email).then(idEmail => {
	// 	if(idEmail != ''){
	// 		nova_senha = Math.random().toString(36).substring(7);
	// 		data_insert = {id: idEmail[0].id, senha: nova_senha};
	// 		model.AlterarSenhaUsuarioPorId(data_insert).then(data_alterado_sucesso =>{
	// 			var html = "Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
	// 			"<br>Sua nova senha no Moon é: "+nova_senha+
	// 			"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo e-mail <a href='mailto:suporte@moon.com.br'>suporte@moon.com.br</a>"+
	// 			'<br><br>Não mostre seu login e senha para ninguém. A sua conta é responsabilidade sua.'+
	// 			'<br>Não responda esta mensagem, ela é enviada automaticamente.';
	// 			var text = "Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
	// 			"<br>Sua nova senha no Moon é: "+nova_senha+
	// 			"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo e-mail <a href='mailto:suporte@moon.com.br'>suporte@moon.com.br</a>"+
	// 			'<br><br>Não mostre seu login e senha para ninguém. A sua conta é responsabilidade sua.'+
	// 			'<br>Não responda esta mensagem, ela é enviada automaticamente.';
	// 			control.SendMail(POST.email, 'Recuperação de Senha - Moon',text,html);				
	// 			res.json(data_alterado_sucesso);
	// 		});

	// 	}else{
	// 		res.json(['email_nao_cadastrado']);
	// 	}
	// });










	module.exports = router;
