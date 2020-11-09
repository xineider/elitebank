var mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
	nome:String,
	email:String,
	codigo_produto:String,
	status:String,
	data_atualizacao:Date,
	valor:Number,
	processado:Boolean,
	cancelado:Boolean,
	deletado:Number
});

module.exports = mongoose.model('pagamento', pagamentoSchema,'pagamento'); 