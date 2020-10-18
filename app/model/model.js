'use strict';
var crypto = require('crypto');

// FAZER LEITURA DAS CONFIGURAÇÕES
// var config = {
// 						    "host"     : "localhost",
// 						    "user"     : "root",
// 						    "password" : "root",
// 						    "database" : "moon"
// 					  	};
// var config = {
// 						    "host"     : "us-cdbr-east-02.cleardb.com",
// 						    "user"     : "b585fdb2cc2803",
// 						    "password" : "fe679b25",
// 						    "database" : "heroku_a407b8b9b5c0bf5"
// 					  	};

// // CONEXÃO MYSQL
// var mysql      = require('mysql');
// var connection;

// function handleDisconnect() {
//   connection = mysql.createConnection(config); // Recreate the connection, since
//                                                   // the old one cannot be reused.

//   connection.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   connection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
// }

// handleDisconnect();

// var connection = mysql.createConnection(config['mysql']);
// connection.connect();
var query = '';
var array = [];

class Helper {
	// Retorne o parametro encriptado;
	Encrypt(str) {
	  return crypto.createHash('md5').update('558874c2cac326fc5e331c4a5a6dddce'+str+'706eb043788d92a44a2308146256c1bd').digest("hex");
	}
	Config() {
		return config;
	}
	Unserialize(data) {
		var array = [];
		data = data.split('&');
		for (var i = data.length - 1; i >= 0; i--) {
			var array_pre = [];
			array_pre = data[i].split('=');
			array[array_pre[0]] = array_pre[1];
		}
		return array;
	}
	Isset(data, tipo) {
		if (tipo == false) {
			if (data == undefined || data == 'undefined') {
				return true;
			} else {
				return false;
			}
		} else {
			if (data == undefined || data == 'undefined') {
				return false;
			} else {
				return true;
			}
		}
	}
	// Query(query, array) {
	// 	return new Promise(function(resolve, reject) {
	// 		// Adicione a query com scape(?) e os respectivos valores em um array simples
	// 		connection.query(query, array, function (error, results, fields) {
	// 		  if (error && query != '') console.log('ERROR SQL ------------- '+error+' ------------- SQL ERROR');
	// 		  resolve(results);

	// 		});
	// 	});
	// }
	// SelectById(table, id) {
	// 	return new Promise(function(resolve, reject) {
	// 		// Adicione a query com scape(?) e os respectivos valores em um array simples
	// 		connection.query('SELECT * FROM ' + table + ' WHERE deletado = ? AND id = ?' , [0, id], function (error, results, fields) {
	// 		  if (error && query != '') console.log('ERROR SQL ------------- '+error+' ------------- SQL ERROR');
	// 		  resolve(results);

	// 		});
	// 	});
	// }

	// PrepareDates(data, array) {
	// 	var data_nova = "";
	// 	for(var key in data) {
	// 		for(var key2 in array) {
	// 			if (array[key2] == key) {
	// 				var from = data[key].split("/");
	// 		    var d = new Date(from[2], from[1] - 1, from[0]);
	//         var month = '' + (d.getMonth() + 1);
	//         var day = '' + d.getDate();
	//         var year = d.getFullYear();

	// 		    if (month.length < 2) month = '0' + month;
	// 		    if (day.length < 2) day = '0' + day;

	// 		    data_nova = [year, month, day].join('-');
	// 				data[key] = data_nova;
	// 			}
	// 		}
	// 	}
	// 	return data;
	// }
	// PrepareMultiple(array, name_key, value_key) {
	// 	array[name_key] = [];
	// 	for (var key in array) {
	// 		for (var key2 in array[key]) {
	// 			array[name_key].push(value_key);
	// 		}
	// 		break;
	// 	}
	// 	return array;
	// }
	// InsertMultiple(table, data) {
	//   var names = '';
	//   var values = [];
	//   var values2 = '';
	//   var values_final = [];
	//   var array = [];
	//   var array_final = [];
 //  	for (var key in data) {
	//     names += ','+key;
	//   	for (var key2 in data[key]) {
	// 	    if (this.Isset(array[key2], false)) {
	//     		array[key2] = [];
	//     		values[key2] = [];
	// 	    }
	//     	values[key2].push('?');
	//     	array[key2].push(data[key][key2]);
	// 	  }
	//   }
	//   for (var key in values) {
	//   	values2 += ',(' + values[key].join() + ')';
	//   }
	//   for (var key in array) {
	//   	array_final = array_final.concat(array[key]);
	//   }
	//   values2 = values2.slice(1);
	//   names = names.slice(1);
	//   values_final = values2;
	// 	return new Promise(function(resolve, reject) {
	// 		// Adicione a query com scape(?) e os respectivos valores em um array simples
	// 		connection.query('INSERT INTO '+ table +' ('+ names +') VALUES '+ values_final +';', array_final, function (error, results, fields) {
	// 		  if (error){ console.log('ERROR SQL ------------- '+error+' ------------- SQL ERROR'); console.log(error.sqlMessages);}
	// 		  	// console.log(results);
	// 		  	resolve(results.insertId);
	// 		});
	// 	});
	// }
	// Insert(table, data) {
	//   var values = '';
	//   var names = '';
	//   var array = [];
	//   for (var key in data) {
	//     names += ','+key;
	//     values += ',?';
	//     array.push(data[key]);
	//   }
	//   names = names.slice(1);
	//   values = values.slice(1);
	// 	return new Promise(function(resolve, reject) {
	// 		// Adicione a query com scape(?) e os respectivos valores em um array simples
	// 		connection.query('INSERT INTO '+ table +' ('+ names +') VALUES ('+ values +')', array, function (error, results, fields) {
	// 		  if (error){ console.log('ERROR SQL ------------- '+error+' ------------- SQL ERROR'); console.log(error.sqlMessage);}
	// 		  	// console.log(results);
	// 		  	resolve(results.insertId);
	// 		});
	// 	});
	// }
	// UpdateMultiple(table, data) {
 //  	for (var key in data) {
	// 	  var names = '';
	// 	  var values2 = '';
	// 	  var values = [];
	// 	  var values_final = [];
	// 	  var array = [];
	// 	  var array_final = [];
	//     names += ','+key;
	//   	for (var key2 in data[key]) {
	// 	    if (key == 'id') {
	// 	    	var where = ' WHERE id = ' + data[key][key2] + ' AND deletado = 0';
	// 	    } else {
	// 		    if (this.Isset(array[key2], false)) {
	// 	    		array[key2] = [];
	// 	    		values[key2] = [];
	// 		    }
	// 	    	values[key2].push(' '+key + ' = ?');
	// 	    	array[key2].push(data[key][key2]);
	// 	    }
	// 	  }
	// 	  for (var key in values) {
	// 	  	values2 += ',' + values[key].join();
	// 	  }
	// 	  for (var key in array) {
	// 	  	array_final = array_final.concat(array[key]);
	// 	  }
	// 	  values2 = values2.slice(1);
	// 	  names = names.slice(1);
	// 	  values_final = values2;
	// 	  // Adicione a query com scape(?) e os respectivos valores em um array simples
	// 		connection.query('UPDATE '+ table +' SET ' + values + where, array, function (error, results, fields) {
	// 		  if (error && query != '') console.log('ERROR SQL ------------- '+error+' ------------- SQL ERROR');
	// 		  // console.log(results);
	// 		});
	//   }
	// 	return new Promise(function(resolve, reject) {
	// 		resolve('Ok');
	// 	});
	// }
	// Update(table, data) {
	// 	var values = '';
	// 	var array = [];
 //  	for (var key in data) {
 //  		if (key == 'id') {
	//     	var where = ' WHERE id = ' + data[key] + ' AND deletado = 0';
 //  		} else {
 //  			values += ','+key + '= ?';
 //  			array.push(data[key]);
 //  		}
	// 	}
	// 	if (data['id'] != undefined && data['id'] != null && data['id'] != '') {
	// 	  values = values.slice(1);
	// 		return new Promise(function(resolve, reject) {
	// 			// Adicione a query com scape(?) e os respectivos valores em um array simples
	// 			connection.query('UPDATE '+ table +' SET ' + values + where, array, function (error, results, fields) {
	// 			  if (error && query != '') console.log('ERROR SQL ------------- '+error+' ------------- SQL ERROR');
	// 			  resolve(results);

	// 			});
	// 		});
	// 	}
	// }
	// Desativar(table, data) {
	// 	return new Promise(function(resolve, reject) {
	// 		// Adicione a query com scape(?) e os respectivos valores em um array simples
	// 		connection.query('UPDATE '+ table + ' SET deletado = ? WHERE id = ?', [data.deletado, data.id], function (error, results, fields) {
	// 		  if (error && query != '') console.log('ERROR SQL ------------- '+error+' ------------- SQL ERROR');
	// 		  resolve(results);

	// 		});
	// 	});
	// }
	// Delete(table, whereData) {
	// 	return new Promise(function(resolve, reject) {
	// 		// Adicione a query com scape(?) e os respectivos valores em um array simples
	// 		connection.query('DELETE FROM '+ table + ' ' + where, array, function (error, results, fields) {
	// 		  if (error && query != '') console.log('ERROR SQL ------------- '+error+' ------------- SQL ERROR');
	// 		  resolve(results);

	// 		});
	// 	});
	// }
}
module.exports = Helper;