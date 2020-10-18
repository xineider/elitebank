var mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	ip:String,
	method:String,
	rota:String,
	user_agent:String,
	deletado:Number,
	data_cadastro:Date
});

module.exports = mongoose.model('log', logSchema,'log');