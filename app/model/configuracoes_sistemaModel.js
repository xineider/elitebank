var mongoose = require('mongoose');

const configuracoesSchema = new mongoose.Schema({
	possui_creditos:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('configuracoes_sistema', configuracoesSchema,'configuracoes_sistema'); 