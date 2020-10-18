var mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
	nome: String,
	email:String,
	senha:String,
	nivel: Number
});

module.exports = mongoose.model('Usuarios', usuarioSchema,'usuarios');