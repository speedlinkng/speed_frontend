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
    res.sendFile(`auth.html`, { root: 'views/auth' });
  });

  router.get('/verify/:verifyId', function(req, res) {
    console.log(req.params.verifyId) // also calld recovery_id
    // Check if this ID is accurate
    request(
      {
        method: "GET",
        url:process.env.BACKEND_URL+`/api/users/verifyrecovery/${req.params.verifyId}`
      },
      (err, response, body) => {
        if (err) {
          console.log(err);
          
        }else{
          let status = response.statusCode
          if(status == 301){
            // then no match was found
          }
          if(status == 200){
            let result = JSON.parse(body);
            console.log(result.data.user_id)
            res.render(`auth/auth.ejs`, {data: result.data.user_id});
          }
   
        }
      })
       
          
          
  });


  router.get('/', function(req, res) {
    res.render(`auth/auth.ejs`, {data: null});
  });

  
  router.get('/activate', function (req, res) {
      res.render(`auth/activate.ejs`, {data: null,  error: null, baseUrl: process.env.BASE_URL});
  });


  router.get('/activate/:activateId', function (req, res) {
      // activate code is a jwt token.
      // that expires in 30 minutes.
      // check if the actiivate code has a user then activate that user.
    

      let activateToken = req.params.activateId
      jwt.verify(activateToken, 'your_refresh_token_secret', (err, decoded) => {
        if (err) {
          // console.log(err)
          res.render(`auth/activate.ejs`, { data: null, error: err, baseUrl: process.env.BASE_URL});
        } 
        let decodedToken = decoded
        const decodedUser = decodedToken.result.user_id;
        // check if user id exists in the database, if it does, set activated
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
                res.render(`auth/auth.ejs`, { data: null, error: null, baseUrl: process.env.BASE_URL });
              }
      
            }
          }
        );

      })

  });


module.exports = router