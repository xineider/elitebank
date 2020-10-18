var mongoose = require('mongoose');

const licencaSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	data_fim: Date,creditos:Number
});

module.exports = mongoose.model('licenca', licencaSchema,'licenca');