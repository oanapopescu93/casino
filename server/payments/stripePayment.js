var express = require("express")
var bodyParser = require('body-parser')
var stripePayment = express.Router()

var jsonParser = bodyParser.json() 
// require('dotenv').config()
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const stripe = require('stripe')("sk_test_51Mdvu1CWq9uV6YuM2iH4wZdBXlSMfexDymB6hHwpmH3J9Dm7owHNBhq4l4wawzFV9dXL3xrYGbhO74oc8OeQn5uJ00It2XDg9U")
const MINIMUM_AMOUNT_USD = 50

stripePayment.post("/api/stripe", jsonParser, (req, res, next) => {
    const { name, email, country, city, phone, cardNumber, month, year, cvv, amount } = req.body

    if (!name || !email || !cardNumber || !month || !year || !cvv) {
        res.json({type: "stripe", result: "error", payload: 'error_charge'})
    }

    if(amount){
        if (amount < MINIMUM_AMOUNT_USD) {
            return res.json({type: "stripe", result: "error", payload: 'amount_too_low'})
        }
        
        let customer = null
        let customerInfo = {name, email, phone, description: "stripe customer", address: {country, city}}

        let card_token = null
        let card = null
        let cardInfo = {
            card: {
                number: cardNumber,
                exp_month: parseInt(month),
                exp_year: parseInt(year),
                cvc: cvv,
                name: name,
            },
        }

        let chargeInfo = {
          receipt_email: "oanapopescu93@gmail.com",
          amount: amount * 100,
          currency: 'usd',
          description: 'bunnybet',
        }

        try {
            // Create a new customer
            createNewCustomer(customerInfo).then(function(res1){ 
                if(res1){
                    customer = res1
                    // Create a card token
                    addNewCard(cardInfo).then(function(res2) {
                        if(res2){
                            card_token = res2
                            // Attach the card to the customer    
                            createSource(customer.id, card_token.id).then(function(res3) {
                                if(res3){
                                    card = res3
                                    chargeInfo.source = card.id
                                    chargeInfo.customer = customer.id
                                    // Create a charge
                                    createCharge(chargeInfo).then(function(res4) {
                                        res.json({type: "stripe", result: "success", payload: res4})
                                    })
                                } else {
                                    res.json({type: "stripe", result: "error", payload: 'createSource_error'})
                                }
                            })
                        } else {
                            res.json({type: "stripe", result: "error", payload: 'addNewCard_error'})
                        }
                    })
                } else {
                    res.json({type: "stripe", result: "error", payload: 'createNewCustomer_error'})
                }
            })
        } catch (error) {
            res.json({type: "stripe", result: "error", payload: 'error_charge', details: error})
        }        
    } else {
        res.json({type: "stripe", result: "error", payload: 'no_money'})
    }
})

module.exports = stripePayment

function createNewCustomer(data){
    // Create a new customer
    return new Promise(function(resolve, reject){
        stripe.customers.create(data).then(function(res){
            resolve(res)
        }).catch((err) => {            
            console.error('error-createNewCustomer--> ' + err)
            resolve(null)
        }) 
    })
}  
function addNewCard(data){
    // Create a card token
    return new Promise(function(resolve, reject){
        stripe.tokens.create(data).then(function(res){
            resolve(res)
        }).catch((err) => {            
            console.error('error-addNewCard--> ' + err)
            resolve(null)
        })
    })
}
function createSource(customer_id, card_token_id){
    // Attach the card to the customer
    return new Promise(function(resolve, reject){
        stripe.customers.createSource(customer_id, {source: card_token_id }).then(function(res){
            resolve(res)
        }).catch((err) => {            
            console.error('error-createSource--> ' + err)
            resolve(null)
        })
    })
} 
function createCharge(data){
    // Create a charge
    return new Promise(function(resolve, reject){
        stripe.charges.create(data).then(function(res){
            resolve(res)
        }).catch(err => console.error('error-addNewCard--> ' + err)) 
    })
}  