var express = require("express")
var bodyParser = require('body-parser')
var stripePayment = express.Router()

var jsonParser = bodyParser.json() 
// require('dotenv').config()
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const stripe = require('stripe')("sk_test_51Mdvu1CWq9uV6YuM2iH4wZdBXlSMfexDymB6hHwpmH3J9Dm7owHNBhq4l4wawzFV9dXL3xrYGbhO74oc8OeQn5uJ00It2XDg9U")

stripePayment.post("/api/stripe", jsonParser, (req, res, next) => {
    const { name, email, country, city, phone, cardNumber, expiry_month, expiry_year, cvv, amount } = req.body

    if (!name || !email || !cardNumber || !expiry_month || !expiry_year || !cvv) {
        return res.status(400).json({ error: "Missing required fields" })
    }

    if(amount){
        let customer = null
        let customerInfo = {name, email, phone, description: "stripe customer", address: {country, city}}

        let card_token = null
        let card = null
        let cardInfo = {
            // card: {
            //     number: '4242424242424242',
            //     exp_month: 4,
            //     exp_year: 2024,
            //     cvc: '314',
            //     name,
            // },
            card: {
                number: cardNumber,
                exp_month: parseInt(expiry_month),
                exp_year: parseInt(expiry_year),
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
            console.error('Stripe error:', error)
            return res.status(500).json({ error: error.message })
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