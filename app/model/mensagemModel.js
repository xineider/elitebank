var mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	tipo_mensagem:Number,
	descricao_mensagem:String,
	status:Number,
	deletado:Number,
	data_cadastro:Date
});

module.exports = mongoose.model('usuario_mensagem', mensagemSchema,'usuario_mensagem'); 