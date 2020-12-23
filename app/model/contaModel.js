var mongoose = require('mongoose');

const contaSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	tipo: String,
	email: String,
	senha:String,
	conta_real:Boolean,
	tipo_banca:String,
	valor_entrada:Number,
	limite_perda: Number,
	acao:String,
	status:String,
	stop_gain:Number,
	deletado:Number,
	data_cadastro:Date
});


module.exports = mongoose.model('usuario_conta', contaSchema,'usuario_conta'); 