'use strict';

const firebase = require('../db');
const Token = require('../models/token');
const firestore = firebase.firestore();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { encrypt, decrypt } = require('../helper/crypto')

//? POST
const addToken = async (req, res) => {
    try {
        const email = req.params.email

        const tokenRef = firestore.collection('token')
        //* Check if document exists in token collection with given email
        const data = await tokenRef.where("email", "==", `${email}`).get()
        //* Check if 2FA is already activated for given email
        if(!data.empty) {
            res.status(409).send(`2FA for ${email} is already activated`)
        }

        var secret = speakeasy.generateSecret({
            //* Name of QRCode account. Example : 'My QRCode'
            name: 'Time Manager'
        })

        var today = new Date();
        var date = `${today.getFullYear()}-${(today.getMonth()+1)}-${today.getDate()}`;
        var time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        var dateTime = `${date} ${time}`;

        //* Generate QRCode 
        qrcode.toDataURL(secret.otpauth_url, async function(err, data) {
            if(err) res.status(500).send('Something broke into server!')
            let body = new Object();
            body.email = email
            //* Second time encryption of ascii secret
            body.secret = encrypt(secret.ascii)
            body.date = dateTime
            //* Store new document to token collection
            await firestore.collection('token').doc().set(body);
            res.status(200).send(data)
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//? GET ( One )
const checkIfExists = async (req, res) => {
    try {
        const email = req.params.email
        const tokenRef = firestore.collection('token')
        //* Check if document exists in token collection with given email
        const data = await tokenRef.where("email", "==", `${email}`).get()
        if(data.empty) {
            res.status(204).send(`2FA for ${email} isn't activated`)
        } else {
            res.status(200).send(`2FA for ${email} is activated`)
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

//? GET ( One )
const checkToken = async (req, res) => {
    try {
        const email = req.params.email
        const tokenBody = req.params.token
        let secret = ''
        
        const tokenRef = firestore.collection('token')
        //* Get document in token collection where email equals given email
        const data = await tokenRef.where("email", "==", `${email}`).get()
        if(data.empty) {
            res.status(404).send(`Token with the given Email: ${email} doesn't exists`)
        } else {
            //TODO To improve ( ForEach but want to get first or default document )
            data.forEach(doc => { secret = doc.data().secret; });
            var verified = speakeasy.totp.verify({
                secret: decrypt(secret),
                encoding: 'ascii',
                token: tokenBody
            })
        
            //* Verified equals to true or false
            res.status(200).send(verified)
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

//? DELETE ( One )
const deleteToken = async (req, res) => {
    try {
        const email = req.params.email
        const toDelete = firestore.collection('token').where("email", "==", `${email}`)
        toDelete.get().then(function(querySnapshot) {
            querySnapshot.forEach(doc => { doc.ref.delete() })
        })
        res.status(200).send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    addToken,
    checkIfExists,
    checkToken,
    deleteToken,
}