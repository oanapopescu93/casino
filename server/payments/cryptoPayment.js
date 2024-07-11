const express = require("express")
const bodyParser = require('body-parser')
const cryptoPayment = express.Router()
const jsonParser = bodyParser.json()
const axios = require('axios')

const apiKey = "Z1KG9J0-GNHMNQE-PT6HD64-ET6GTWK"
const apiUrl = 'https://api.nowpayments.io/v1'
const BASE_URL = process.env.BASE_URL

cryptoPayment.post("/api/crypto", jsonParser, (req, res, next) => {
    const { amount, crypto_currency, description } = req.body
    createCryptoInvoice(amount, crypto_currency, description).then(function(data) {
        res.json(data)
    })
})

cryptoPayment.post("/api/crypto_min", jsonParser, (req, res, next) => {
    Promise.all([
        checkMinPayment('btc'),
        checkMinPayment('ltc')
    ]).then((data)=>{
        const response = data.map((x)=>{
            if (x.result === "crypto_min" && x.payload.fiat_equivalent) {
                x.payload.fiat_equivalent = x.payload.fiat_equivalent.toFixed(1)
            }
            return x.payload
        })
        res.json({type: "crypto", payload: response, result: "error"})
    }).catch(error => {
        console.error("Error fetching minimum payments:", error);
        res.json({ type: "crypto", payload: error, result: "error" })
    })
})

cryptoPayment.post('/api/crypto/success', jsonParser, (req, res) => {
    const { payment_status, order_id, token_id } = req.body

    if(!order_id || !token_id){
        return res.json({ type: "crypto", result: "error", payload: 'error_charge' })
    }

    if (payment_status === 'paid') {
        fetchPaymentDetails(order_id).then((data)=>{
            res.json({ type: "crypto", result: "success", payload: data.payload })          
        })
    } else {
        res.json({ type: "crypto", result: "error", payload: "error_charge" })
    }
})
  
cryptoPayment.post('/api/crypto/cancel', jsonParser, (req, res) => {
    res.json({ type: "crypto", result: "cancel"}) 
})

function createCryptoInvoice(amount, crypto_currency, description) {
    return new Promise(function(resolve, reject){
        try {
            const payload = {
                price_amount: amount,
                price_currency: "usd",
                pay_currency: crypto_currency,
                order_description: description,
                success_url: BASE_URL + "/api/crypto/success",
                cancel_url: BASE_URL + "/api/crypto/cancel"   
            }
            const headers = {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            }
            axios.post(`${apiUrl}/invoice`, payload, { headers }).then(function(response){
                resolve({type: "crypto", result: "success", payload: response.data})
            }).catch(function(err){
                resolve({type: "crypto", result: "error", payload: err})
            })
        } catch (err) {
            resolve({type: "crypto", result: "error", payload: err})
        }
    })
}

function checkMinPayment(currency="btc") {
    const headers = {
        'x-api-key': apiKey,
    }
    return axios.get(`${apiUrl}/min-amount?currency_from=${currency}&fiat_equivalent=usd`, { headers })
        .then(response => {
            return { type: "crypto", payload: response.data, result: "crypto_min" }
        })
        .catch(error => {
            return { type: "crypto", payload: error, result: "error" }
        })
}

function fetchPaymentDetails(order_id){
    return new Promise(function(resolve, reject){
        try {
            const headers = {
                'x-api-key': apiKey,
            } 
            axios.get(apiUrl + "/invoice/" + order_id, { headers }).then(function(response){
                resolve({payload: response.data})
            }).catch(function(err){
                resolve({payload: err, result: "error"})
            })
        } catch (err) {
            resolve({payload: err, result: "error"})
        }
    }) 
}

module.exports = cryptoPayment