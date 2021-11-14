const CryptoJS = require('crypto-js')

function encrypt(message) {
    let encryptedData = CryptoJS.AES.encrypt(message, process.env.PASSPHRASE).toString()
    
    return encryptedData
}

function decrypt(message) {
    console.log(message)
    let bytes = CryptoJS.AES.decrypt(message, process.env.PASSPHRASE);
    let decryptedData = bytes.toString(CryptoJS.enc.Utf8)

    return decryptedData;
}

module.exports = {
    encrypt,
    decrypt
}