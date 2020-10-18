var mongoose = require('mongoose');

const conexaoTesteUserSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	email:String,
	senha:String,
	deletado:Number,
	status:String,
	data_cadastro:Date
});

module.exports = mongoose.model('conexao_teste', conexaoTesteUserSchema,'conexao_teste'); 