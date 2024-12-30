const express = require("express")
const bodyParser = require('body-parser')
const cryptoPayment = express.Router()
const jsonParser = bodyParser.json()
const axios = require('axios')

const apiKey = "Z1KG9J0-GNHMNQE-PT6HD64-ET6GTWK"
const apiUrl = 'https://api.nowpayments.io/v1'
const BASE_URL = process.env.BASE_URL
let productsCrypto = []
const orderDescriptions = {}

cryptoPayment.post("/api/crypto", jsonParser, (req, res, next) => {
    const { amount, crypto_currency, description, products } = req.body
    createCryptoInvoice(amount, crypto_currency, description, products).then((data)=>{
        if (data.payload && data.payload.order_id) {
            orderDescriptions[data.payload.order_id] = description
        }
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

cryptoPayment.post("/api/crypto_estimated_price", jsonParser, (req, res, next) => {
    const { amount, currency_from, currency_to } = req.body
    if(!amount || amount === 0 || !currency_from || !currency_to){
        return res.json({ type: "crypto", result: "error", payload: {"estimated_amount": 0} })
    }

    getEstimatedPrice(amount, currency_from, currency_to).then((data)=>{
        return res.json({ type: "crypto", result: "success", payload: data })
    })
})

cryptoPayment.post('/api/crypto/success', jsonParser, (req, res) => {
    const { payment_status, order_id, token_id } = req.body

    if(!order_id || !token_id){
        return res.json({ type: "crypto", result: "error", payload: 'error_charge' })
    }

    const dummyData = {
        "payment_id": 6249365965,
        "invoice_id": null,
        "payment_status": "finished",
        "pay_address": "address",
        "payin_extra_id": null,
        "price_amount": 1,
        "price_currency": "usd",
        "pay_amount": 11.8,
        "actually_paid": 12,
        "pay_currency": "trx",
        "order_id": null,
        "order_description": null,
        "purchase_id": 5312822613,
        "outcome_amount": 11.8405,
        "outcome_currency": "trx",
        "payout_hash": "hash",
        "payin_hash": "hash",
        "created_at": "2023-07-28T15:06:09.932Z",
        "updated_at": "2023-07-28T15:09:40.535Z",
        "burning_percent": "null",
        "type": "crypto2crypto",
        "payment_extra_ids": [
            5513339153
        ]
    }

    if (payment_status === 'paid' || payment_status === 'finished' || payment_status === 'successful' || payment_status === 'success') {
        fetchPaymentDetails(order_id).then((data)=>{
            //res.json({ type: "crypto", result: "success", payload: {...data.payload, order_description: "Test Payment Description", payment_details: {products: productsCrypto}} })
            res.json({ 
                type: "crypto", 
                result: "success", 
                payload: {
                    ...dummyData, 
                    order_id: order_id,
                    order_description: "Crypto payment", 
                    payment_details: {products: productsCrypto}},
                    order_description: orderDescriptions[order_id] || "Crypto payment",
                })
        })
    } else {
        res.json({ type: "crypto", result: "error", payload: "error_charge" })
    }
})
  
cryptoPayment.post('/api/crypto/cancel', jsonParser, (req, res) => {
    res.json({ type: "crypto", result: "cancel"}) 
})

function createCryptoInvoice(amount, crypto_currency, description, products) {
    return new Promise((resolve)=>{
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
            productsCrypto = products
            axios.post(`${apiUrl}/invoice`, payload, { headers }).then((response)=>{
                resolve({type: "crypto", result: "success", payload: {...response.data}})
            }).catch((err)=>{
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
            return { type: "crypto", payload: {...response.data}, result: "crypto_min" }
        })
        .catch(error => {
            return { type: "crypto", payload: error, result: "error" }
        })
}

function fetchPaymentDetails(order_id){
    return new Promise((resolve)=>{
        try {
            const headers = {
                'x-api-key': apiKey,
            } 
            axios.get(apiUrl + "/invoice/" + order_id, { headers }).then((response)=>{
                resolve({payload: response.data})
            }).catch((err)=>{
                resolve({payload: err, result: "error"})
            })
        } catch (err) {
            resolve({payload: err, result: "error"})
        }
    }) 
}

function getEstimatedPrice(amount, currency_from, currency_to){
    return new Promise(function (resolve, reject) {
        try {
            const headers = {
                'x-api-key': apiKey,
            } 
            axios.get(apiUrl + "/estimate?amount=" + amount + "&currency_from=" + currency_from + "&currency_to=" + currency_to, { headers }).then((response)=>{
                resolve(response.data)
            }).catch((err)=>{
                resolve(err)
            })
        } catch (err) {
            resolve(err)
        }
    })
}

module.exports = cryptoPayment