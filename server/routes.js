var express = require("express")
var bodyParser = require('body-parser')
var path = require("path")
var router = express.Router()

var products = require('./var/home').PRODUCTS
var market = require('./var/home').MARKET
var profiles = require('./var/home').PROFILES
var donations = require('./var/home').DONATIONS
var slot_prises = require('./var/home').SLOT_PRIZES
var race_rabbits = require('./var/home').RACE_RABBITS
var keno_prizes = require('./var/home').KENO_PRIZES
var contact = require('./var/home').CONTACT
var currencies = require('./var/home').CURRENCIES
var career = require('./var/career').CAREER_ARRAY
var questions = require('./var/questions').QUESTION_ARRAY
const { sendEmail } = require("./utils/mail")

var jsonParser = bodyParser.json() 
router.use(express.static(path.resolve(__dirname, '../client/build')))
router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

router.post("/api/home", jsonParser, (req, res, next) => {  
  let payload = {products, market, currencies, profiles, donations, career, questions, slot_prises, race_rabbits, keno_prizes, contact}
  res.send(JSON.stringify(payload))
})
router.post("/api/contact", jsonParser, (req, res, next) => {
  sendEmail('contact', req.body).then(function(){
    try{
      res.send({send: "email_send"})
    }catch(e){
      console.log('[error]','contact--> ', e)
      res.send({send: "email_no_send"})
    }
  }) 
})

module.exports = router