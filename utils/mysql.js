module.exports = function database(database_config){
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: database_config.host,
		user: database_config.user,
		password: database_config.password,
		database: database_config.database
	});
	var sql_result
	return new Promise(function(resolve, reject){
		con.connect(function(err) {
			if (err) {
				console.log('err1--> ', err);
				throw err;
			}
			con.query(database_config.sql, function (err, result, fields) {
				if (err) {
					console.log('err2--> ', err, database_config.sql);
					throw err;
				}			
				sql_result = result;
				resolve(sql_result);
				con.end();
			});			
		}); 
	});		
}