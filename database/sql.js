const sqlite3 = require('sqlite3').verbose();

module.exports = function database(sql, payload=[], x){
    const db = new sqlite3.Database('./database/bunny_bet_casino.db', sqlite3.OPEN_READWRITE, (err)=>{
        if(err){
            return console.log(err)
        }
        //console.log('connected successfully-----------------------------------')
    });

	return new Promise(function(resolve, reject){
        //console.log('sql-----> ', sql, payload, x)
		db.all(sql, payload, function(err, data){
                if(err){
                    console.log('sql-error ', x, err)
                    return resolve(false);
                }
                resolve(data);
            }
        )
        db.close((err)=>{
            if(err) return console.error(err.message)
        }) 
	});		
}

