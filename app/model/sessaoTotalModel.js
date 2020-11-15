var mongoose = require('mongoose');

const sessaoTotalSchema = new mongoose.Schema({
	total_participantes_sessao:Number,
	total_usuarios_conectados:Number
});

module.exports = mongoose.model('sessao_total', sessaoTotalSchema,'sessao_total'); 