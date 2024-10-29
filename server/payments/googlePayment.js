var express = require("express")
var bodyParser = require('body-parser')
var googlePayment = express.Router()

var jsonParser = bodyParser.json();
const stripe = require('stripe')("sk_test_51Mdvu1CWq9uV6YuM2iH4wZdBXlSMfexDymB6hHwpmH3J9Dm7owHNBhq4l4wawzFV9dXL3xrYGbhO74oc8OeQn5uJ00It2XDg9U")
const MINIMUM_AMOUNT_USD = 1000

googlePayment.post("/api/google", jsonParser, (req, res, next) => {
    const { amount, paymentMethodData, products, description } = req.body

    // Validate input
    if (!amount || amount * 100 < MINIMUM_AMOUNT_USD) {
        return res.json({ type: "google", result: "error", payload: 'amount_too_low' })
    }

    const paymentToken = paymentMethodData.tokenizationData.token

    if (paymentToken) {
        // Create line items for the payment metadata
        const lineItems = products.map((product) => {
            return {
                name: product.name_eng,
                quantity: product.qty,
                price: Math.round(product.price * 100), // price in cents
            }
        })

        const metadata = {}
        lineItems.forEach((item, index) => {
            metadata[`product_${index + 1}`] = `${item.name}: ${item.quantity} x ${item.price / 100} USD`;
        }) 

        try {
            let tokenData = JSON.parse(paymentToken)
            const stripePaymentData = {
                amount: amount * 100,
                currency: 'usd',
                description,
                metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            }

            createPaymentIntent(stripePaymentData).then((res1) => {
                const payload = res1
                payload.payment_details = {
                    type: 'google',
                    payment_type: 'card',
                    products,
                    tokenData
                }
                res.json({ type: "google", result: "success", payload })
            })
            .catch((err) => {
                console.error("Error processing Google Pay:", err);
                res.status(500).send({ type: "google", result: "error", payload: 'payment_intent_error', details: err.message })
            })
        } catch (error) {
            console.error("Error processing Google Pay:", error);
            res.status(500).send({ type: "google", result: "error", payload: 'payment_processing_failed' })
        }
    } else {
        res.json({ type: "google", result: "error", payload: 'no_token' })
    }
});

// Function to create a payment intent with Stripe
function createPaymentIntent(data) {
    return new Promise((resolve, reject) => {
        stripe.paymentIntents.create(data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error('error-createPaymentIntent--> ' + err)
                reject(err)
            })
    })
}

module.exports = googlePayment