'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;


const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin_31:oISXYAfObTGOV2Nr@cluster0.0qs95.mongodb.net/iq?retryWrites=true&w=majority';

async function start(){
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});
}

const Schema = new mongoose.Schema({nome: String});

const usuarios = mongoose.model('Usuarios', Schema,'usuarios'); 


class MongoModel {

	Login(POST) {
		usuarios.findOne({'email':POST.email,'senha':POST.senha},function(err,data){
			return data;
		});
	}


	PesquisarEmail(email) {
		return new Promise(function(resolve, reject) {
			/*seleciono o id para ver se existe algum usuario com aquele email*/
			helper.Query('SELECT id	FROM usuarios WHERE email = ? AND deletado = ? LIMIT 1',[email,0]).then(data => {
				resolve(data);
			});
		});
	}


	AlterarSenhaUsuarioPorId(POST){
		return new Promise(function(resolve, reject) {
			POST.senha = helper.Encrypt(POST.senha);
			helper.Update('usuarios', POST).then(data => {
				resolve(data);
			});
		});
	}




}
module.exports = MongoModel;
