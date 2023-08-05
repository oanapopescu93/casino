var express = require("express")
var bodyParser = require('body-parser')
var paypalPayment = express.Router()

var paypal_mode = require('../var/constants').PAYPAL_MODE
var paypal_client_id = require('../var/constants').PAYPAL_CLIENT_ID
var paypal_client_secret = require('../var/constants').PAYPAL_CLIENT_SECRET

var jsonParser = bodyParser.json() 
const paypal = require('paypal-rest-sdk')
paypal.configure({
  'mode': paypal_mode,
  'client_id': paypal_client_id,
  'client_secret': paypal_client_secret
})

paypalPayment.post('/api/paypal', jsonParser, (req, res, next) => {
  let amount = req.body.amount
  //let list = req.body.list
  if(amount && amount>0){
    //console.log(list)
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "/success",
        cancel_url: "/cancel",
      },
      transactions: [
        {
          amount: {
            currency: "USD",
            total: amount,
          },
          description: "This is the payment description.",
        },
      ],
    }
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response)
            res.json({type: "stripe", result: "error", payload: 'paypal_error'})
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    res.json({
                      payload: {
                        receipt_url: payment.links[i].href
                      },
                      result: "success"
                    })
                }
            }
        }
    })
  }
})
paypalPayment.post('/success', jsonParser, (req, res) => {
    const payerId = req.query.PayerID
    const paymentId = req.query.paymentId  
  
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "50.00"
            }
        }]
    }
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response)
            throw error
        } else {
            res.json({paypal_results: JSON.stringify(payment)})
        }
    })
})
paypalPayment.post('/cancel', jsonParser, (req, res) => {
    res.json({paypal_results: "cancel"})
})

module.exports = paypalPayment