module.exports = function database(database_config, params){
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: database_config.host,
		user: database_config.user,
		password: database_config.password,
		database: database_config.database
	});
	var sql_result	
	return new Promise(function(resolve, reject){
		try{
			con.connect(function(err) {
				if (err) {
					throw err;
				}
				if(params){
					con.query(database_config.sql, params, function (err, result, fields) {
						if (err) {
							throw err;
						}			
						sql_result = result;
						resolve(sql_result);
						con.end();
					});
				} else {
					con.query(database_config.sql, function (err, result, fields) {
						if (err) {
							throw err;
						}			
						sql_result = result;
						resolve(sql_result);
						con.end();
					});	
				}	
			}); 
		} catch(err){
			console.error('err--> ' + err);
		}
	});		
}