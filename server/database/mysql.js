let mysql = require('mysql')

module.exports = function database(database_config, params){
    let con = mysql.createConnection({
		host: database_config.host,
		user: database_config.user,
		password: database_config.password,
		database: database_config.database,
		multipleStatements: true
	})

    return new Promise((resolve, reject)=>{
        try{
            con.connect((err)=>{
				if (err) {
                    console.error('err1-connection_error--> ', err, database_config)
					resolve(null)
				} else {
                    if(params){
                        con.query(database_config.sql, params, (err, result, fields)=>{
                            if (err) {
                                console.error('err2a-query_error--> ', err, database_config)
					            resolve(null)
                            } else {
                                resolve(result)
                                con.end()
                            }
                        })
                    } else {
                        con.query(database_config.sql, (err, result, fields)=>{
                            if (err) {
                                console.error('err2b-query_error--> ', err, database_config)
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
			console.error('err0--> ', err, database_config)
            resolve(null)
		}
    })
}