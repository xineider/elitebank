var mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
	nome:String,
	tipo:String,
	cliente:String,
	dias_garantia:Number,
	codigo:String,
	codigo_plano:String,
	quantidade:Number,
	deletado:Number
});

module.exports = mongoose.model('produto', produtoSchema,'produto'); 