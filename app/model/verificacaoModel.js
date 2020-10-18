'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class VerificacaoModel {
	VerificarUsuario(id, hash) {
		return new Promise(function(resolve, reject) {
			console.log([id, hash]);
			helper.Query('SELECT id FROM usuarios WHERE id = ? AND hash_login = ?', [id, hash]).then(data => {
				resolve(data);
			});
		});
	}
}
module.exports = VerificacaoModel;
