const crypto = require('crypto')
var constants = require('../var/constants')

const algorithm = 'aes-256-ctr'
const secretKey = constants.SECRET_KEY
const iv = crypto.randomBytes(16)

const jwt = require("jsonwebtoken")
const secretKey_jwt = constants.SECRET_KEY_JWT

const encrypt = (text) => {
    try {
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        }
    } catch(e){
        console.log('[error]','encrypt :', e)
    }
    
}

const decrypt = (hash) => {
    try {
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])
        return decrpyted.toString()
    } catch(e){
        console.log('[error]','decrypt :', e)
    }    
}

const encrypt_jwt = (text) => {
    try {
        const token = jwt.sign({ text: text }, secretKey_jwt, {})
        return token
    } catch(e){
        console.log('[error]','encrypt_jwt :', e)
    }
}

const decrypt_jwt = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey_jwt)
        return decoded
    } catch(err) {
        console.log('[error]','decrypt_jwt :', e)
    }
}

module.exports = {encrypt, decrypt, encrypt_jwt, decrypt_jwt}