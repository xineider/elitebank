// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
// var MeusDadosModel = require('../model/minhaContaModel.js');
// var model = new MeusDadosModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data.numero_menu = 2;
	console.log('MMmmMMMmMMMmMMMMMM Meus Dados MMMMMmmMMmMMMMM');
	console.log(data);
	console.log('MMmmMMMmMMMmMMMMMMmmmmmmmmmMMMMMmmMmMmMMMMmMM');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'minha_conta/minha_conta', data: data, usuario: req.session.usuario});
});



// router.get('/alterar-senha', function(req, res, next) {
// 	model.GetPrimeiroAporte(req.session.usuario.id).then(data_primeiro_aporte=>{
// 		data.primeiro_aporte = data_primeiro_aporte;
// 		model.GetValorSaldoAtualizado(req.session.usuario.id).then(data_saldo_atualizado =>{
// 			data.saldo_atualizado = data_saldo_atualizado;
// 			model.GetPlanoUsuario(req.session.usuario.id).then(data_plano=>{
// 				data.plano = data_plano;
// 				model.GetUsuario(req.session.usuario.id).then(data_usuario =>{
// 					data.usuario = data_usuario;
// 					data.link_sistema = '/sistema';
// 					data.numero_menu = 3;
// 					console.log('MMmmMMMmMMMmMMMMMM Meus Dados MMMMMmmMMmMMMMM');
// 					console.log(data);
// 					console.log('MMmmMMMmMMMmMMMMMMmmmmmmmmmMMMMMmmMmMmMMMMmMM');
// 					res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'meus_dados/alterar_senha', data: data, usuario: req.session.usuario});
// 				});
// 			});
// 		});
// 	});
// });




// router.get('/conta_bancaria/editar/:id', function(req, res, next) {
// 	var id = req.params.id;

// 	model.GetPrimeiroAporte(req.session.usuario.id).then(data_primeiro_aporte=>{
// 		data.primeiro_aporte = data_primeiro_aporte;
// 		model.GetValorSaldoAtualizado(req.session.usuario.id).then(data_saldo_atualizado =>{
// 			data.saldo_atualizado = data_saldo_atualizado;
// 			model.GetPlanoUsuario(req.session.usuario.id).then(data_plano=>{
// 				data.plano = data_plano;
// 				model.GetUsuario(req.session.usuario.id).then(data_usuario =>{
// 					data.usuario = data_usuario;
// 					model.GetBancos().then(data_bancos=>{
// 						data.bancos = data_bancos;
// 						model.GetPadraoContaBancaria(req.session.usuario.id).then(data_tem_padrao =>{
// 							data.tem_padrao = data_tem_padrao;
// 							model.SelecionarContaBancaria(id).then(data_conta_bancaria =>{
// 								data.conta_bancaria = data_conta_bancaria;
// 								data.link_sistema = '/sistema';
// 								data.numero_menu = 3;
// 								console.log('BBBBBbbbbb ADICIONAR CONTA BANCÁRIA BbbbBBbbBbbb');
// 								console.log(data);
// 								console.log('BBBBBBBBBbBbbbbbbbBBbBbbbbbbBBbbBbBbbbbbBBBBBbbB');
// 								res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'meus_dados/editar_conta_bancaria', data: data, usuario: req.session.usuario});
// 							});
// 						});
// 					});
// 				});
// 			});
// 		});
// 	});
// });


// router.post('/atualizar/', function(req, res, next) {
// 	POST = req.body;
// 	POST.id = req.session.usuario.id; 
// 	console.log('estou no atualizar meus dados');
// 	console.log(POST);
// 	console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
// 	console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

// 	var html = "Olá você alterou o seu email no Moon. Os dados continuam os mesmos."+
// 	"<br><br>Caso não tenha sido você por-favor entrar em contato com o suporte."
// 	"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
// 	"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

// 	var text = "Olá você alterou o seu email no Moon. Os dados continuam os mesmos."+
// 	"<br><br>Caso não tenha sido você por-favor entrar em contato com o suporte."
// 	"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
// 	"<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";

// 	model.VerificarSeTemMesmoEmail(POST).then(tem_mesmo_email => {

// 		console.log('eeeeeeeeeeeeee tem mesmo email eeeeeeeeeeeeeeeeeeeeeeee');
// 		console.log(tem_mesmo_email);
// 		console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
// 		if(tem_mesmo_email != ''){
// 			model.AtualizarUsuario(POST).then(data => {
// 				res.json(data);
// 			});
// 		}else{
// 			/*Se o e-mail foi alterado verificar se ele está disponivel(unico)*/
// 			model.VerificarSeTemEmailDisponivel(POST.email).then(tem_email => {
// 				if(tem_email == ''){
// 					model.AtualizarUsuario(POST).then(data => {
// 						control.SendMail(POST.email, 'E-mail alterado no Moon!', html, text);
// 						res.json(data);
// 					});
// 				}else{
// 					res.json({error:'possui_email',element:'input[name="email"]',texto:'Esse e-mail já está sendo usado, por-favor utilizar outro, ou entre em contato com o suporte!'});
// 				}
// 			});
// 		}
// 	});
// });

module.exports = router;
