var mongoose = require('mongoose');

const sessaoStatusSchema = new mongoose.Schema({
	max_clientes_servidor:Number,
	quantidade_usuarios:Number,
	sessao_iniciada:Boolean,
	tipo_sessao:String
});

module.exports = mongoose.model('sessao_status', sessaoStatusSchema,'sessao_status'); 