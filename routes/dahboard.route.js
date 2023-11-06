const express = require('express');
const router = express.Router();
const path = require('path');
const serveStatic = require('serve-static'); 
const logout = require('../controllers/paystack.js');


router.get('/share', function(req, res) {
    res.sendFile(`share.html`, { root: 'static/dashboard' });
  });

  router.get('/create', function(req, res) {
    res.sendFile(`create.html`, { root: 'static/dashboard' });
  });

  router.get('/', function(req, res) {
    res.sendFile(`home.html`, { root: 'static/dashboard' });
  });

  router.get('/pricing', function(req, res) {
    res.sendFile(`pricing.html`, { root: 'static/dashboard' });
  });

  router.get('/upload/:id', function(req, res) {
    res.sendFile(`upload.html`, { root: 'static/dashboard' });
  });

  // router.post('/paystack', logout)


  

module.exports = router