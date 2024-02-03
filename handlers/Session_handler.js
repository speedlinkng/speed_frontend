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
    
    saveUserSession:(req, res)=>{
        console.log(req.sessionID)
        console.log(req.session.token)
    },

}