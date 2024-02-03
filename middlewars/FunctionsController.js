const express = require('express');
const {sign, decode} = require("jsonwebtoken")
const request = require("request");
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
/*
Error messages are represented using 700 - 709
*/
module.exports = {
    tokenize:(req, res)=>{

        function tokenize(){
            return res.status(709).json({message: "you have no access to this"})

            // TOKENIZE BACKEN USER ACCESS TOKEN, FOR FRONTEND SERVERSIDE ACCESS
            let token = req.headers.authorization; // Assuming the token is in the request headers
            if (!token) {
                return res.status(701).json({ message: 'Unauthorized' });
            }
            token = token && token.split(' ')[1];
            const decodedToken = decode(token);
            console.log(decodedToken)
            const accessToken = sign({this_user_token : token}, process.env.REFRESH_TOK_SEC, {
                expiresIn: "58m"
            })
            console.log(accessToken)
            return res.status(200)
        }
    },

    deTokenize:(req, res)=>{
        function deTokenize(){
            let token = req.headers.authorization; // Assuming the token is in the request headers
            if (!token) {
                return res.status(701).json({ message: 'Unauthorized' });
            }
            token = token && token.split(' ')[1];
            const decodedToken = decode(token);
            console.log(decodedToken)
            res.decoded_access = decodedToken.result
            next();

        }
        deTokenize()

    },
}