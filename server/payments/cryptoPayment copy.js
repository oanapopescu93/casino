var express = require("express")
var bodyParser = require('body-parser')
var cryptoPayment = express.Router()
var jsonParser = bodyParser.json()
const bitcore = require("bitcore-lib")
var explorers = require('./bitcore-explorers/index');

var toAddress = "n23KAepvmpffvm9LhWNXn2TTrJYwariG9n"

const sendBitcoin = async (recieverAddress, amountToSend) => {
    return new Promise(function(resolve, reject){
        let privateKeyWIF = bitcore.PrivateKey('testnet').toWIF()
        let privateKey = bitcore.PrivateKey.fromWIF(privateKeyWIF)
        let address = privateKey.toAddress()

        // what I've tried to put in new explorers.Insight
        // "https://bitpay.com/insight/" (404)
        // "https://explorer.btc.zelcore.io" (404)
        // https://api.bitcore.io/api/BTC/testnet/ (404)
        // https://api.bitcore.io (500)
        // "testnet" (525)
        // nothing (525)
        var insight = new explorers.Insight('https://api.bitcore.io')

        const unit = bitcore.Unit
        const minerFee = unit.fromMilis(0.128).toSatoshis(); //cost of transaction in satoshis (minerfee)
        const transactionAmount = unit.fromMilis(amountToSend).toSatoshis(); //convert mBTC to Satoshis using bitcore unit

        console.log(privateKeyWIF, privateKey.toString(), address.toString(), unit.fromSatoshis(0).toSatoshis())
    
        insight.getUnspentUtxos(address.toString(), function(err, utxos) {
            // 'bc1q250h9jjr7wj9302z0vpzath3c560k3krkg0fxk'
            // 'n23KAepvmpffvm9LhWNXn2TTrJYwariG9n'
            // '16o6XNUB25yRyaF6KeumVW4qTQTHK6g5aC'
            if (err) {
                resolve({payload: err, result: "error"})
            } else {
                console.log('utxos--> ', utxos)
                if (utxos.length == 0) {
                    //if no transactions have happened, there is no balance on the address.
                    resolve({payload: "You don't have enough Satoshis to cover the miner fee.", result: "error"})                    
                } 
                let balance = unit.fromSatoshis(0).toSatoshis()
                for (var i = 0; i < utxos.length; i++) {
                    balance += unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
                }
                if (balance - transactionAmount - minerFee > 0) {
                    try{
                        let bitcore_transaction = new bitcore.Transaction()
                        .from(utxos)
                        .to(toAddress, transactionAmount)
                        .fee(minerFee)
                        .change('n23KAepvmpffvm9LhWNXn2TTrJYwariG9n')
                        .sign(privateKey.toString())
                        .serialize()
                        
                        // broadcast the transaction to the blockchain
                        insight.broadcast(bitcore_transaction, function(error, txid) {
                            if (error) {
                                resolve({payload: error, result: "error"})
                            } else {
                                resolve({payload: txid, result: "success"}) 
                            }
                        });
                    }
                    catch (error) {
                        resolve({payload: error.message, result: "error"}) 
                    }              
                } else {
                    resolve({payload: "You don't have enough Satoshis to cover the miner fee.", result: "error"}) 
                }
            }
        })
    })
}

cryptoPayment.post("/api/crypto", jsonParser, (req, res, next) => {
    let amount = req.body.amount
    let bitcoin_address = req.body.bitcoin_address
    if(bitcoin_address && amount && amount>0){
        sendBitcoin(bitcoin_address, amount).then(function(data) {
            res.json(data)
        })        
    }
})

module.exports = cryptoPayment