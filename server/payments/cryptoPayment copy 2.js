var express = require("express")
var bodyParser = require('body-parser')
var cryptoPayment = express.Router()
var jsonParser = bodyParser.json()
const axios = require('axios')

const sendBitcoin = async (amount, currency='BTC') => {
    try {
        const storeId = 'Gdi4h6RJhdcCQSwF45C82Ra6uVKLnWTebWy8CZySm4So'; // You can find the store ID in your BTCPay Server's store settings
        const apiUrl = 'https://docs.btcpayserver.org/api/v1/stores/'+storeId+'/payment-requests'
        const response = await axios.post(apiUrl, {
          price: amount,
          currency,
          notificationEmail: 'oanapopescu93@gmail.com', // Optional: Email to receive payment notifications
        }, {
          headers: {
            Authorization: `oidlE7DWkoEiERWRVoO7Ink0H0YYWkbUdWPyEUWrhpo`,
          },
        });
    
        const paymentLink = response.data.data;
        return paymentLink;
      } catch (error) {
        console.error('Error creating BTCPay payment link:', error.response);
      }
}

cryptoPayment.post("/api/crypto", jsonParser, (req, res, next) => {
    let amount = req.body.amount
    let bitcoin_address = req.body.bitcoin_address
    if(bitcoin_address && amount && amount>0){
        sendBitcoin(amount)
    }
})

module.exports = cryptoPayment