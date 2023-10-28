const express = require('express');
const router = express.Router();
const path = require('path');
const serveStatic = require('serve-static'); 


  router.get('/signin', function(req, res) {
    res.sendFile(`signin.html`, { root: 'static/auth' });
  });

  router.get('/signup', function(req, res) {
    res.sendFile(`signup.html`, { root: 'static/auth' });
  });

  

module.exports = router