var mongoose = require('mongoose');

const traderLimiteSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	limite_usuarios:Number,
	limite_liquidez:Number,
	deletado:Number,
	data_cadastro:Date,
});

module.exports = mongoose.model('trader_limite', traderLimiteSchema,'trader_limite'); 