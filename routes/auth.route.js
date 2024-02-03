const express = require('express');
const router = express.Router();
const path = require('path');
const serveStatic = require('serve-static'); 
const {deTokenize} = require('./../middlewars/FunctionsController');
const {saveUserSession} = require('../handlers/Session_handler');



  router.get('/signin', saveUserSession);

  router.get('/signup', function(req, res) {
    res.sendFile(`auth.html`, { root: 'views/auth' });
  });

  router.get('/', function(req, res) {
    res.sendFile(`auth.html`, { root: 'views/auth' });
  });

  

module.exports = router