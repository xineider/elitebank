var mongoose = require('mongoose');

const entradasSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	timestamp:Number,
	vitoria:Boolean,
	executada:Boolean,
	deletado:Number,
	data_captura:Date
});

module.exports = mongoose.model('entradas_cliente', entradasSchema,'entradas_cliente');