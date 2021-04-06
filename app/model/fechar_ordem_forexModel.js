var mongoose = require('mongoose');

const fecharOrdemForexSchema = new mongoose.Schema({
	fechar:Boolean,
	id_entrada_trader:mongoose.Types.ObjectId,
	data_cadastro:Date
});

module.exports = mongoose.model('fechar_ordem_forex', fecharOrdemForexSchema,'fechar_ordem_forex');