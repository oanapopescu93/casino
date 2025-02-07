var express = require("express")
var bodyParser = require('body-parser')
var withdrawPayment = express.Router()

var jsonParser = bodyParser.json()

var constants = require('../var//constants')
var database_config = constants.DATABASE[0]
const database = require('../database/mysql')
const { sendEmail } = require("../utils/mail")

withdrawPayment.post("/api/withdraw", jsonParser, (req, res, next) => {
    const { uuid, name, email, phone, country, city, iban, amount, currency } = req.body    

    if(!uuid && !iban){
        return res.json({ type: "withdraw", result: "error", payload: 'error_charge' })
    } 
    
    if(!amount){
        return res.json({ type: "withdraw", result: "error", payload: 'no_money' })
    }
    
    if(!currency){
        return res.json({ type: "withdraw", result: "error", payload: 'no_currency' })
    }

    if(!name || !email || !phone || !country || !city){
        return res.json({ type: "withdraw", result: "error", payload: 'no_data' })
    }

    // processing withdraw
    database_config.sql = "SELECT * FROM casino_user;"
    database_config.name = "db0001"
    database(database_config).then((result)=>{
      if(result){        
        let users_array = result
        if(users_array && users_array.length > 0){
          let user_found = users_array.filter((x) => x.uuid === uuid)
          if(user_found[0]){
            let id = user_found[0].id
            let timestamp = new Date().getTime()

            let payload = [
                id,               
                amount, 
                currency, 
                name, 
                phone, 
                email, 
                country, 
                city, 
                iban,
                timestamp, 
            ]
            database_config.sql = "INSERT INTO withdraw_table (user_id, amount, currency, name, phone, email, country, city, iban, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            
            database(database_config, payload).then(()=>{
                let payload_email = {...req.body, id}
                sendEmail('withdraw', payload_email).then((data)=>{
                  try{                    
                    return res.json({ type: "withdraw", result: "success", payload: data.send })
                  }catch(e){
                    console.log('[error]','withdraw--> ', e)
                    return res.json({ type: "withdraw", result: "error", payload: 'withdraw_failed' })
                  }
                }) 
            })
          }
        }
      }
    })
})

module.exports = withdrawPayment