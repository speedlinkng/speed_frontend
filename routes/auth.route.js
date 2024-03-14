const express = require('express');
const router = express.Router();
const path = require('path');
const request = require("request");
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


  router.get('/', function(req, res) {
    res.render(`auth/auth.ejs`, {data: null});
  });

  

module.exports = router