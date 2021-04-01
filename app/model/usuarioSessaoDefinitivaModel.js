var mongoose = require('mongoose');

const usuarioSessaoDefSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	servidor:String,
	data_registro:Date
});

module.exports = mongoose.model('usuario_sessao_definitiva', usuarioSessaoDefSchema,'usuario_sessao_definitiva'); 