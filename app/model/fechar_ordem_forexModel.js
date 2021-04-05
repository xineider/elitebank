var mongoose = require('mongoose');

const fecharOrdemForexSchema = new mongoose.Schema({
	fechar:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('fechar_ordem_forex', fecharOrdemForexSchema,'fechar_ordem_forex');