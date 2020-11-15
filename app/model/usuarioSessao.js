var mongoose = require('mongoose');

const usuarioSessaoSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	servidor:String
});

module.exports = mongoose.model('usuario_sessao', usuarioSessaoSchema,'usuario_sessao'); 