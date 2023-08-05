let mysql = require('mysql')

module.exports = function database(database_config, params){
    let con = mysql.createConnection({
		host: database_config.host,
		user: database_config.user,
		password: database_config.password,
		database: database_config.database,
		multipleStatements: true
	});
	let sql_result = "hello friend!"

    return new Promise(function(resolve, reject){
        try{
            con.connect(function(err) {
				if (err) {
                    console.error('err1--> ', err)
					resolve(null)
				} else {
                    if(params){
                        con.query(database_config.sql, params, function (err, result, fields) {
                            if (err) {
                                console.error('err2a--> ', err)
					            resolve(null)
                            } else {
                                resolve(result)
                                con.end()
                            }                            
                        })
                    } else {
                        con.query(database_config.sql, function (err, result, fields) {
                            if (err) {
                                console.error('err2b--> ', err, database_config.sql)
					            resolve(null)
                            } else {
                                resolve(result)
                                con.end()
                            } 
                        })
                    }	
                }
            })            
        } catch(err){
			console.error('err0--> ', err)
            resolve(null)
		}
    })
}