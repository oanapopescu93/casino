var express = require("express")
var bodyParser = require('body-parser')
var paypalPayment = express.Router()

var { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = require('../var/constants');

var jsonParser = bodyParser.json() 
const paypal = require('paypal-rest-sdk')
paypal.configure({
  'mode': PAYPAL_MODE,
  'client_id': PAYPAL_CLIENT_ID,
  'client_secret': PAYPAL_CLIENT_SECRET
})
const MINIMUM_AMOUNT_USD = 0.01

paypalPayment.post('/api/paypal', jsonParser, (req, res, next) => {
  let amount = req.body.amount
  if(amount){
    if (amount < MINIMUM_AMOUNT_USD) {
      return res.json({type: "stripe", result: "error", payload: 'amount_too_low'})
    }
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `/api/paypal/success?amount=${amount}`,
        cancel_url: "/api/paypal/cancel",
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
            res.json({type: "paypal", result: "error", payload: 'paypal_error', details: error.response})
        } else {
          let approvalUrl = payment.links.find(link => link.rel === "approval_url")
          if (approvalUrl) {
            res.json({
              type: "paypal",
              result: "success",
              payload: { receipt_url: approvalUrl.href },
              details: payment
            })
          } else {
            res.json({ type: "paypal", result: "error", payload: 'approval_url_not_found'})
          }
        }
    })
  } else {
    return res.json({type: "stripe", result: "error", payload: 'no_money'})
  }
})
paypalPayment.post('/api/paypal/success', jsonParser, (req, res) => {
  const { payerId, paymentId, amount} = req.body

    if (!payerId || !paymentId || !amount) {
      return res.json({type: "paypal", result: "error", payload: 'error_charge'})
    }

    console.log(req.body)
  
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": amount
            }
        }]
    }
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        res.json({ type: "paypal", result: "error", payload: 'error_charge', details: error.response })
      } else {
        res.json({ type: "paypal", result: "success", payload: payment })
      }
    });
})
paypalPayment.post('/api/paypal/cancel', jsonParser, (req, res) => {
  res.json({ type: "paypal", result: "cancel"})
})

module.exports = paypalPayment