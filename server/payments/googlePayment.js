var express = require("express")
var bodyParser = require('body-parser')
var googlePayment = express.Router()

var jsonParser = bodyParser.json()

googlePayment.post("/api/google", jsonParser, (req, res, next) => {
    const { amount, paymentMethodData, products, description } = req.body

    const paymentToken = paymentMethodData.tokenizationData.token

    if(amount){
        if(paymentToken){
            //create items
            const lineItems = products.map((product) => {
                return {
                    name: product.name_eng,                
                    quantity: product.qty,
                    price: Math.round(product.price * 100), // price in cents
                };
            });
            
            const metadata = {};
            lineItems.forEach((item, index) => {
                metadata[`product_${index + 1}`] = `${item.name}: ${item.quantity} x ${item.price / 100} USD`
            })

            // Process payment token
            try {
                validatePaymentToken(paymentToken).then((res1)=>{
                    let payload = res1

                    payload.payment_details = paymentMethodData
                    payload.description = description
                    payload.products = products
                    payload.type = 'google'
                    payload.amount = amount
                    payload.status = "successful"

                    res.json({ type: "google", result: "success", payload })
                })
            } catch (error) {
                console.error("Error processing Google Pay:", error);
                res.status(500).send({ success: false, message: "Payment processing failed" });
            }
        } else {
            res.json({ type: "google", result: "error", payload: 'no_token' })
        }
    } else {
        res.json({ type: "google", result: "error", payload: 'no_money' })
    }    
})

function validatePaymentToken(data){
    return new Promise((resolve, reject)=>{
        resolve({text: 'oana was here'})
    })
}

module.exports = googlePayment