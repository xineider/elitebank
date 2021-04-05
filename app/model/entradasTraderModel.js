var mongoose = require('mongoose');

const entradasTraderSchema = new mongoose.Schema({
	par:String,
	direcao:String,
	tipo:String,
	expiracao:Number,
	timestamp:Number,
	limitar_entrada:Boolean,
	valor_maximo:Number,
	fechar:Boolean,
	multiplicador:Number
});

module.exports = mongoose.model('entradas_trader', entradasTraderSchema,'entradas_trader');