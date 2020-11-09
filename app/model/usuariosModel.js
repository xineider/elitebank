var mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
	_id:mongoose.Types.ObjectId,
	nome: String,
	email:String,
	senha:String,
	nivel: Number
});

module.exports = mongoose.model('Usuarios', usuarioSchema,'usuarios');