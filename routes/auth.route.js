const express = require('express');
const router = express.Router();
const path = require('path');
const request = require("request");
const jwt = require("jsonwebtoken")
const serveStatic = require('serve-static'); 
const {deTokenize} = require('./../middlewars/FunctionsController');
const {saveUserSession} = require('../handlers/Session_handler');



  router.get('/signin', saveUserSession);

  router.get('/signup', function(req, res) {
    res.render(`auth/auth.ejs`, {urls: {base: process.env.BASU_URL, backend: process.env.BACKEND_URL},activeFile:"signup", data: null, title: "Authorization"});
  });

  router.get("/verify/:verifyId", function (req, res) {
    console.log(req.params.verifyId); // recovery_id

    request(
        {
            method: "GET",
            url: process.env.BACKEND_URL + `/api/users/verifyrecovery/${req.params.verifyId}`,
        },
        (err, response, body) => {
            if (err) {
                console.log(err);
            } else {
                let status = response.statusCode;
                if (status == 404) {
                  return res.redirect(`/auth/login?error=Recovery token not found or expired.`);
                }
                if (status == 200) {
                    let result = JSON.parse(body);
                    console.log(result.email);
                    res.render(`auth/auth.ejs`, { 
                        urls: { backend: process.env.BACKEND_URL }, 
                        data: result.email, 
                        title: "Reset Password" 
                    });
                }
            }
        }
    );
});


  router.get('/', function(req, res) {
    res.render(`auth/auth.ejs`, {urls: {base: process.env.BASU_URL, backend: process.env.BACKEND_URL},activeFile:null, data: null, title: "Authorization"});
  });

  
router.get('/activate', function (req, res) {
  const { error } = req.body
  if (error) {
    res.render(`auth/activate.ejs`, {urls: {backend: process.env.BACKEND_URL}, activeFile:null, data: null,  error: error, baseUrl: process.env.BASE_URL});
  }
    res.render(`auth/activate.ejs`, {urls: {backend: process.env.BACKEND_URL}, activeFile:null, data: null,  error: null, baseUrl: process.env.BASE_URL});
  });


  router.get('/activate/:activateId', function (req, res) {
      // activate code is a jwt token.
      // that expires in 30 minutes.
      // check if the actiivate code has a user then activate that user.
    

      let activateToken = req.params.activateId
      jwt.verify(activateToken, process.env.REFRESH_TOK_SEC, (err, decoded) => {
        if (err) {
          // console.log(err)
          res.render(`auth/activate.ejs`, {urls: {backend: process.env.BACKEND_URL}, activeFile:null, data: null, error: err, baseUrl: process.env.BASE_URL});
        } 
        let decodedToken = decoded
        const decodedUser = decodedToken.result.user_id;
        // check if user id exists in the database, if it does, set activated
        console.log(decodedUser)
        request(
          {
            method: "GET",
            url: process.env.BACKEND_URL + `/api/users/activateuser/${decodedUser}`
          },
          (err, response, body) => {
            if (err) {
              console.log(err);
              
            } else {
              let status = response.statusCode
              if (status == 301) {
                // then no match was found
              }
              if (status == 200) {
                res.render(`auth/auth.ejs`, { urls: {backend: process.env.BACKEND_URL}, activeFile:null, data: null, error: null, baseUrl: process.env.BASE_URL });
              }
      
            }
          }
        );

      })

  });


module.exports = router