var express = require("express")
var bodyParser = require('body-parser')
var path = require("path")
var router = express.Router()

var products = require('./var/home').PRODUCTS
var market = require('./var/home').MARKET
var profiles = require('./var/home').PROFILES
var donations = require('./var/home').DONATIONS
var race_rabbits = require('./var/home').RACE_RABBITS
var keno_prizes = require('./var/home').KENO_PRIZES
var contact = require('./var/home').CONTACT
var finances = require('./var/home').FINANCES
var career = require('./var/career').CAREER_ARRAY
var questions = require('./var/questions').QUESTION_ARRAY
const { sendEmail } = require("./utils/mail")
const { get_exchangerate, filterRates } = require("./utils/other")

var constants = require('./var/constants')
var database_config = constants.DATABASE[0]

const database = require('./database/mysql')

var jsonParser = bodyParser.json({ limit: '50mb' });
router.use(express.static(path.resolve(__dirname, '../client/build')))

router.post("/api/home", jsonParser, (req, res, next) => {
  let payload = {products, market, finances, profiles, donations, career, questions, race_rabbits, keno_prizes, contact}
  res.send(JSON.stringify(payload))
})

router.post("/api/contact", jsonParser, (req, res, next) => {
  sendEmail('contact', req.body).then((data)=>{
    try{
      res.send(data)
    }catch(e){
      console.log('[error]','contact--> ', e)
      res.send({send: "email_no_send"})
    }
  }) 
})

router.post("/api/exchange_rates", jsonParser, (req, res, next) => {
  get_exchangerate().then((e)=>{
    if(e && e.data && e.data.conversion_rates){ //base_code: 'USD'
      const allowedCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'RON']
      const filteredRates = filterRates(e.data.conversion_rates, allowedCurrencies)
      res.send({conversion_rates: filteredRates})
    } else {
      res.send({conversion_rates: {}})
    }
  })  
})

router.post("/api/payment", jsonParser, (req, res, next) => {
  let payload = {success: true}
  res.send(JSON.stringify(payload))
})

router.post("/api/verify-email", jsonParser, (req, res, next) => {
  
  // 2: "no_token",
  // 3: "error_during_verification",
  // 4: "invalid_expired_token",
  // 5: "email_verify_success"
  // 6: "email_already_verified"

  const { token } = req.body
  if(token){
    try{
      database_config.sql = 'SELECT * FROM casino_user WHERE verification_token = "' + token + '"'
      database_config.name = "db0001"
      database(database_config).then((result)=>{
        if(result && result.length > 0){
          if(result[0].is_verified){
            //email_already_verified
            res.send({success: true, send: 6})
          } else {
            //email_verify_success
            res.send({success: true, send: 5})

            // update is_verified to 1
            database_config.sql = 'UPDATE casino_user SET is_verified=1 WHERE verification_token = "' + token + '"'
            database_config.name = "db0002"
            database(database_config).then(()=>{})
          }
        } else {
          console.log('[error]','verify-email-invalid_expired_token--> ', token)
          res.send({error: true, send: 4}) //invalid_expired_token
        }
      })
    }catch(e){
      console.log('[error]','verify-email-error_during_verification--> ', e)
      res.send({error: true, send: 3}) //error_during_verification
    }
  } else {
    console.log('[error]','verify-email-/no_token--> ', token)
    res.send({error: true, send: 2}) //no_token
  }
})

router.post("/api/apply_job", jsonParser, (req, res, next) => {
  sendEmail('apply_job', req.body).then((data)=>{
    try{
      res.send(data)
    }catch(e){
      console.log('[error]','apply_job--> ', e)
      res.send({send: "email_no_send"})
    }
  }) 
})

router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

module.exports = router