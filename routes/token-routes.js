const express = require('express')
const { addToken, 
        checkIfExists,
        checkToken,
        deleteToken 
    } = require('../controllers/tokenController')

const router = express.Router();

//? Activate 2FA Authentication and create QRCode for given email
router.post('/create/:email', addToken);
//? Check if 2FA is activated for given email
router.get('/exists/:email', checkIfExists)
//? Check if given token code is valid for given email
router.get('/check/:email/:token', checkToken)
//? Desactivate 2FA Authentication for given email
router.delete('/delete/:email', deleteToken)

module.exports = {
    routes: router
}
