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

var jsonParser = bodyParser.json() 
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

router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

module.exports = router