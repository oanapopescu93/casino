var express = require("express")
var bodyParser = require('body-parser')
var stripePayment = express.Router()

var jsonParser = bodyParser.json()
const stripe = require('stripe')("sk_test_51Mdvu1CWq9uV6YuM2iH4wZdBXlSMfexDymB6hHwpmH3J9Dm7owHNBhq4l4wawzFV9dXL3xrYGbhO74oc8OeQn5uJ00It2XDg9U")
const MINIMUM_AMOUNT_USD = 1000

stripePayment.post("/api/stripe", jsonParser, (req, res, next) => {
    const { name, email, country, city, phone, cardNumber, month, year, cvv, amount, products, description } = req.body

    if(!cardNumber || !month || !year || !cvv){
        return res.json({ type: "stripe", result: "error", payload: 'error_charge' })
    }    

    if (amount) {
        if (amount * 100 < MINIMUM_AMOUNT_USD) {
            return res.json({ type: "stripe", result: "error", payload: 'amount_too_low' })
        }

        //create items
        const lineItems = products.map((product) => {
            return {
                name: product.name_eng,
                quantity: product.qty,
                price: Math.round(product.price * 100), // price in cents
            }
        })
        
        const metadata = {};
        lineItems.forEach((item, index) => {
            metadata[`product_${index + 1}`] = `${item.name}: ${item.quantity} x ${item.price / 100} USD`
        })

        let customer = null
        let card = {
            type: 'card',
            card: {
                number: cardNumber,
                exp_month: parseInt(month),
                exp_year: parseInt(year),
                cvc: cvv,
            },
        }
        let paymentMethod = null
        let paymentIntent = {
            amount: amount * 100,
            currency: 'usd',
            description: description,
            receipt_email: email || undefined,
            confirm: true, // Automatically confirm the payment
            off_session: true, // Indicate that the payment is happening off-session
            metadata: metadata
        }

        const customerData = {
            description: "BunnyBet customer",
        }
        if (name) customerData.name = name
        if (email) customerData.email = email
        if (phone) customerData.phone = phone
        if (country || city) customerData.address = { country, city }

        try {
            createNewCustomer(customerData).then((res1)=>{
                if(res1){
                    customer = res1
                    createPaymentMethod(card).then((res2)=>{
                        if(res2){
                            paymentMethod = res2
                            attachPaymentMethod(paymentMethod.id, customer.id).then((res3)=>{
                                if(res3){
                                    paymentIntent.customer = customer.id
                                    paymentIntent.payment_method = paymentMethod.id
                                    paymentIntents(paymentIntent).then((res4)=>{
                                        let payload = res4
                                        payload.payment_details = {
                                            type: 'stripe',
                                            payment_type: card.type,
                                            card: {
                                                last4: res2.card.last4,
                                                brand: res2.card.brand,
                                                exp_month: res2.card.exp_month,
                                                exp_year: res2.card.exp_year
                                            },
                                            name,
                                            email,
                                            phone,
                                            country,
                                            city,
                                            products
                                        }
                                        res.json({ type: "stripe", result: "success", payload })
                                    }).catch((err)=>{
                                        res.json({ type: "stripe", result: "error", payload: 'paymentIntent_error', details: err.message });
                                    })
                                } else {
                                    res.json({ type: "stripe", result: "error", payload: 'attachPaymentMethod_error' })
                                }
                            }).catch((err)=>{
                                res.json({ type: "stripe", result: "error", payload: 'attachPaymentMethod_error', details: err.message });
                            })
                        } else {
                            res.json({ type: "stripe", result: "error", payload: 'createPaymentMethod_error' })
                        }
                    }).catch((err)=>{
                        res.json({ type: "stripe", result: "error", payload: 'createPaymentMethod_error', details: err.message })
                    })
                } else {
                    res.json({ type: "stripe", result: "error", payload: 'createNewCustomer_error' })
                }
            }).catch((err)=>{
                res.json({ type: "stripe", result: "error", payload: 'createNewCustomer_error', details: err.message })
            })
        } catch (error) {
            res.json({ type: "stripe", result: "error", payload: 'error_charge', details: error.message })
        }
    } else {
        res.json({ type: "stripe", result: "error", payload: 'no_money' })
    }
})

module.exports = stripePayment

function createNewCustomer(data){
    return new Promise((resolve, reject)=>{
        stripe.customers.create(data).then((res)=>{
            resolve(res)
        }).catch((err) => {
            console.error('error-createNewCustomer--> ' + err)
            reject(err)
        })
    })
}
function createPaymentMethod(data){
    return new Promise((resolve, reject)=>{
        stripe.paymentMethods.create(data).then(function (res) {
            resolve(res)
        }).catch(err => {
            console.error('error-createPaymentMethod--> ' + err)
            reject(err);
        })
    })
}
function attachPaymentMethod(paymentMethod_id, customer_id){
    return new Promise(function (resolve, reject) {
        stripe.paymentMethods.attach(paymentMethod_id, { customer: customer_id }).then((res)=>{
            resolve(res)
        }).catch((err) => {
            console.error('error-attachPaymentMethod--> ' + err)
            reject(err)
        })
    })
}
function paymentIntents(data){
    return new Promise((resolve, reject)=>{
        stripe.paymentIntents.create(data).then((res)=>{
            resolve(res)
        }).catch(err => {
            console.error('error-paymentIntents--> ' + err)
            reject(err)
        })
    })
}