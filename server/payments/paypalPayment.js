var express = require("express")
var bodyParser = require('body-parser')
var paypalPayment = express.Router()

var { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = require('../var/constants')

var jsonParser = bodyParser.json() 
const paypal = require('paypal-rest-sdk')
paypal.configure({
  'mode': PAYPAL_MODE,
  'client_id': PAYPAL_CLIENT_ID,
  'client_secret': PAYPAL_CLIENT_SECRET
})
const MINIMUM_AMOUNT_USD = 10
let amountPaypal = 0
const BASE_URL = process.env.BASE_URL
let productsPaypal = []

paypalPayment.post('/api/paypal', jsonParser, (req, res, next) => {
  const { amount, products, description } = req.body

  if(!BASE_URL){
    return res.json({ type: "paypal", result: "error", payload: 'BASE_URL' })
  }

  if(amount){
    // Calculate total amount based on lineItems
    const totalAmount = products.reduce((acc, product) => {
      return acc + (product.price * product.qty)
    }, 0)
    amountPaypal = totalAmount
    productsPaypal = products

    if (totalAmount < MINIMUM_AMOUNT_USD) {
      return res.json({ type: "paypal", result: "error", payload: 'amount_too_low' })
    }
   
    let itemList = products.map(product => {
      return {
        name: product.name_eng,
        quantity: product.qty,
        price: product.price.toFixed(2),
        currency: 'USD'
      }
    })

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: BASE_URL + "/api/paypal/success",
        cancel_url: BASE_URL + "api/paypal/cancel",
      },
      transactions: [
        {
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description,
          item_list: {
            items: itemList
          }
        },
      ],
    }    

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        res.json({type: "paypal", result: "error", payload: 'paypal_error', details: error.response})
      } else {
        let approvalUrl = payment.links.find(link => link.rel === "approval_url")
        if (approvalUrl) {
          res.json({
            type: "paypal",
            result: "success",
            payload: { receipt_url: approvalUrl.href, paymentId: payment.id },
            details: payment
          })
        } else {
          res.json({ type: "paypal", result: "error", payload: 'approval_url_not_found'})
        }
      }
    })
  } else {
    return res.json({type: "paypal", result: "error", payload: 'no_money'})
  }
})

paypalPayment.post('/api/paypal/success', jsonParser, (req, res) => {
  const { payerId, paymentId } = req.body 

  if(!payerId || !paymentId){
    return res.json({ type: "paypal", result: "error", payload: 'error_charge' })
  }

  if(amountPaypal && amountPaypal > 0){
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [{
        amount: {
          currency: 'USD', 
          total: amountPaypal.toFixed(2), 
        },
      }],
    }    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        res.json({ type: "paypal", result: "error", payload: 'error_charge', details: error.response })
      } else {
        res.json({ type: "paypal", result: "success", payload: {...payment, payment_details: {products: productsPaypal}} })
      }
    })
  } else {
    res.json({ type: "paypal", result: "error", payload: 'error_charge' })
  }  
})

paypalPayment.post('/api/paypal/cancel', jsonParser, (req, res) => {
  const { token } = req.body 
  if(token){
    res.json({ type: "paypal", result: "cancel"}) 
  }
})

module.exports = paypalPayment