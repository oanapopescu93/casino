var express = require("express")
var bodyParser = require('body-parser')
var cryptoPayment = express.Router()
var jsonParser = bodyParser.json()
const axios = require('axios')

const apiKey = "Z1KG9J0-GNHMNQE-PT6HD64-ET6GTWK"
const apiUrl = 'https://api.nowpayments.io/v1'

function createCryptoInvoice(amount, currency = 'USD') {
    return new Promise(function(resolve, reject){
        try {
            const payload = {
                price_amount: amount,
                price_currency: currency,
                pay_currency: 'BTC',
                order_description: "BunnyBet",
                ipn_callback_url: 'https://your-server-url.com/ipn'
            }        
            const headers = {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            }        
            axios.post(`${apiUrl}/invoice`, payload, { headers }).then(function(response){
                let iid = response.data.id
                if(typeof iid != "undefined" && iid != "null" && iid != null && iid != ""  && iid > 0){
                    resolve({iid: iid, payload: response.data, result: "success", url: "invoice"})
                }
            }).catch(function(err){
                resolve({payload: err, result: "error"}) 
            })
        } catch (err) {
            resolve({payload: err, result: "error"})  
        }
    })
}

function createCryptoPayment(iid) {
    return new Promise(function(resolve, reject){
        try {
            const payload = {
                iid: iid,
                pay_currency: 'BTC',
                order_description: "BunnyBet",
            }        
            const headers = {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            }        
            axios.post(`${apiUrl}/invoice-payment`, payload, { headers }).then(function(response){
                resolve({payload: response.data, result: "success", url: "invoice-payment"})
            }).catch(function(err){
                resolve({payload: err, result: "error"})
            })
        } catch (err) {
            resolve({payload: err, result: "error"})
        }
    })
}

function checkPaymentStatus(paymentId) {
    return new Promise(function(resolve, reject){
        try {
            const headers = {
                'x-api-key': apiKey,
            }        
            axios.get(`${apiUrl}/payment/${paymentId}`, { headers }).then(function(response){
                resolve({payload: response, result: "success"})
            }).catch(function(err){
                resolve({payload: err, result: "error"})
            })
        } catch (err) {
            resolve({payload: err, result: "error"})
        }
    }) 
}

function checkMinPayment(amount){
    return new Promise(function(resolve, reject){
        try {
            const headers = {
                'x-api-key': apiKey,
            } 
            axios.get(`${apiUrl}/min-amount?currency_from=btc&fiat_equivalent=usd`, { headers }).then(function(response){
                resolve({payload: response.data, result: "crypto_min"})
            }).catch(function(err){
                resolve({payload: err, result: "error"})
            })
        } catch (err) {
            resolve({payload: err, result: "error"})
        }
    }) 
}

cryptoPayment.post("/api/crypto_pay", jsonParser, (req, res, next) => {
    let iid = req.body.iid
    if(typeof iid != "undefined" && iid != "null" && iid != null && iid != ""  && iid > 0){
        createCryptoPayment(iid).then(function(data) {
            res.json(data)
        })  
    } else {
        res.json({payload: 'no iid', result: "error"}) 
    }    
})

cryptoPayment.post("/api/crypto", jsonParser, (req, res, next) => {
    let amount = req.body.amount
    if(typeof amount != "undefined" && amount != "null" && amount != null && amount != ""  && amount > 0){
        createCryptoInvoice(amount).then(function(data) {
            res.json(data)
        })  
    } else {
        res.json({payload: 'no amount', result: "error"}) 
    }    
})

function getCryptoPaymentByID(payment_id){
    return new Promise(function(resolve, reject){
        try {
            const headers = {
                'x-api-key': apiKey,
            } 
            axios.get(`${apiUrl}/payment/${payment_id}`, { headers }).then(function(response){
                resolve({payload: response.data, result: "crypto_payment"})
            }).catch(function(err){
                resolve({payload: err, result: "error"})
            })
        } catch (err) {
            resolve({payload: err, result: "error"})
        }
    })
}

cryptoPayment.post("/api/crypto_get_payment", jsonParser, (req, res, next) => {
    let payment_id = req.body.payment_id
    if(typeof payment_id != "undefined" && payment_id != "null" && payment_id != null && payment_id != ""  && payment_id > 0){
        getCryptoPaymentByID(payment_id).then(function(data) {
            res.json(data)
        })  
    } else {
        res.json({payload: 'no amount', result: "error"}) 
    } 
})

cryptoPayment.post("/api/crypto_min", jsonParser, (req, res, next) => {
    let amount = req.body.amount
    if(typeof amount != "undefined" && amount != "null" && amount != null && amount != ""  && amount > 0){
        checkMinPayment(amount).then(function(data) {
            if(data && data.payload && data.payload.fiat_equivalent){
                data.payload.fiat_equivalent = data.payload.fiat_equivalent.toFixed(1)
            }
            res.json(data)
        })  
    } else {
        res.json({payload: "amount", result: "error"})
    }    
})

cryptoPayment.post("/api/crypto_status", jsonParser, (req, res, next) => {
    let paymentId = req.body.paymentId
    if(typeof paymentId != "undefined" && paymentId != "null" && paymentId != null && paymentId != ""  && paymentId > 0){
        checkPaymentStatus(paymentId).then(function(data) {
            res.json(data)
        })  
    } else {
        res.json({payload: "paymentId", result: "error"})
    } 
})

module.exports = cryptoPayment